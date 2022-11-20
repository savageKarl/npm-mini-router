/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
import { RouteConfigRaw, RouteOptions, Callback, RouteBackOptions } from "./types";
declare class Router {
    constructor(routes: RouteConfigRaw[]);
    private params;
    private routes;
    private route;
    private toRoute;
    private beforeHooks;
    private afterHooks;
    beforeEnter(fn: Callback): void;
    afterEnter(fn: Callback): void;
    push(r: RouteOptions): Promise<unknown> | undefined;
    replace(r: RouteOptions): Promise<unknown> | undefined;
    back(r: RouteBackOptions): Promise<unknown> | undefined;
    reLaunch(r: RouteOptions): Promise<unknown> | undefined;
    private getPage;
    getCurrPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
    getPrevPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
    getParams(): any;
}
export declare function createRouter(config: {
    routes: RouteConfigRaw[];
}): Router;
export {};
