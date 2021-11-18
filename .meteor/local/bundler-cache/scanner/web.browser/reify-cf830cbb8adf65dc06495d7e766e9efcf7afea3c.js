module.export({default:()=>getScrollParent});let getParentNode;module.link("./getParentNode.js",{default(v){getParentNode=v}},0);let isScrollParent;module.link("./isScrollParent.js",{default(v){isScrollParent=v}},1);let getNodeName;module.link("./getNodeName.js",{default(v){getNodeName=v}},2);let isHTMLElement;module.link("./instanceOf.js",{isHTMLElement(v){isHTMLElement=v}},3);



function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}