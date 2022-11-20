import { router } from "../../router/index";

Page({
  data: {},
  onLoad() {
    // console.debug(this)
    // console.debug(getCurrentPages());

    setTimeout(() => {
      // wx.navigateBack({delta: 1})
      console.debug(this)
      // this.$router.push({name: 'other'})
      // router.reLaunch({ name: 'other' });
    }, 2000);
  },
});
