'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var goober = require('goober');
var React = require('react');
var React__default = _interopDefault(React);
var reactPopper = require('react-popper');
var useDelayed = _interopDefault(require('use-delayed'));
var outsideClick = _interopDefault(require('@varld/outside-click'));
var reactDom = require('react-dom');

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

var RenderToBody = function RenderToBody(_ref) {
  var children = _ref.children;
  if (typeof window == 'undefined') return null;
  return reactDom.createPortal(children, document.body);
};

var _templateObject, _templateObject2, _templateObject3, _templateObject4;
var Wrapper = /*#__PURE__*/goober.styled('div', React__default.forwardRef)(_templateObject || (_templateObject = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  z-index: 9999;\n  pointer-events: none;\n\n  &.open {\n    pointer-events: all;\n  }\n"])));
var Inner = /*#__PURE__*/goober.styled('div')(_templateObject2 || (_templateObject2 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  padding: 7px;\n  border-radius: 9px;\n  border: solid #efefef 1px;\n  background: white;\n  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);\n  opacity: 1;\n"])));
var fadeIn = /*#__PURE__*/goober.keyframes(_templateObject3 || (_templateObject3 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  from {\n    opacity: 0;\n    margin-top: 0px;\n  }\n\n  to {\n    opacity: 1;\n    margin-top: 6px;\n  }\n"])));
var fadeOut = /*#__PURE__*/goober.keyframes(_templateObject4 || (_templateObject4 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  from {\n    opacity: 1;\n    margin-top: 6px;\n  }\n\n  to {\n    opacity: 0;\n    margin-top: 0px;\n  }\n"])));
var Popover = /*#__PURE__*/React__default.forwardRef(function (_ref, ref) {
  var popover = _ref.popover,
      children = _ref.children;

  var _useState = React.useState(null),
      referenceElement = _useState[0],
      setReferenceElement = _useState[1];

  var _useState2 = React.useState(null),
      popperElement = _useState2[0],
      setPopperElement = _useState2[1];

  var _usePopper = reactPopper.usePopper(referenceElement, popperElement),
      styles = _usePopper.styles,
      attributes = _usePopper.attributes;

  var _useState3 = React.useState(false),
      open = _useState3[0],
      setOpen = _useState3[1];

  var visible = useDelayed(open, 500, [true]);
  var close = React.useCallback(function () {
    return setOpen(false);
  }, [setOpen]);
  var popoverEl = popover({
    visible: visible,
    open: open,
    close: close
  });
  React.useEffect(function () {
    return outsideClick([referenceElement, popperElement], function () {
      return setOpen(false);
    }, function () {
      return open;
    });
  }, [referenceElement, popperElement, open]);
  React.useEffect(function () {
    if (!ref) ref = React.createRef();
    ref.current = {
      setOpen: setOpen
    };
  }, [ref, setOpen]);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    tabIndex: 0,
    ref: setReferenceElement,
    onClick: function onClick() {
      return setOpen(!open);
    },
    style: {
      width: 'fit-content',
      height: 'fit-content'
    },
    "data-popover-anchor": true
  }, children), visible && React__default.createElement(RenderToBody, null, React__default.createElement(Wrapper, Object.assign({
    className: open ? 'open' : '',
    ref: setPopperElement,
    style: styles.popper
  }, attributes.popper), React__default.createElement(Inner, {
    style: {
      animation: (open ? fadeIn : fadeOut) + " 0.2s ease-in-out forwards"
    }
  }, popoverEl))));
});

var _templateObject$1, _templateObject2$1, _templateObject3$1, _templateObject4$1;
var Wrapper$1 = /*#__PURE__*/goober.styled('div', React__default.forwardRef)(_templateObject$1 || (_templateObject$1 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  width: fit-content;\n  z-index: 9999;\n  pointer-events: none;\n\n  &.open {\n    pointer-events: all;\n  }\n"])));
var Inner$1 = /*#__PURE__*/goober.styled('div')(_templateObject2$1 || (_templateObject2$1 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  border: solid #efefef 1px;\n  border-radius: 5px;\n  padding: 6px 10px;\n  background: white;\n  color: black;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\n  font-size: 0.8em;\n  font-weight: 500;\n"])));
var fadeIn$1 = /*#__PURE__*/goober.keyframes(_templateObject3$1 || (_templateObject3$1 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  from {\n    opacity: 0;\n    margin-top: 0px;\n  }\n\n  to {\n    opacity: 1;\n    margin-top: 5px;\n  }\n"])));
var fadeOut$1 = /*#__PURE__*/goober.keyframes(_templateObject4$1 || (_templateObject4$1 = /*#__PURE__*/_taggedTemplateLiteralLoose(["\n  from {\n    opacity: 1;\n    margin-top: 5px;\n  }\n\n  to {\n    opacity: 0;\n    margin-top: 0px;\n  }\n"])));
var Tooltip = function Tooltip(_ref) {
  var content = _ref.content,
      children = _ref.children;

  var _useState = React.useState(null),
      referenceElement = _useState[0],
      setReferenceElement = _useState[1];

  var _useState2 = React.useState(null),
      popperElement = _useState2[0],
      setPopperElement = _useState2[1];

  var _usePopper = reactPopper.usePopper(referenceElement, popperElement),
      styles = _usePopper.styles,
      attributes = _usePopper.attributes;

  var _useState3 = React.useState(false),
      open = _useState3[0],
      setOpen = _useState3[1];

  var visible = useDelayed(open, 500, [true]);
  var enterToRef = React.useRef();
  React.useEffect(function () {
    return outsideClick([referenceElement, popperElement], function () {
      return setOpen(false);
    }, function () {
      return open;
    });
  }, [referenceElement, popperElement, open]);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    tabIndex: 0,
    ref: setReferenceElement,
    onClick: function onClick() {
      if (open) clearTimeout(enterToRef.current);
      setOpen(true);
    },
    onMouseEnter: function onMouseEnter() {
      clearTimeout(enterToRef.current);
      enterToRef.current = setTimeout(function () {
        setOpen(true);
      }, 300);
    },
    onMouseLeave: function onMouseLeave() {
      clearTimeout(enterToRef.current);
      setOpen(false);
    },
    style: {
      width: 'fit-content',
      height: 'fit-content'
    }
  }, children), visible && React__default.createElement(Wrapper$1, Object.assign({
    className: open ? 'open' : '',
    ref: setPopperElement,
    style: styles.popper
  }, attributes.popper), React__default.createElement(Inner$1, {
    style: {
      animation: (open ? fadeIn$1 : fadeOut$1) + " 0.2s ease-in-out forwards"
    }
  }, content)));
};

goober.setup(React.createElement);

exports.Popover = Popover;
exports.RenderToBody = RenderToBody;
exports.Tooltip = Tooltip;
//# sourceMappingURL=popover.cjs.development.js.map
