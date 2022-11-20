import {
  RouteConfigRaw,
  RouteOptions,
  RouteNameOptions,
  CallbackResult,
  Callback,
  RouteBackOptions,
} from "./types";

import { registerHook, runQueue } from "./utils";

import { routerRef } from "./routerRef";

class Router {
  constructor(routes: RouteConfigRaw[]) {
    this.routes = routes;
  }

  private params: any = null;
  private routes: RouteConfigRaw[];
  private route = {} as RouteOptions | RouteBackOptions;
  private toRoute = {} as RouteOptions | RouteBackOptions;

  private beforeHooks: Callback[] = [];
  private afterHooks: Callback[] = [];

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
    return new Promise((resolve, reject) => {
      const route = this.routes.filter(
        (item) => item.name === r.name || item.path === r.path
      )[0];
      setTimeout(() => {
        if (route.type === "tab") {
          (wx as any)[route.type === "tab" ? "switchTab" : "navigateTo"]({
            url: route.path,
            success: (res: CallbackResult) => resolve(res),
            fail: (err: CallbackResult) => reject(err),
          });
        }
      }, r.delay ?? 0);
    });
  }

  replace(r: RouteOptions) {
    if (!r.name && !r.path) {
      return;
    }
    this.params = r.params;
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
  }

  back(r: RouteBackOptions) {
    if (!r.name && !r.path && !r.level) {
      return;
    }
    this.params = r.params;
    const route = this.routes.filter(
      (item) => item.name === r.name || item.path === r.path
    )[0];

    let l: number;

    // level parameter first
    if (r.level) l = r.level;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wx.navigateBack({
          delta: l,
          success: (res: CallbackResult) => resolve(res),
          fail: (err: CallbackResult) => reject(err),
        });
      }, r.delay ?? 0);
    });
  }

  reLaunch(r: RouteOptions) {
    if (!r.name && !r.path) {
      return;
    }
    this.params = r.params;
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
  }

  private getPage(index = 1) {
    const pages = getCurrentPages();
    return pages[pages.length - index];
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
}

const routes: RouteConfigRaw[] = [
  {
    name: "index",
    type: "tab",
    path: "/pages/index/index",
  },
  {
    name: "index",
    path: "/pages/index/index",
  },
];

export function createRouter(config: { routes: RouteConfigRaw[] }) {
  const router = new Router(config.routes);
  routerRef.ref = router;
  return router;
}
