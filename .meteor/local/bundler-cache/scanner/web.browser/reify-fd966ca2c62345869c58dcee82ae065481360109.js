module.export({createPopper:()=>createPopper,popperGenerator:()=>popperGenerator,defaultModifiers:()=>defaultModifiers,detectOverflow:()=>detectOverflow});let popperGenerator,detectOverflow;module.link("./createPopper.js",{popperGenerator(v){popperGenerator=v},detectOverflow(v){detectOverflow=v}},0);let eventListeners;module.link("./modifiers/eventListeners.js",{default(v){eventListeners=v}},1);let popperOffsets;module.link("./modifiers/popperOffsets.js",{default(v){popperOffsets=v}},2);let computeStyles;module.link("./modifiers/computeStyles.js",{default(v){computeStyles=v}},3);let applyStyles;module.link("./modifiers/applyStyles.js",{default(v){applyStyles=v}},4);




var defaultModifiers = [eventListeners, popperOffsets, computeStyles, applyStyles];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

