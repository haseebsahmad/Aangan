module.export({default:()=>getCompositeRect});let getBoundingClientRect;module.link("./getBoundingClientRect.js",{default(v){getBoundingClientRect=v}},0);let getNodeScroll;module.link("./getNodeScroll.js",{default(v){getNodeScroll=v}},1);let getNodeName;module.link("./getNodeName.js",{default(v){getNodeName=v}},2);let isHTMLElement;module.link("./instanceOf.js",{isHTMLElement(v){isHTMLElement=v}},3);let getWindowScrollBarX;module.link("./getWindowScrollBarX.js",{default(v){getWindowScrollBarX=v}},4);let getDocumentElement;module.link("./getDocumentElement.js",{default(v){getDocumentElement=v}},5);let isScrollParent;module.link("./isScrollParent.js",{default(v){isScrollParent=v}},6);







function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = rect.width / element.offsetWidth || 1;
  var scaleY = rect.height / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}