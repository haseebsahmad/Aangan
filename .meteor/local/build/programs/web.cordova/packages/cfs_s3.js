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

(function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/cfs_s3/packages/cfs_s3.js                                              //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
(function () {

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/cfs:s3/s3.client.js                                              //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
/**                                                                          // 1
 * @public                                                                   // 2
 * @constructor                                                              // 3
 * @param {String} name - The store name                                     // 4
 * @param {Object} options                                                   // 5
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the client. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file // 7
 * @returns {undefined}                                                      // 8
 *                                                                           // 9
 * Creates an S3 store instance on the client, which is just a shell object  // 10
 * storing some info.                                                        // 11
 */                                                                          // 12
FS.Store.S3 = function(name, options) {                                      // 13
  var self = this;                                                           // 14
  if (!(self instanceof FS.Store.S3))                                        // 15
    throw new Error('FS.Store.S3 missing keyword "new"');                    // 16
                                                                             // 17
  return new FS.StorageAdapter(name, options, {                              // 18
    typeName: 'storage.s3'                                                   // 19
  });                                                                        // 20
};                                                                           // 21
                                                                             // 22
FS.Store.S3.prototype.fileKey = function(fileObj) {                          // 23
  return fileObj.collectionName + '/' + fileObj._id + '-' + fileObj.name();  // 24
};                                                                           // 25
                                                                             // 26
///////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("cfs:s3");

})();
