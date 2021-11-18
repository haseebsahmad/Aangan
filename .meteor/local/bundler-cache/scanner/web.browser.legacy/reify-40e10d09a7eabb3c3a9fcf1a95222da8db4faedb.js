"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var n=require("goober"),t=require("react"),r=e(t),o=require("react-popper"),i=e(require("use-delayed")),a=e(require("@varld/outside-click")),u=require("react-dom");function c(e,n){return n||(n=e.slice(0)),e.raw=n,e}var p,s,l,f,d,m,y,x,b=function(e){return"undefined"==typeof window?null:u.createPortal(e.children,document.body)},g=n.styled("div",r.forwardRef)(p||(p=c(["\n  z-index: 9999;\n  pointer-events: none;\n\n  &.open {\n    pointer-events: all;\n  }\n"]))),v=n.styled("div")(s||(s=c(["\n  padding: 7px;\n  border-radius: 9px;\n  border: solid #efefef 1px;\n  background: white;\n  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);\n  opacity: 1;\n"]))),h=n.keyframes(l||(l=c(["\n  from {\n    opacity: 0;\n    margin-top: 0px;\n  }\n\n  to {\n    opacity: 1;\n    margin-top: 6px;\n  }\n"]))),w=n.keyframes(f||(f=c(["\n  from {\n    opacity: 1;\n    margin-top: 6px;\n  }\n\n  to {\n    opacity: 0;\n    margin-top: 0px;\n  }\n"]))),E=r.forwardRef((function(e,n){var u=e.popover,c=e.children,p=t.useState(null),s=p[0],l=p[1],f=t.useState(null),d=f[0],m=f[1],y=o.usePopper(s,d),x=y.styles,E=y.attributes,k=t.useState(!1),q=k[0],R=k[1],S=i(q,500,[!0]),T=t.useCallback((function(){return R(!1)}),[R]),P=u({visible:S,open:q,close:T});return t.useEffect((function(){return a([s,d],(function(){return R(!1)}),(function(){return q}))}),[s,d,q]),t.useEffect((function(){n||(n=t.createRef()),n.current={setOpen:R}}),[n,R]),r.createElement(r.Fragment,null,r.createElement("div",{tabIndex:0,ref:l,onClick:function(){return R(!q)},style:{width:"fit-content",height:"fit-content"},"data-popover-anchor":!0},c),S&&r.createElement(b,null,r.createElement(g,Object.assign({className:q?"open":"",ref:m,style:x.popper},E.popper),r.createElement(v,{style:{animation:(q?h:w)+" 0.2s ease-in-out forwards"}},P))))})),k=n.styled("div",r.forwardRef)(d||(d=c(["\n  width: fit-content;\n  z-index: 9999;\n  pointer-events: none;\n\n  &.open {\n    pointer-events: all;\n  }\n"]))),q=n.styled("div")(m||(m=c(["\n  border: solid #efefef 1px;\n  border-radius: 5px;\n  padding: 6px 10px;\n  background: white;\n  color: black;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n  font-size: 0.8em;\n  font-weight: 500;\n"]))),R=n.keyframes(y||(y=c(["\n  from {\n    opacity: 0;\n    margin-top: 0px;\n  }\n\n  to {\n    opacity: 1;\n    margin-top: 5px;\n  }\n"]))),S=n.keyframes(x||(x=c(["\n  from {\n    opacity: 1;\n    margin-top: 5px;\n  }\n\n  to {\n    opacity: 0;\n    margin-top: 0px;\n  }\n"])));n.setup(t.createElement),exports.Popover=E,exports.RenderToBody=b,exports.Tooltip=function(e){var n=e.content,u=e.children,c=t.useState(null),p=c[0],s=c[1],l=t.useState(null),f=l[0],d=l[1],m=o.usePopper(p,f),y=m.styles,x=m.attributes,b=t.useState(!1),g=b[0],v=b[1],h=i(g,500,[!0]),w=t.useRef();return t.useEffect((function(){return a([p,f],(function(){return v(!1)}),(function(){return g}))}),[p,f,g]),r.createElement(r.Fragment,null,r.createElement("div",{tabIndex:0,ref:s,onClick:function(){g&&clearTimeout(w.current),v(!0)},onMouseEnter:function(){clearTimeout(w.current),w.current=setTimeout((function(){v(!0)}),300)},onMouseLeave:function(){clearTimeout(w.current),v(!1)},style:{width:"fit-content",height:"fit-content"}},u),h&&r.createElement(k,Object.assign({className:g?"open":"",ref:d,style:y.popper},x.popper),r.createElement(q,{style:{animation:(g?R:S)+" 0.2s ease-in-out forwards"}},n)))};
//# sourceMappingURL=popover.cjs.production.min.js.map
