import {Callback} from './types'

export function registerHook(list:Callback[], fn:Callback) {
  list.push(fn);
  return () => {
    //等待调用的时候从中取出
    const i = list.indexOf(fn);
    if (i > -1) list.splice(i, 1);
  };
}


export function runQueue(queue:Callback[], fn:Callback, cb:Callback) {
  const step = (index: number) => {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

