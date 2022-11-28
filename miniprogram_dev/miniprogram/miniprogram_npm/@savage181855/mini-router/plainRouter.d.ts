/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
import { PlainRouteOptions, CallbackResult, Callback, RouteBackOptions } from "./types";
export declare class PlainRouter {
    constructor();
    private params;
    route: string | null;
    private toRoute;
    private jumpObject;
    private beforeHooks;
    private afterHooks;
    private routeSuccessFns;
    private routeFailFns;
    beforeEnter(fn: Callback): void;
    afterEnter(fn: Callback): void;
    private routeOptionsCheck;
    navigateTo(r: PlainRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult>;
    switchTab(r: PlainRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult>;
    redirectTo(r: PlainRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult>;
    navigateBack(r: RouteBackOptions<PlainRouteOptions>): Promise<WechatMiniprogram.GeneralCallbackResult>;
    reLaunch(r: PlainRouteOptions): Promise<WechatMiniprogram.GeneralCallbackResult>;
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
