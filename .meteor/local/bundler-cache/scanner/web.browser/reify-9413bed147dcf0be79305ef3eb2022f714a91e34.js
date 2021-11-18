module.export({default:()=>getBasePlacement});let auto;module.link("../enums.js",{auto(v){auto=v}},0);
function getBasePlacement(placement) {
  return placement.split('-')[0];
}