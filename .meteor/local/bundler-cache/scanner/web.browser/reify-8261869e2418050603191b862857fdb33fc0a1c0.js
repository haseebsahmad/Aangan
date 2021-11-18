module.export({default:()=>getComputedStyle});let getWindow;module.link("./getWindow.js",{default(v){getWindow=v}},0);
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}