import { router } from "../../router/index";

Page({
  data: {},
  onLoad() {
    // console.debug(router)
    // console.debug(this)
    // console.debug(getCurrentPages());

    router.push({ name: "log" });
    setTimeout(() => {
      // wx.navigateBack({delta: 1})
      router.back({ level: 1 });
    }, 1000);
  },
});
