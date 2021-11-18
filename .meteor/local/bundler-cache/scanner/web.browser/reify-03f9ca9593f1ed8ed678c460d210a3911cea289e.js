module.export({top:()=>top,bottom:()=>bottom,right:()=>right,left:()=>left,auto:()=>auto,basePlacements:()=>basePlacements,start:()=>start,end:()=>end,clippingParents:()=>clippingParents,viewport:()=>viewport,popper:()=>popper,reference:()=>reference,variationPlacements:()=>variationPlacements,placements:()=>placements,beforeRead:()=>beforeRead,read:()=>read,afterRead:()=>afterRead,beforeMain:()=>beforeMain,main:()=>main,afterMain:()=>afterMain,beforeWrite:()=>beforeWrite,write:()=>write,afterWrite:()=>afterWrite,modifierPhases:()=>modifierPhases});var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];