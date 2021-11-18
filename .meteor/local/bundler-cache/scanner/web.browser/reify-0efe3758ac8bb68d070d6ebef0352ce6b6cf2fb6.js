module.export({default:()=>listScrollParents});let getScrollParent;module.link("./getScrollParent.js",{default(v){getScrollParent=v}},0);let getParentNode;module.link("./getParentNode.js",{default(v){getParentNode=v}},1);let getWindow;module.link("./getWindow.js",{default(v){getWindow=v}},2);let isScrollParent;module.link("./isScrollParent.js",{default(v){isScrollParent=v}},3);



/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}