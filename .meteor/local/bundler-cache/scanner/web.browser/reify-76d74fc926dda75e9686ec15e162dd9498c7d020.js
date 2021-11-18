module.export({default:()=>getDocumentElement});let isElement;module.link("./instanceOf.js",{isElement(v){isElement=v}},0);
function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}