import {router} from './router/index'

router.inject();

App<IAppOption>({
  globalData: {},
  onLaunch() {
    console.debug(this)
  }
})