module.export({default:()=>getParentNode});let getNodeName;module.link("./getNodeName.js",{default(v){getNodeName=v}},0);let getDocumentElement;module.link("./getDocumentElement.js",{default(v){getDocumentElement=v}},1);let isShadowRoot;module.link("./instanceOf.js",{isShadowRoot(v){isShadowRoot=v}},2);


function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}