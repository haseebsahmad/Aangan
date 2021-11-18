//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var FS = Package['cfs:base-package'].FS;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cfs:gridfs":{"gridfs.client.js":function module(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/cfs_gridfs/gridfs.client.js                                                             //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the client. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {undefined}
 *
 * Creates a GridFS store instance on the client, which is just a shell object
 * storing some info.
 */
FS.Store.GridFS = function (name, options) {
  var self = this;
  if (!(self instanceof FS.Store.GridFS)) throw new Error('FS.Store.GridFS missing keyword "new"');
  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.gridfs'
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/cfs:gridfs/gridfs.client.js");

/* Exports */
Package._define("cfs:gridfs");

})();
