export interface RouteConfigRaw {
  type?: "tab";
  path: string;
  name: string;
  meta?: WechatMiniprogram.IAnyObject;
}

export type RouteNameOptions = {
  name: string;
  params: WechatMiniprogram.IAnyObject;
};

export type RoutePathOptions = {
  path: string;
  params: WechatMiniprogram.IAnyObject;
};

export type AdvanceRouteOptions = {
  name?: string;
  path?: string;
  params?: WechatMiniprogram.IAnyObject;
  delay?: number;
};

export type PlainRouteOptions = {
  path: string;
  params?: WechatMiniprogram.IAnyObject;
  delay?: number;
};

export type RouteBackOptions<T> = T & { level?: number };

export type CallbackResult = WechatMiniprogram.GeneralCallbackResult;
export type Callback<R = any> = (...args: any) => R;

export type AppOptions = WechatMiniprogram.App.Options<{ $router: any }>;
export type PageOptions = WechatMiniprogram.Page.Options<{}, { $router: any }>;
export type ComponentOptions = WechatMiniprogram.Component.Options<
  {},
  {},
  {},
  { $router: any }
>;

export type AdvanceBeforeHookRouteOptions =
  | (AdvanceRouteOptions & {
      replace?: boolean;
    })
  | false
  | string;

export type PlainBeforeHookRouteOptions =
  | (PlainRouteOptions & { type: "navigate" | "switchTab" | "redirect" })
  | false;

export type JumpObject = {
  promise: Promise<CallbackResult>;
  resolve: Callback;
  reject: Callback;
  fn: Callback;
};
