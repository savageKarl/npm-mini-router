function registerHook(list, fn) {
    list.push(fn);
    return () => {
        //等待调用的时候从中取出
        const i = list.indexOf(fn);
        if (i > -1)
            list.splice(i, 1);
    };
}
function runQueue(queue, fn, cb) {
    const step = (index) => {
        if (index >= queue.length) {
            cb();
        }
        else {
            if (queue[index]) {
                fn(queue[index], () => {
                    step(index + 1);
                });
            }
            else {
                step(index + 1);
            }
        }
    };
    step(0);
}

function injectRouter(router) {
    const originApp = App;
    App = function (options) {
        const newOptions = Object.assign(Object.assign({}, options), { onLaunch(o) {
                var _a;
                this.$router = router;
                (_a = options === null || options === void 0 ? void 0 : options.onLaunch) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        return originApp(newOptions);
    };
    const OriginPage = Page;
    Page = function (options) {
        const newOptions = Object.assign(Object.assign({}, options), { onLoad(o) {
                var _a;
                this.$router = router;
                (_a = options === null || options === void 0 ? void 0 : options.onLoad) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        return OriginPage(newOptions);
    };
    const OriginComponent = Component;
    Component = function (options) {
        const newOptions = Object.assign(Object.assign({}, options), { attached() {
                var _a;
                this.$router = router;
                (_a = options === null || options === void 0 ? void 0 : options.attached) === null || _a === void 0 ? void 0 : _a.call(this);
            }, lifetimes: {
                attached() {
                    var _a, _b;
                    this.$router = router;
                    (_b = (_a = options === null || options === void 0 ? void 0 : options.lifetimes) === null || _a === void 0 ? void 0 : _a.attached) === null || _b === void 0 ? void 0 : _b.call(this);
                },
            } });
        return OriginComponent(newOptions);
    };
}

class AdvanceRouter {
    constructor(routes) {
        this.params = null;
        this.route = null;
        this.toRoute = null;
        this.jumpObject = {};
        this.beforeHooks = [];
        this.afterHooks = [];
        this.routeSuccessFns = [];
        this.routeFailFns = [];
        this.routes = routes;
    }
    beforeEnter(fn) {
        registerHook(this.beforeHooks, fn);
    }
    afterEnter(fn) {
        registerHook(this.afterHooks, fn);
    }
    routeOptionsCheck(r) {
        if (!r.name && !r.path)
            return false;
        this.params = r.params;
        this.toRoute = this.getCurrentRoute();
        return true;
    }
    push(r) {
        if (!this.routeOptionsCheck(r))
            return;
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
                setTimeout(() => {
                    if ((route === null || route === void 0 ? void 0 : route.type) === "tab") {
                        wx.switchTab({
                            url: route.path,
                            success: (res) => resolve(res),
                            fail: (err) => reject(err),
                        });
                    }
                    const pages = getCurrentPages();
                    const index = pages.findIndex((item) => {
                        "/" + item.route === (route === null || route === void 0 ? void 0 : route.path);
                    });
                    if (index !== -1) {
                        const level = pages.length - index;
                        wx.navigateBack({
                            delta: level,
                            success: (res) => resolve(res),
                            fail: (err) => reject(err),
                        });
                    }
                    else {
                        wx[pages.length === 10 ? "redirectTo" : "navigateTo"]({
                            url: route === null || route === void 0 ? void 0 : route.path,
                            success: (res) => resolve(res),
                            fail: (err) => reject(err),
                        });
                    }
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    replace(r) {
        if (!this.routeOptionsCheck(r))
            return;
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
                setTimeout(() => {
                    wx.redirectTo({
                        url: route.path,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    back(r) {
        if (!this.routeOptionsCheck(r))
            return;
        const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
        let level;
        if (r.level) {
            level = r.level;
        }
        else {
            const pages = getCurrentPages();
            const index = pages.findIndex((item) => {
                item.route === (route === null || route === void 0 ? void 0 : route.path);
            });
            if (index !== -1) {
                level = pages.length - index;
            }
        }
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                setTimeout(() => {
                    wx.navigateBack({
                        delta: level,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    reLaunch(r) {
        if (!this.routeOptionsCheck(r))
            return;
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
                setTimeout(() => {
                    wx.reLaunch({
                        url: route.path,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    getPage(index = 1) {
        const pages = getCurrentPages();
        return pages[pages.length - index];
    }
    handleRouteGuard() {
        const queue = this.beforeHooks;
        const iterator = (hook, next) => {
            try {
                hook(this.route, this.toRoute, (to) => {
                    if (to === false) {
                        this.jumpObject.reject({ msg: "this route has been blocked" });
                    }
                    else if (typeof to === "object" &&
                        (typeof to.path === "string" || typeof to.name === "string")) {
                        to.replace ? this.replace(to) : this.push(to);
                    }
                    else if (typeof to === "string") {
                        this.push({ name: to, path: to });
                    }
                    else {
                        next(to);
                    }
                });
            }
            catch (error) {
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
    getCurrentRoute() {
        const url = this.getCurrPage().route;
        const route = this.routes.filter((item) => item.path === "/" + url)[0];
        return route;
    }
    onRouteSuccess(fn) {
        return registerHook(this.routeSuccessFns, fn);
    }
    onRouteFail(fn) {
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
        return p;
    }
    inject() {
        injectRouter(this);
    }
}

class PlainRouter {
    constructor() {
        this.params = null;
        this.route = null;
        this.toRoute = null;
        this.jumpObject = {};
        this.beforeHooks = [];
        this.afterHooks = [];
        this.routeSuccessFns = [];
        this.routeFailFns = [];
    }
    beforeEnter(fn) {
        registerHook(this.beforeHooks, fn);
    }
    afterEnter(fn) {
        registerHook(this.afterHooks, fn);
    }
    routeOptionsCheck(r) {
        if (!r.path)
            return false;
        this.params = r.params;
        this.toRoute = this.getCurrentRoute();
        return true;
    }
    navigateTo(r) {
        if (!this.routeOptionsCheck(r))
            return Promise.reject("The path parameter must be provided");
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                setTimeout(() => {
                    const pages = getCurrentPages();
                    const index = pages.findIndex((item) => {
                        "/" + item.route === (r === null || r === void 0 ? void 0 : r.path);
                    });
                    if (index !== -1) {
                        const level = pages.length - index;
                        wx.navigateBack({
                            delta: level,
                            success: (res) => resolve(res),
                            fail: (err) => reject(err),
                        });
                    }
                    else {
                        wx[pages.length === 10 ? 'redirectTo' : 'navigateTo']({
                            url: r === null || r === void 0 ? void 0 : r.path,
                            success: (res) => resolve(res),
                            fail: (err) => reject(err),
                        });
                    }
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    switchTab(r) {
        if (!this.routeOptionsCheck(r))
            return Promise.reject("The path parameter must be provided");
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                setTimeout(() => {
                    wx.switchTab({
                        url: r.path,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    redirectTo(r) {
        if (!this.routeOptionsCheck(r))
            return Promise.reject("The path parameter must be provided");
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                setTimeout(() => {
                    wx.redirectTo({
                        url: r.path,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    navigateBack(r) {
        if (!this.routeOptionsCheck(r))
            return Promise.reject("The path parameter must be provided");
        let level;
        if (r.level) {
            level = r.level;
        }
        else {
            const pages = getCurrentPages();
            const index = pages.findIndex((item) => {
                item.route === (r === null || r === void 0 ? void 0 : r.path);
            });
            if (index !== -1) {
                level = pages.length - index;
            }
        }
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                setTimeout(() => {
                    wx.navigateBack({
                        delta: level,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    reLaunch(r) {
        if (!this.routeOptionsCheck(r))
            return Promise.reject("The path parameter must be provided");
        const obj = {};
        const promise = new Promise((resolve, reject) => {
            obj.resolve = resolve;
            obj.reject = reject;
            obj.fn = () => {
                var _a;
                setTimeout(() => {
                    wx.reLaunch({
                        url: r.path,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
            };
        });
        obj.promise = promise;
        this.jumpObject = obj;
        this.handleRouteGuard();
        return promise;
    }
    getPage(index = 1) {
        const pages = getCurrentPages();
        return pages[pages.length - index];
    }
    handleRouteGuard() {
        const queue = this.beforeHooks;
        const iterator = (hook, next) => {
            try {
                hook(this.route, this.toRoute, (to) => {
                    if (to === false) {
                        this.jumpObject.reject({ msg: "this route has been blocked" });
                    }
                    else if (typeof to === "object" && typeof to.path === "string") {
                        to.type === "redirect" ? this.redirectTo(to) : "";
                        to.type === "switchTab" ? this.switchTab(to) : "";
                        to.type === "navigate" ? this.navigateTo(to) : "";
                    }
                    else {
                        next(to);
                    }
                });
            }
            catch (error) {
                console.error(error);
            }
        };
        runQueue(queue, iterator, () => {
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
    getCurrentRoute() {
        const url = this.getCurrPage().route;
        return url;
    }
    onRouteSuccess(fn) {
        return registerHook(this.routeSuccessFns, fn);
    }
    onRouteFail(fn) {
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
        return p;
    }
    inject() {
        injectRouter(this);
    }
}

export { AdvanceRouter, PlainRouter, injectRouter };
//# sourceMappingURL=index.js.map
