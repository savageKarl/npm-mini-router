function registerHook(list, fn) {
    list.push(fn);
    return () => {
        //等待调用的时候从中取出
        const i = list.indexOf(fn);
        if (i > -1)
            list.splice(i, 1);
    };
}

const routerRef = {
    ref: {},
};

class Router {
    constructor(routes) {
        this.params = null;
        this.route = {};
        this.toRoute = {};
        this.beforeHooks = [];
        this.afterHooks = [];
        this.routes = routes;
    }
    beforeEnter(fn) {
        registerHook(this.beforeHooks, fn);
    }
    afterEnter(fn) {
        registerHook(this.afterHooks, fn);
    }
    push(r) {
        if (!r.name && !r.path) {
            return;
        }
        this.params = r.params;
        return new Promise((resolve, reject) => {
            var _a;
            const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
            setTimeout(() => {
                if (route.type === "tab") {
                    wx[route.type === "tab" ? "switchTab" : "navigateTo"]({
                        url: route.path,
                        success: (res) => resolve(res),
                        fail: (err) => reject(err),
                    });
                }
            }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
        });
    }
    replace(r) {
        if (!r.name && !r.path) {
            return;
        }
        this.params = r.params;
        return new Promise((resolve, reject) => {
            var _a;
            const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
            setTimeout(() => {
                wx.redirectTo({
                    url: route.path,
                    success: (res) => resolve(res),
                    fail: (err) => reject(err),
                });
            }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
        });
    }
    back(r) {
        if (!r.name && !r.path && !r.level) {
            return;
        }
        this.params = r.params;
        this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
        let l;
        // level parameter first
        if (r.level)
            l = r.level;
        return new Promise((resolve, reject) => {
            var _a;
            setTimeout(() => {
                wx.navigateBack({
                    delta: l,
                    success: (res) => resolve(res),
                    fail: (err) => reject(err),
                });
            }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
        });
    }
    reLaunch(r) {
        if (!r.name && !r.path) {
            return;
        }
        this.params = r.params;
        return new Promise((resolve, reject) => {
            var _a;
            const route = this.routes.filter((item) => item.name === r.name || item.path === r.path)[0];
            setTimeout(() => {
                wx.reLaunch({
                    url: route.path,
                    success: (res) => resolve(res),
                    fail: (err) => reject(err),
                });
            }, (_a = r.delay) !== null && _a !== void 0 ? _a : 0);
        });
    }
    getPage(index = 1) {
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
function createRouter(config) {
    const router = new Router(config.routes);
    routerRef.ref = router;
    return router;
}

function injectRouter() {
    const originApp = App;
    App = function (options) {
        const newOptions = Object.assign(Object.assign({}, options), { onLaunch(o) {
                var _a;
                this.$router = routerRef.ref;
                (_a = options === null || options === void 0 ? void 0 : options.onLaunch) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        return originApp(newOptions);
    };
    const OriginPage = Page;
    Page = function (options) {
        const newOptions = Object.assign(Object.assign({}, options), { onLoad(o) {
                var _a;
                this.$router = routerRef.ref;
                (_a = options === null || options === void 0 ? void 0 : options.onLoad) === null || _a === void 0 ? void 0 : _a.call(this, o);
            } });
        return OriginPage(newOptions);
    };
    const OriginComponent = Component;
    Component = function (options) {
        const newOptions = Object.assign(Object.assign({}, options), { attached() {
                var _a;
                this.$router = routerRef.ref;
                (_a = options === null || options === void 0 ? void 0 : options.attached) === null || _a === void 0 ? void 0 : _a.call(this);
            }, lifetimes: {
                attached() {
                    var _a, _b;
                    this.$router = routerRef.ref;
                    (_b = (_a = options === null || options === void 0 ? void 0 : options.lifetimes) === null || _a === void 0 ? void 0 : _a.attached) === null || _b === void 0 ? void 0 : _b.call(this);
                },
            } });
        return OriginComponent(newOptions);
    };
}

export { createRouter, injectRouter };
//# sourceMappingURL=index.mjs.map
