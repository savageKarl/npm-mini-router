import { AdvanceRouter,PlainRouter, RouteConfigRaw } from "@savage181855/mini-router";

// const routes: RouteConfigRaw[] = [
//   {
//     name: "index",
//     path: "/pages/index/index",
//   },
//   {
//     name: "log",
//     path: "/pages/log/log",
//     type: "tab",
//   },
//   {
//     name: "other",
//     type: "tab",
//     path: "/pages/other/other",
//   },
// ];

// export const router = new AdvanceRouter(routes);
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
