module.export({default:()=>getNodeScroll});let getWindowScroll;module.link("./getWindowScroll.js",{default(v){getWindowScroll=v}},0);let getWindow;module.link("./getWindow.js",{default(v){getWindow=v}},1);let isHTMLElement;module.link("./instanceOf.js",{isHTMLElement(v){isHTMLElement=v}},2);let getHTMLElementScroll;module.link("./getHTMLElementScroll.js",{default(v){getHTMLElementScroll=v}},3);



function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}