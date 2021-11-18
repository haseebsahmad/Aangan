module.export({default:()=>getNodeName});function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}