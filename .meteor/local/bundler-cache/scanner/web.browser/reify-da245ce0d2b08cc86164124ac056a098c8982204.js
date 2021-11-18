module.export({default:()=>within});let mathMax,mathMin;module.link("./math.js",{max(v){mathMax=v},min(v){mathMin=v}},0);
function within(min, value, max) {
  return mathMax(min, mathMin(value, max));
}