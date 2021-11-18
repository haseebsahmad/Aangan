module.export({default:()=>detectOverflow});let getBoundingClientRect;module.link("../dom-utils/getBoundingClientRect.js",{default(v){getBoundingClientRect=v}},0);let getClippingRect;module.link("../dom-utils/getClippingRect.js",{default(v){getClippingRect=v}},1);let getDocumentElement;module.link("../dom-utils/getDocumentElement.js",{default(v){getDocumentElement=v}},2);let computeOffsets;module.link("./computeOffsets.js",{default(v){computeOffsets=v}},3);let rectToClientRect;module.link("./rectToClientRect.js",{default(v){rectToClientRect=v}},4);let clippingParents,reference,popper,bottom,top,right,basePlacements,viewport;module.link("../enums.js",{clippingParents(v){clippingParents=v},reference(v){reference=v},popper(v){popper=v},bottom(v){bottom=v},top(v){top=v},right(v){right=v},basePlacements(v){basePlacements=v},viewport(v){viewport=v}},5);let isElement;module.link("../dom-utils/instanceOf.js",{isElement(v){isElement=v}},6);let mergePaddingObject;module.link("./mergePaddingObject.js",{default(v){mergePaddingObject=v}},7);let expandToHashMap;module.link("./expandToHashMap.js",{default(v){expandToHashMap=v}},8);







 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var referenceElement = state.elements.reference;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(referenceElement);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}