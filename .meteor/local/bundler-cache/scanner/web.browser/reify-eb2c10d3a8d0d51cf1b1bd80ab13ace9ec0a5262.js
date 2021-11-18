module.export({default:()=>getWindowScrollBarX});let getBoundingClientRect;module.link("./getBoundingClientRect.js",{default(v){getBoundingClientRect=v}},0);let getDocumentElement;module.link("./getDocumentElement.js",{default(v){getDocumentElement=v}},1);let getWindowScroll;module.link("./getWindowScroll.js",{default(v){getWindowScroll=v}},2);


function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}