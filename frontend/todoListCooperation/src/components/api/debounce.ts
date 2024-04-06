export function debounce(
  fn: (...args: any[]) => void,
  delay: number,
  immediate: boolean = true,
) {
  let timer: number | null = null;
  return function (this: any, args: any[]) {
    console.log("点击事件");
    if (immediate) {
      fn.apply(this, args);
      immediate = false;
      console.log("完成事件");
    }
    if (timer != null) {
      clearInterval(timer);
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args);
      console.log("完成事件");
    }, delay);
  };
}
