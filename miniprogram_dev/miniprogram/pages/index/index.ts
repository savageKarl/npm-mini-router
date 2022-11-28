import { router } from "../../router/index";

Page({
  data: {},
  onLoad() {
    setTimeout(() => {
      // router
      //   .push({ name: "other" })
      //   .then((res) => {
      //     console.debug(res);
      //   })
      //   .catch((err) => {
      //     console.debug(err);
      //   });

        router
        .redirectTo({ path: "/pages/log/log", params: { foo: 'bar'} })
        .then((res) => {
          console.debug(res);
        })
        .catch((err) => {
          console.debug(err);
        });

      // 或者使用这种方式
      // this.$router
      //   .push({ name: "other" })
      //   .then((res) => {
      //     console.debug(res);
      //   })
      //   .catch((err) => {
      //     console.debug(err);
      //   });
    }, 2000);
  },
});
