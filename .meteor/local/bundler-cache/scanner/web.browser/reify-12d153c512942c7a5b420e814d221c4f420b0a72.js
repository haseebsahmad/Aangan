module.export({default:()=>getWindowScroll});let getWindow;module.link("./getWindow.js",{default(v){getWindow=v}},0);
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}