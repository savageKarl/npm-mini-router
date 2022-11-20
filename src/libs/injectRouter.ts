import { routerRef } from "./routerRef";

import { AppOptions, PageOptions, ComponentOptions } from "./types";

export function injectRouter() {
  const originApp = App;
  App = function (options: AppOptions) {
    const newOptions = {
      ...options,
      onLaunch(o: WechatMiniprogram.App.LaunchShowOption) {
        this.$router = routerRef.ref;
        options?.onLaunch?.call(this, o);
      },
    } as AppOptions;

    return originApp(newOptions);
  } as any;

  const OriginPage = Page;
  Page = function (options: PageOptions) {
    const newOptions: PageOptions = {
      ...options,
      onLoad(o) {
        this.$router = routerRef.ref;
        options?.onLoad?.call(this, o);
      },
    };
    return OriginPage(newOptions);
  } as any;

  const OriginComponent = Component;
  Component = function (options: ComponentOptions) {
    const newOptions: ComponentOptions = {
      ...options,
      attached() {
        this.$router = routerRef.ref;
        options?.attached?.call(this);
      },
      lifetimes: {
        attached() {
          this.$router = routerRef.ref;
          options?.lifetimes?.attached?.call(this);
        },
      },
    };

    return OriginComponent(newOptions);
  } as any;
}
