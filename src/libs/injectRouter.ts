import { AppOptions, PageOptions, ComponentOptions } from "./types";

export function injectRouter(router: any) {
  const originApp = App;
  App = function (options: AppOptions) {
    const newOptions = {
      ...options,
      onLaunch(o: WechatMiniprogram.App.LaunchShowOption) {
        this.$router = router;
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
        this.$router = router;
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
        this.$router = router;
        options?.attached?.call(this);
      },
      lifetimes: {
        attached() {
          this.$router = router;
          options?.lifetimes?.attached?.call(this);
        },
      },
    };

    return OriginComponent(newOptions);
  } as any;
}
