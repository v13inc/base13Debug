// 
// boostrap.js
//

var base13 = window.base13 = {};

base13.libFilePath = window['base13_libFilePath'] || '.';
base13.lib = {};

base13.namespace = function(libPath) {
  var makeNamespace = function(curObj, components) {
    if(components.length == 0) return curObj;

    var nextObjName = components.splice(0, 1);
    if(curObj[nextObjName] == undefined) {
      curObj[nextObjName] = {};
    }

    return makeNamespace(curObj[nextObjName], components);
  }

  return makeNamespace(base13.lib, libPath.split('.'));
}

_.extend(window, {
  namespace: base13.namespace
});
