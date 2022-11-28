/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
import { RouteConfigRaw, AdvanceRouteOptions, CallbackResult, Callback, RouteBackOptions } from "./types";
export declare class AdvanceRouter {
    constructor(routes: RouteConfigRaw[]);
    private params;
    private routes;
    route: RouteConfigRaw | null;
    private toRoute;
    private jumpObject;
    private beforeHooks;
    private afterHooks;
    private routeSuccessFns;
    private routeFailFns;
    beforeEnter(fn: Callback): void;
    afterEnter(fn: Callback): void;
    routeOptionsCheck(r: AdvanceRouteOptions): boolean;
    push(r: AdvanceRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult> | undefined;
    replace(r: AdvanceRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult> | undefined;
    back(r: RouteBackOptions<AdvanceRouteOptions>): Promise<WechatMiniprogram.GeneralCallbackResult> | undefined;
    reLaunch(r: AdvanceRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult> | undefined;
    private getPage;
    private handleRouteGuard;
    private getCurrentRoute;
    onRouteSuccess(fn: (o: CallbackResult) => any): () => void;
    onRouteFail(fn: (o: CallbackResult) => any): () => void;
    getCurrPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
    getPrevPage(): WechatMiniprogram.Page.Instance<WechatMiniprogram.IAnyObject, WechatMiniprogram.IAnyObject>;
    getParams(): any;
    inject(): void;
}
