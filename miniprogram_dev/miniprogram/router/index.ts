import { createRouter, RouteConfigRaw } from "@savage181855/mini-router";

const routes: RouteConfigRaw[] = [
  {
    name: "index",
    path: "/pages/index/index",
  },
  {
    name: "log",
    path: "/pages/log/log",
  },
];

export const router = createRouter({ routes });

router.beforeEnter((from, to, next) => {
  console.debug(from, to, next, '1');
  // debugger;
  next();
});

router.beforeEnter((from, to, next) => {
  console.debug(from, to, next, '2');
  // debugger;
  next();
});

router.onRouteSuccess(function(res)  {
  console.debug(res);
})

router.onRouteFail(function(res)  {
  console.debug(res);
})