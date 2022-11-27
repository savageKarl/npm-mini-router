import {
  RouteConfigRaw,
  PlainRouteOptions,
  CallbackResult,
  Callback,
  RouteBackOptions,
  AdvanceBeforeHookRouteOptions,
  JumpObject,
  PlainBeforeHookRouteOptions,
} from "./types";

import { registerHook, runQueue } from "./utils";
import { injectRouter } from "./injectRouter";

export class PlainRouter {
  constructor() {}

  private params: any = null;
  route: string | null = null;
  private toRoute: string | null = null;
  private jumpObject = {} as JumpObject;

  private beforeHooks: Callback[] = [];
  private afterHooks: Callback[] = [];

  private routeSuccessFns: Callback[] = [];
  private routeFailFns: Callback[] = [];

  beforeEnter(fn: Callback) {
    registerHook(this.beforeHooks, fn);
  }

  afterEnter(fn: Callback) {
    registerHook(this.afterHooks, fn);
  }

  routeOptionsCheck(r: PlainRouteOptions) {
    if (!r.path) return false;
    this.params = r.params;
    this.toRoute = this.getCurrentRoute();
    return true;
  }

  navigateTo(r: PlainRouteOptions) {
    if (!this.routeOptionsCheck(r)) return;

    const obj = {} as JumpObject;
    const promise = new Promise<CallbackResult>((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
      obj.fn = () => {
        setTimeout(() => {
          const pages = getCurrentPages();
          const index = pages.findIndex((item) => {
            "/" + item.route === r?.path;
          });

          if (index !== -1) {
            const level = pages.length - index;
            wx.navigateBack({
              delta: level,
              success: (res: CallbackResult) => resolve(res),
              fail: (err: CallbackResult) => reject(err),
            });
          } else {
            wx.navigateTo({
              url: r?.path,
              success: (res: CallbackResult) => resolve(res),
              fail: (err: CallbackResult) => reject(err),
            });
          }
        }, r.delay ?? 0);
      };
    });

    obj.promise = promise;
    this.jumpObject = obj;
    this.handleRouteGuard();

    return promise;
  }

  switchTab(r: PlainRouteOptions) {
    if (!this.routeOptionsCheck(r)) return;

    const obj = {} as JumpObject;
    const promise = new Promise<CallbackResult>((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
      obj.fn = () => {
        setTimeout(() => {
          wx.switchTab({
            url: r.path,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      };
    });

    obj.promise = promise;
    this.jumpObject = obj;
    this.handleRouteGuard();

    return promise;
  }

  redirectTo(r: PlainRouteOptions) {
    if (!this.routeOptionsCheck(r)) return;

    const obj = {} as JumpObject;
    const promise = new Promise<CallbackResult>((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
      obj.fn = () => {
        setTimeout(() => {
          wx.redirectTo({
            url: r.path,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      };
    });

    obj.promise = promise;
    this.jumpObject = obj;
    this.handleRouteGuard();

    return promise;
  }

  navigateBack(r: RouteBackOptions<PlainRouteOptions>) {
    if (!this.routeOptionsCheck(r)) return;

    let level: number;
    if (r.level) {
      level = r.level;
    } else {
      const pages = getCurrentPages();
      const index = pages.findIndex((item) => {
        item.route === r?.path;
      });
      if (index !== -1) {
        level = pages.length - index;
      }
    }

    const obj = {} as JumpObject;
    const promise = new Promise<CallbackResult>((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
      obj.fn = () => {
        setTimeout(() => {
          wx.navigateBack({
            delta: level,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      };
    });

    obj.promise = promise;
    this.jumpObject = obj;
    this.handleRouteGuard();

    return promise;
  }

  reLaunch(r: PlainRouteOptions) {
    if (!this.routeOptionsCheck(r)) return;

    const obj = {} as JumpObject;
    const promise = new Promise<CallbackResult>((resolve, reject) => {
      obj.resolve = resolve;
      obj.reject = reject;
      obj.fn = () => {
        setTimeout(() => {
          wx.reLaunch({
            url: r.path,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      };
    });

    obj.promise = promise;
    this.jumpObject = obj;
    this.handleRouteGuard();

    return promise;
  }

  private getPage(index = 1) {
    const pages = getCurrentPages();
    return pages[pages.length - index];
  }

  private handleRouteGuard() {
    const queue = this.beforeHooks;

    const iterator = (hook: Callback, next: Callback) => {
      try {
        hook(this.route, this.toRoute, (to: PlainBeforeHookRouteOptions) => {
          if (to === false) {
            this.jumpObject.reject({ msg: "this route has been blocked" });
          } else if (typeof to === "object" && typeof to.path === "string") {
            to.type === "redirect" ? this.redirectTo(to) : "";
            to.type === "switchTab" ? this.switchTab(to) : "";
            to.type === "navigate" ? this.navigateTo(to) : "";
          } else {
            next(to);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    runQueue(queue, iterator, () => {
      // debugger;
      this.jumpObject.fn();

      this.jumpObject.promise
        .then((res) => {
          this.afterHooks.forEach((fn) => fn(this.route, this.toRoute));
          this.routeSuccessFns.forEach((item) => item(res));
          this.route = this.getCurrentRoute();
          this.toRoute = null;
        })
        .catch((err) => {
          this.routeFailFns.forEach((item) => item(err));
        });
    });
  }

  private getCurrentRoute() {
    const url = this.getCurrPage().route;
    return url;
  }

  onRouteSuccess(fn: (o: CallbackResult) => any) {
    return registerHook(this.routeSuccessFns, fn);
  }

  onRouteFail(fn: (o: CallbackResult) => any) {
    return registerHook(this.routeFailFns, fn);
  }

  getCurrPage() {
    return this.getPage(1);
  }

  getPrevPage() {
    return this.getPage(2);
  }

  getParams() {
    const p = this.params;
    this.params = null;
    return p;
  }

  inject() {
    injectRouter(this);
  }
}
