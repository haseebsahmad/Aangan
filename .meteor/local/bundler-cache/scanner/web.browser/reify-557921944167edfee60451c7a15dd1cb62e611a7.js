module.export({default:()=>mergePaddingObject});let getFreshSideObject;module.link("./getFreshSideObject.js",{default(v){getFreshSideObject=v}},0);
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}