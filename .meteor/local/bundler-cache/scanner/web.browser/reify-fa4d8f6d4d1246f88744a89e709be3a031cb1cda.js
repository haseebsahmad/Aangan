module.export({default:()=>getClippingRect});let viewport;module.link("../enums.js",{viewport(v){viewport=v}},0);let getViewportRect;module.link("./getViewportRect.js",{default(v){getViewportRect=v}},1);let getDocumentRect;module.link("./getDocumentRect.js",{default(v){getDocumentRect=v}},2);let listScrollParents;module.link("./listScrollParents.js",{default(v){listScrollParents=v}},3);let getOffsetParent;module.link("./getOffsetParent.js",{default(v){getOffsetParent=v}},4);let getDocumentElement;module.link("./getDocumentElement.js",{default(v){getDocumentElement=v}},5);let getComputedStyle;module.link("./getComputedStyle.js",{default(v){getComputedStyle=v}},6);let isElement,isHTMLElement;module.link("./instanceOf.js",{isElement(v){isElement=v},isHTMLElement(v){isHTMLElement=v}},7);let getBoundingClientRect;module.link("./getBoundingClientRect.js",{default(v){getBoundingClientRect=v}},8);let getParentNode;module.link("./getParentNode.js",{default(v){getParentNode=v}},9);let contains;module.link("./contains.js",{default(v){contains=v}},10);let getNodeName;module.link("./getNodeName.js",{default(v){getNodeName=v}},11);let rectToClientRect;module.link("../utils/rectToClientRect.js",{default(v){rectToClientRect=v}},12);let max,min;module.link("../utils/math.js",{max(v){max=v},min(v){min=v}},13);














function getInnerBoundingClientRect(element) {
  var rect = getBoundingClientRect(element);
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(getParentNode(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}