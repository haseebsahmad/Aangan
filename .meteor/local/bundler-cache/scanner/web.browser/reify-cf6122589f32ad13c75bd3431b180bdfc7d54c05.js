module.export({default:()=>isTableElement});let getNodeName;module.link("./getNodeName.js",{default(v){getNodeName=v}},0);
function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}