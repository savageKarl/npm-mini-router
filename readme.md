# mini-router

> 微信小程序路由器，轻量，优雅，高效

# 安装

```
npm i @savage181855/mini-router -S
```

# 功能

- 传递参数不需要序列化
- 提供导航守卫进行路由拦截
- 跳转和返回会进行页面栈的判断，优先返回页面栈里面存在的页面

# 使用说明

这里提供了两种路由器`PlainRouter`和`AdvanceRouter`

**准备工作**

新建`index`、`log`和`other`等三个页面，并且在`app.json`里面把`log`和`other`页面配置为`tabBar`页面


## AdvanceRouter

新建`router.js`

```typescript
import { AdvanceRouter, RouteConfigRaw } from "@savage181855/mini-router";

// 需要维护一个路由记录
const routes: RouteConfigRaw[] = [
  {
    name: "index",
    path: "/pages/index/index",
  },
  {
    name: "log",
    path: "/pages/log/log",
    type: "tab",
  },
  {
    name: "other",
    type: "tab",
    path: "/pages/other/other",
  },
];

export const router = new AdvanceRouter(routes);
router.beforeEnter((from, to, next) => {
  next();
});

router.afterEnter((from, to) => {
  console.debug(from, to, "afterEnter");
});

router.onRouteSuccess(function (res) {
  console.debug(res);
});

router.onRouteFail(function (res) {
  console.debug(res);
});
```

在`app.js`中注入路由器

```typescript
import { router } from "./router/index";

// 这样子可以在页面或组件中直接通过 this.$router 访问路由器
// 注意：这个方法必须在最顶部进行调用
router.inject();

App<IAppOption>({
  globalData: {},
  onLaunch() {
    console.debug(this);
  },
});
```

修改`index.js`

```typescript
import { router } from "../../router/index";

Page({
  onLoad() {
    setTimeout(() => {
      router
        .push({ name: "other", params: "i am params" })
        .then((res) => {
          console.debug(res);
        })
        .catch((err) => {
          console.debug(err);
        });

      // 或者使用这种方式
      // this.$router
      //   .push({ name: "other", params: "i am params" })
      //   .then((res) => {
      //     console.debug(res);
      //   })
      //   .catch((err) => {
      //     console.debug(err);
      //   });
    }, 2000);
  },
});
```

修改`other.js`

```typescript
import { router } from "../../router/index";

Page({
  onLoad() {
    // 获取上个页面传递的数据
    console.debug(router.getParams());
    // 或者使用这种方式
    // console.debug(this.$router.getParams());
  },
});
```

# API 说明

## PlainRouter

```typescript
import { PlainRouter, RouteConfigRaw } from "@savage181855/mini-router";

export const router = new PlainRouter();
router.beforeEnter((from, to, next) => {
  next();
});

router.afterEnter((from, to) => {
  console.debug(from, to, "afterEnter");
});

router.onRouteSuccess(function (res) {
  console.debug(res);
});

router.onRouteFail(function (res) {
  console.debug(res);
});
```

在`app.js`中注入路由器

```typescript
import { router } from "./router/index";

// 这样子可以在页面或组件中直接通过 this.$router 访问路由器
// 注意：这个方法必须在最顶部进行调用
router.inject();

App<IAppOption>({
  globalData: {},
  onLaunch() {
    console.debug(this);
  },
});
```

修改`index.js`

```typescript
import { router } from "../../router/index";

Page({
  onLoad() {
    setTimeout(() => {
      // path 参数必须跟 app.json 配置的一样
      router
        .push({ path: "/pages/log/log", params: "i am params" })
        .then((res) => {
          console.debug(res);
        })
        .catch((err) => {
          console.debug(err);
        });

      // 或者使用这种方式
      // this.$router
      //   .push({ path: "/pages/log/log", params: "i am params" })
      //   .then((res) => {
      //     console.debug(res);
      //   })
      //   .catch((err) => {
      //     console.debug(err);
      //   });
    }, 2000);
  },
});
```

修改`other.js`

```typescript
import { router } from "../../router/index";

Page({
  onLoad() {
    // 获取上个页面传递的数据
    console.debug(router.getParams());
    // 或者使用这种方式
    // console.debug(this.$router.getParams());
  },
});
```

## 方法

- beforeEnter() 前置守卫

```javascript
router.afterEnter((from, to) => {
  console.debug(from, to, "afterEnter");
});
```

- afterEnter() 后置守卫
- navigateTo
- switchTab
- redirectTo
- navigateBack
- reLaunch
- onRouteSuccess 监听路由导航成功
- onRouteFail 监听路由导航成功
- getCurrPage 获取当前页面
- getPrevPage 获取上一个页面
- getParams 获取页面传递的参数
- inject 注入路由，可以从 this.$router 访问路由

## AdvanceRouter

- beforeEnter() 前置守卫

```javascript
router.afterEnter((from, to) => {
  console.debug(from, to, "afterEnter");
});
```

- afterEnter() 后置守卫
- push 代替 switchTab 和 navigateTo
- replace 代替 redirectTo
- back 代替 navigateBack
- reLaunch
- onRouteSuccess 监听路由导航成功
- onRouteFail 监听路由导航成功
- getCurrPage 获取当前页面
- getPrevPage 获取上一个页面
- getParams 获取页面传递的参数
- inject 注入路由，可以从 this.$router 访问路由
