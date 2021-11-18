module.export({createPopper:()=>createPopper,popperGenerator:()=>popperGenerator,defaultModifiers:()=>defaultModifiers,detectOverflow:()=>detectOverflow});let popperGenerator,detectOverflow;module.link("./createPopper.js",{popperGenerator(v){popperGenerator=v},detectOverflow(v){detectOverflow=v}},0);let eventListeners;module.link("./modifiers/eventListeners.js",{default(v){eventListeners=v}},1);let popperOffsets;module.link("./modifiers/popperOffsets.js",{default(v){popperOffsets=v}},2);let computeStyles;module.link("./modifiers/computeStyles.js",{default(v){computeStyles=v}},3);let applyStyles;module.link("./modifiers/applyStyles.js",{default(v){applyStyles=v}},4);let offset;module.link("./modifiers/offset.js",{default(v){offset=v}},5);let flip;module.link("./modifiers/flip.js",{default(v){flip=v}},6);let preventOverflow;module.link("./modifiers/preventOverflow.js",{default(v){preventOverflow=v}},7);let arrow;module.link("./modifiers/arrow.js",{default(v){arrow=v}},8);let hide;module.link("./modifiers/hide.js",{default(v){hide=v}},9);module.link("./popper-lite.js",{createPopper:"createPopperLite"},10);module.link("./modifiers/index.js",{"*":"*"},11);









var defaultModifiers = [eventListeners, popperOffsets, computeStyles, applyStyles, offset, flip, preventOverflow, arrow, hide];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

