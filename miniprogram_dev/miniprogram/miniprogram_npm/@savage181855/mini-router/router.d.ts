/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
import { RouteConfigRaw, RouteOptions, CallbackResult, Callback, RouteBackOptions } from "./types";
declare class Router {
    constructor(routes: RouteConfigRaw[]);
    private params;
    private routes;
    route: RouteOptions | RouteBackOptions;
    private toRoute;
    private jumpFn;
    private beforeHooks;
    private afterHooks;
    private routeSuccessFns;
    private routeFailFns;
    beforeEnter(fn: Callback): void;
    afterEnter(fn: Callback): void;
    push(r: RouteOptions): void;
    replace(r: RouteOptions): void;
    back(r: RouteBackOptions): void;
    reLaunch(r: RouteOptions): void;
    private getPage;
    private handleRouteGuard;
    onRouteSuccess(fn: (o: CallbackResult) => any): () => void;
    onRouteFail(fn: (o: CallbackResult) => any): () => void;
    getCurrPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
    getPrevPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
    getParams(): any;
}
export declare function createRouter(config: {
    routes: RouteConfigRaw[];
}): Router;
export {};
