module.export({default:()=>getDocumentRect});let getDocumentElement;module.link("./getDocumentElement.js",{default(v){getDocumentElement=v}},0);let getComputedStyle;module.link("./getComputedStyle.js",{default(v){getComputedStyle=v}},1);let getWindowScrollBarX;module.link("./getWindowScrollBarX.js",{default(v){getWindowScrollBarX=v}},2);let getWindowScroll;module.link("./getWindowScroll.js",{default(v){getWindowScroll=v}},3);let max;module.link("../utils/math.js",{max(v){max=v}},4);



 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;

  if (getComputedStyle(body || html).direction === 'rtl') {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}