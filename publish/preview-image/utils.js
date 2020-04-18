/* eslint-disable */

/**
 * 动画效果函数
 * @params t { number } 动画已执行次数
 * @params b { number } 当前位置
 * @params c { number } 变化量 目标位置 - 当前位置
 * @params d { number } 动画共需要执行多少次
 * @return { number }
 */
export const Quad = (t, b, c, d) => {
  return (-c * (t /= d) * (t - 2) + b);
};


/**
 * requestAnimationFrame 兼容处理
 */
(function () {
  if (window.requestAnimationFrame) return;
  
  const verson = ['webkit', 'moz'];
  for (let i = 0; i < verson.length; i++) {
    window.requestAnimationFrame = window[`${verson[i]}RequestAnimationFrame`];
    if (requestAnimationFrame) {
      window.cancelAnimationFrame = window[`${verson[i]}CancelAnimationFrame`];
      return;
    }
  }
  
  let lastTime = 0;
  window.requestAnimationFrame = function(callback) {
    const currentTime = Date.now();
    const time = Math.max(0, 16 - (currentTime - lastTime));
    const timer = setTimeout(function() {
      lastTime = Date.now();
      callback();
    }, time);
    return timer;
  }
  window.cancelAnimationFrame = function(timer) {
    clearTimeout(timer);
    timer = null;
  }
})()

export const requestAnimationFrame = window.requestAnimationFrame;
export const cancelAnimationFrame = window.cancelAnimationFrame;

// 屏幕宽度
export const SW = window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

// 单例模式
export function getSignal(fn) {
  let result = false;
  return function () {
    return result || (result = fn.apply(this, arguments));
  }
}