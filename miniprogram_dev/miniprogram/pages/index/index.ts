import { router } from "../../router/index";

Page({
  data: {},
  onLoad() {
    // console.debug(this)
    // console.debug(getCurrentPages());
    setTimeout(() => {
      wx.navigateBack({ delta: 1 })
        .then((res) => {
          console.debug(res);
        })
        .catch((err) => {
          console.debug(err);
        });
      // this.$router.push({name: 'other'}).then(res => {
      //   console.debug(res)
      // }).catch(err=> {
      //   console.debug(err)
      // })
      // router.reLaunch({ name: 'other' });
    }, 2000);
  },
});
