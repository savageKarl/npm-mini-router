import { createRouter, RouteConfigRaw } from "@savage181855/mini-router";

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

export const router = createRouter({ routes });
router.beforeEnter((from, to, next) => {
  next();
});

router.afterEnter((from, to) => {
  console.debug(from, to, "afterEnter");
  // debugger;
});

router.afterEnter((from, to) => {
  console.debug(from, to, "afterEnter2");
  // debugger;
});
// router.beforeEnter((from, to, next) => {
//   console.debug(from, to, next, '2');
//   // debugger;
//   next();
// });

router.onRouteSuccess(function (res) {
  console.debug(res);
});

router.onRouteFail(function (res) {
  console.debug(res);
});
