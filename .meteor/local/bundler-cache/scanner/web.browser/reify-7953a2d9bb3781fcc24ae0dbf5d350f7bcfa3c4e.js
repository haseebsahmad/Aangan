module.export({Reference:()=>Reference});let React;module.link('react',{"*"(v){React=v}},0);let warning;module.link('warning',{default(v){warning=v}},1);let ManagerReferenceNodeSetterContext;module.link('./Manager',{ManagerReferenceNodeSetterContext(v){ManagerReferenceNodeSetterContext=v}},2);let safeInvoke,unwrapArray,setRef;module.link('./utils',{safeInvoke(v){safeInvoke=v},unwrapArray(v){unwrapArray=v},setRef(v){setRef=v}},3);



function Reference(_ref) {
  var children = _ref.children,
      innerRef = _ref.innerRef;
  var setReferenceNode = React.useContext(ManagerReferenceNodeSetterContext);
  var refHandler = React.useCallback(function (node) {
    setRef(innerRef, node);
    safeInvoke(setReferenceNode, node);
  }, [innerRef, setReferenceNode]); // ran on unmount

  React.useEffect(function () {
    return function () {
      return setRef(innerRef, null);
    };
  });
  React.useEffect(function () {
    warning(Boolean(setReferenceNode), '`Reference` should not be used outside of a `Manager` component.');
  }, [setReferenceNode]);
  return unwrapArray(children)({
    ref: refHandler
  });
}