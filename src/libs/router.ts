import {
  RouteConfigRaw,
  RouteOptions,
  RouteNameOptions,
  CallbackResult,
  Callback,
  RouteBackOptions,
  BeforeHookRouteOptions,
} from "./types";

import { registerHook, runQueue } from "./utils";
import {injectRouter} from './injectRouter'


class Router {
  constructor(routes: RouteConfigRaw[]) {
    this.routes = routes;
  }

  private params: any = null;
  private routes: RouteConfigRaw[];
  route: RouteConfigRaw | null = null;
  private toRoute: RouteConfigRaw | null = null;
  private jumpFn = function () {} as Callback<Promise<CallbackResult>>;

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

  push(r: RouteOptions) {
    if (!r.name && !r.path) {
      return;
    }
    this.params = r.params;
    this.toRoute = this.getCurrentRoute();
    this.jumpFn = () => {
      return new Promise((resolve, reject) => {
        const route = this.routes.filter(
          (item) => item.name === r.name || item.path === r.path
        )[0];
        setTimeout(() => {
          if (route?.type === "tab") {
            wx.switchTab({
              url: route.path,
              success: (res: CallbackResult) => resolve(res),
              fail: (err: CallbackResult) => reject(err),
            });
          }

          const pages = getCurrentPages();
          const index = pages.findIndex((item) => {
            "/" + item.route === route?.path;
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
              url: route?.path,
              success: (res: CallbackResult) => resolve(res),
              fail: (err: CallbackResult) => reject(err),
            });
          }
        }, r.delay ?? 0);
      });
    };
    this.handleRouteGuard();
  }

  replace(r: RouteOptions) {
    if (!r.name && !r.path) {
      return;
    }
    this.params = r.params;
    this.toRoute = this.getCurrentRoute();

    this.jumpFn = () => {
      return new Promise((resolve, reject) => {
        const route = this.routes.filter(
          (item) => item.name === r.name || item.path === r.path
        )[0];
        setTimeout(() => {
          wx.redirectTo({
            url: route.path,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      });
    };

    this.handleRouteGuard();
  }

  back(r: RouteBackOptions) {
    if (!r.name && !r.path && !r.level) {
      return;
    }
    this.params = r.params;
    this.toRoute = this.getCurrentRoute();

    const route = this.routes.filter(
      (item) => item.name === r.name || item.path === r.path
    )[0];

    let level: number;
    if (r.level) {
      level = r.level;
    } else {
      const pages = getCurrentPages();
      const index = pages.findIndex((item) => {
        item.route === route?.path;
      });
      if (index !== -1) {
        level = pages.length - index;
      }
    }
    this.jumpFn = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          wx.navigateBack({
            delta: level,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      });
    };

    this.handleRouteGuard();
  }

  reLaunch(r: RouteOptions) {
    if (!r.name && !r.path) {
      return;
    }
    this.params = r.params;
    this.toRoute = this.getCurrentRoute();

    this.jumpFn = () => {
      return new Promise((resolve, reject) => {
        const route = this.routes.filter(
          (item) => item.name === r.name || item.path === r.path
        )[0];
        setTimeout(() => {
          wx.reLaunch({
            url: route.path,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }, r.delay ?? 0);
      });
    };
    this.handleRouteGuard();
  }

  private getPage(index = 1) {
    const pages = getCurrentPages();
    return pages[pages.length - index];
  }

  private handleRouteGuard() {
    const queue = this.beforeHooks;

    const iterator = (hook: Callback, next: Callback) => {
      try {
        hook(this.route, this.toRoute, (to: BeforeHookRouteOptions) => {
          if (to === false) {
            // TODO 打断路由
          } else if (
            typeof to === "object" &&
            (typeof to.path === "string" || typeof to.name === "string")
          ) {
            to.replace ? this.replace(to) : this.push(to);
          } else if (typeof to === "string") {
            this.push({ name: to, path: to });
          } else {
            next(to);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    runQueue(queue, iterator, () => {
      // debugger;
      this.jumpFn()
        .then((res) => {
          this.afterHooks.forEach(fn=> fn(this.route, this.toRoute));
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
    const route = this.routes.filter((item) => item.path === "/" + url)[0];
    return route;
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

export function createRouter(config: { routes: RouteConfigRaw[] }) {
  const router = new Router(config.routes);
  return router;
}
