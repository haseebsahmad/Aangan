(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var SHA256 = Package.sha.SHA256;
var Random = Package.random.Random;

/* Package-scope variables */
var __coffeescriptShare, FilesCollection;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/ostrio_files/files.coffee.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var NOOP, Throttle, _insts, bound, cp, events, fileType, formatFleURL, fs, nodePath, rcp, request;                 

NOOP = function() {};

if (Meteor.isServer) {

  /*
  @summary Require NPM packages
   */
  fs = Npm.require('fs-extra');
  events = Npm.require('events');
  request = Npm.require('request');
  Throttle = Npm.require('throttle');
  fileType = Npm.require('file-type');
  nodePath = Npm.require('path');

  /*
  @var {object} bound - Meteor.bindEnvironment (Fiber wrapper)
   */
  bound = Meteor.bindEnvironment(function(callback) {
    return callback();
  });
}


/*
@private
@name _insts
@summary Object of FilesCollection instances
 */

_insts = {};


/*
@private
@name rcp
@param {Object} obj - Initial object
@summary Create object with only needed props
 */

rcp = function(obj) {
  var o;
  o = {
    currentFile: obj.currentFile,
    search: obj.search,
    collectionName: obj.collectionName,
    downloadRoute: obj.downloadRoute,
    chunkSize: obj.chunkSize,
    debug: obj.debug,
    _prefix: obj._prefix
  };
  return o;
};


/*
@private
@name cp
@param {Object} to   - Destination
@param {Object} from - Source
@summary Copy-Paste only needed props from one to another object
 */

cp = function(to, from) {
  to.currentFile = from.currentFile;
  to.search = from.search;
  to.collectionName = from.collectionName;
  to.downloadRoute = from.downloadRoute;
  to.chunkSize = from.chunkSize;
  to.debug = from.debug;
  to._prefix = from._prefix;
  return to;
};


/*
@locus Anywhere
@class FilesCollection
@param config           {Object}   - [Both]   Configuration object with next properties:
@param config.debug     {Boolean}  - [Both]   Turn on/of debugging and extra logging
@param config.schema    {Object}   - [Both]   Collection Schema
@param config.public    {Boolean}  - [Both]   Store files in folder accessible for proxy servers, for limits, and more - read docs
@param config.strict    {Boolean}  - [Server] Strict mode for partial content, if is `true` server will return `416` response code, when `range` is not specified, otherwise server return `206`
@param config.protected {Function} - [Both]   If `true` - files will be served only to authorized users, if `function()` - you're able to check visitor's permissions in your own way function's context has:
  - `request` - On server only
  - `response` - On server only
  - `user()`
  - `userId`
@param config.chunkSize      {Number}  - [Both] Upload chunk size, default: 524288 bytes (0,5 Mb)
@param config.permissions    {Number}  - [Server] Permissions which will be set to uploaded files (octal), like: `511` or `0o755`. Default: 0644
@param config.storagePath    {String}  - [Server] Storage path on file system
@param config.cacheControl   {String}  - [Server] Default `Cache-Control` header
@param config.throttle       {Number}  - [Server] bps throttle threshold
@param config.downloadRoute  {String}  - [Both]   Server Route used to retrieve files
@param config.collectionName {String}  - [Both]   Collection name
@param config.namingFunction {Function}- [Both]   Function which returns `String`
@param config.integrityCheck {Boolean} - [Server] Check file's integrity before serving to users
@param config.onAfterUpload  {Function}- [Server] Called right after file is ready on FS. Use to transfer file somewhere else, or do other thing with file directly
@param config.onBeforeUpload {Function}- [Both]   Function which executes on server after receiving each chunk and on client right before beginning upload. Function context is `File` - so you are able to check for extension, mime-type, size and etc.
return `true` to continue
return `false` or `String` to abort upload
@param config.onBeforeRemove {Function} - [Server] Executes before removing file on server, so you can check permissions. Return `true` to allow action and `false` to deny.
@param config.allowClientCode  {Boolean}  - [Both]   Allow to run `remove` from client
@param config.downloadCallback {Function} - [Server] Callback triggered each time file is requested, return truthy value to continue download, or falsy to abort
@param config.interceptDownload {Function} - [Server] Intercept download request, so you can serve file from third-party resource, arguments {http: {request: {...}, response: {...}}, fileRef: {...}}
@param config.onbeforeunloadMessage {String|Function} - [Client] Message shown to user when closing browser's window or tab while upload process is running
@summary Create new instance of FilesCollection
 */

FilesCollection = (function() {
  var FileUpload, UploadInstance;

  FilesCollection.prototype.__proto__ = (function() {
    if (Meteor.isServer) {
      return events.EventEmitter.prototype;
    } else {
      return EventEmitter.prototype;
    }
  })();

  function FilesCollection(config) {
    var _methods, cookie, self;
    if (Meteor.isServer) {
      events.EventEmitter.call(this);
    } else {
      EventEmitter.call(this);
    }
    if (config) {
      this.storagePath = config.storagePath, this.collectionName = config.collectionName, this.downloadRoute = config.downloadRoute, this.schema = config.schema, this.chunkSize = config.chunkSize, this.namingFunction = config.namingFunction, this.debug = config.debug, this.onbeforeunloadMessage = config.onbeforeunloadMessage, this.permissions = config.permissions, this.allowClientCode = config.allowClientCode, this.onBeforeUpload = config.onBeforeUpload, this.integrityCheck = config.integrityCheck, this["protected"] = config["protected"], this["public"] = config["public"], this.strict = config.strict, this.downloadCallback = config.downloadCallback, this.cacheControl = config.cacheControl, this.throttle = config.throttle, this.onAfterUpload = config.onAfterUpload, this.interceptDownload = config.interceptDownload, this.onBeforeRemove = config.onBeforeRemove;
    }
    self = this;
    cookie = new Cookies();
    if (this.debug == null) {
      this.debug = false;
    }
    if (this["public"] == null) {
      this["public"] = false;
    }
    if (this["protected"] == null) {
      this["protected"] = false;
    }
    if (this.chunkSize == null) {
      this.chunkSize = 1024 * 512;
    }
    this.chunkSize = Math.floor(this.chunkSize / 8) * 8;
    if (this["public"] && !this.downloadRoute) {
      throw new Meteor.Error(500, "[FilesCollection." + this.collectionName + "]: \"downloadRoute\" must be explicitly provided on \"public\" collections! Note: \"downloadRoute\" must be equal on be inside of your web/proxy-server (relative) root.");
    }
    if (this.downloadRoute == null) {
      this.downloadRoute = '/cdn/storage';
    }
    this.downloadRoute = this.downloadRoute.replace(/\/$/, '');
    if (this.collectionName == null) {
      this.collectionName = 'MeteorUploadFiles';
    }
    if (this.namingFunction == null) {
      this.namingFunction = function() {
        return Random.id();
      };
    }
    if (this.onBeforeUpload == null) {
      this.onBeforeUpload = false;
    }
    if (this.allowClientCode == null) {
      this.allowClientCode = true;
    }
    if (this.interceptDownload == null) {
      this.interceptDownload = false;
    }
    if (Meteor.isClient) {
      if (this.onbeforeunloadMessage == null) {
        this.onbeforeunloadMessage = 'Upload in a progress... Do you want to abort?';
      }
      delete this.strict;
      delete this.throttle;
      delete this.storagePath;
      delete this.permissions;
      delete this.cacheControl;
      delete this.onAfterUpload;
      delete this.integrityCheck;
      delete this.downloadCallback;
      delete this.interceptDownload;
      delete this.onBeforeRemove;
      if (this["protected"]) {
        if (!cookie.has('meteor_login_token') && Meteor._localStorage.getItem('Meteor.loginToken')) {
          cookie.set('meteor_login_token', Meteor._localStorage.getItem('Meteor.loginToken'), null, '/');
        }
      }
      check(this.onbeforeunloadMessage, Match.OneOf(String, Function));
    } else {
      if (this._writableStreams == null) {
        this._writableStreams = {};
      }
      if (this.strict == null) {
        this.strict = true;
      }
      if (this.throttle == null) {
        this.throttle = false;
      }
      if (this.permissions == null) {
        this.permissions = parseInt('644', 8);
      }
      if (this.cacheControl == null) {
        this.cacheControl = 'public, max-age=31536000, s-maxage=31536000';
      }
      if (this.onBeforeRemove == null) {
        this.onBeforeRemove = false;
      }
      if (this.onAfterUpload == null) {
        this.onAfterUpload = false;
      }
      if (this.integrityCheck == null) {
        this.integrityCheck = true;
      }
      if (this.downloadCallback == null) {
        this.downloadCallback = false;
      }
      if (this["public"] && !this.storagePath) {
        throw new Meteor.Error(500, "[FilesCollection." + this.collectionName + "] \"storagePath\" must be set on \"public\" collections! Note: \"storagePath\" must be equal on be inside of your web/proxy-server (absolute) root.");
      }
      if (this.storagePath == null) {
        this.storagePath = "assets/app/uploads/" + this.collectionName;
      }
      this.storagePath = this.storagePath.replace(/\/$/, '');
      this.storagePath = nodePath.normalize(this.storagePath);
      fs.mkdirsSync(this.storagePath);
      check(this.strict, Boolean);
      check(this.throttle, Match.OneOf(false, Number));
      check(this.permissions, Number);
      check(this.storagePath, String);
      check(this.cacheControl, String);
      check(this.onAfterUpload, Match.OneOf(false, Function));
      check(this.integrityCheck, Boolean);
      check(this.onBeforeRemove, Match.OneOf(false, Function));
      check(this.downloadCallback, Match.OneOf(false, Function));
      check(this.interceptDownload, Match.OneOf(false, Function));
    }
    if (!this.schema) {
      this.schema = {
        size: {
          type: Number
        },
        name: {
          type: String
        },
        type: {
          type: String
        },
        path: {
          type: String
        },
        isVideo: {
          type: Boolean
        },
        isAudio: {
          type: Boolean
        },
        isImage: {
          type: Boolean
        },
        isText: {
          type: Boolean
        },
        isJSON: {
          type: Boolean
        },
        _prefix: {
          type: String
        },
        extension: {
          type: String,
          optional: true
        },
        _storagePath: {
          type: String
        },
        _downloadRoute: {
          type: String
        },
        _collectionName: {
          type: String
        },
        "public": {
          type: Boolean,
          optional: true
        },
        meta: {
          type: Object,
          blackbox: true,
          optional: true
        },
        userId: {
          type: String,
          optional: true
        },
        updatedAt: {
          type: Date,
          autoValue: function() {
            return new Date();
          }
        },
        versions: {
          type: Object,
          blackbox: true
        }
      };
    }
    check(this.debug, Boolean);
    check(this.schema, Object);
    check(this["public"], Boolean);
    check(this["protected"], Match.OneOf(Boolean, Function));
    check(this.chunkSize, Number);
    check(this.downloadRoute, String);
    check(this.collectionName, String);
    check(this.namingFunction, Function);
    check(this.onBeforeUpload, Match.OneOf(false, Function));
    check(this.allowClientCode, Boolean);
    if (this["public"] && this["protected"]) {
      throw new Meteor.Error(500, "[FilesCollection." + this.collectionName + "]: Files can not be public and protected at the same time!");
    }
    this.cursor = null;
    this.search = {};
    this.collection = new Mongo.Collection(this.collectionName);
    this.currentFile = null;
    this._prefix = SHA256(this.collectionName + this.downloadRoute);
    _insts[this._prefix] = this;
    this.checkAccess = function(http) {
      var rc, result, text, user, userFuncs, userId;
      if (self["protected"]) {
        user = false;
        userFuncs = self.getUser(http);
        user = userFuncs.user, userId = userFuncs.userId;
        user = user();
        if (_.isFunction(self["protected"])) {
          result = http ? self["protected"].call(_.extend(http, userFuncs), self.currentFile || null) : self["protected"].call(userFuncs, self.currentFile || null);
        } else {
          result = !!user;
        }
        if ((http && result === true) || !http) {
          return true;
        } else {
          rc = _.isNumber(result) ? result : 401;
          if (self.debug) {
            console.warn('[FilesCollection.checkAccess] WARN: Access denied!');
          }
          if (http) {
            text = 'Access denied!';
            http.response.writeHead(rc, {
              'Content-Length': text.length,
              'Content-Type': 'text/plain'
            });
            http.response.end(text);
          }
          return false;
        }
      } else {
        return true;
      }
    };
    this.methodNames = {
      MeteorFileAbort: "MeteorFileAbort" + this._prefix,
      MeteorFileWrite: "MeteorFileWrite" + this._prefix,
      MeteorFileUnlink: "MeteorFileUnlink" + this._prefix
    };
    if (Meteor.isServer) {
      this.on('handleUpload', this.handleUpload);
      this.on('finishUpload', this.finishUpload);
      WebApp.connectHandlers.use(function(request, response, next) {
        var _file, http, params, uri, uris, version;
        if (!self["public"]) {
          if (!!~request._parsedUrl.path.indexOf(self.downloadRoute + "/" + self.collectionName)) {
            uri = request._parsedUrl.path.replace(self.downloadRoute + "/" + self.collectionName, '');
            if (uri.indexOf('/') === 0) {
              uri = uri.substring(1);
            }
            uris = uri.split('/');
            if (uris.length === 3) {
              params = {
                query: request._parsedUrl.query ? JSON.parse('{"' + decodeURI(request._parsedUrl.query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : {},
                _id: uris[0],
                version: uris[1],
                name: uris[2]
              };
              http = {
                request: request,
                response: response,
                params: params
              };
              if (self.checkAccess(http)) {
                self.findOne(uris[0]).download.call(self, http, uris[1]);
              }
            } else {
              next();
            }
          } else {
            next();
          }
        } else {
          if (!!~request._parsedUrl.path.indexOf("" + self.downloadRoute)) {
            uri = request._parsedUrl.path.replace("" + self.downloadRoute, '');
            if (uri.indexOf('/') === 0) {
              uri = uri.substring(1);
            }
            uris = uri.split('/');
            _file = uris[uris.length - 1];
            if (_file) {
              if (!!~_file.indexOf('-')) {
                version = _file.split('-')[0];
                _file = _file.split('-')[1].split('?')[0];
              } else {
                version = 'original';
                _file = _file.split('?')[0];
              }
              params = {
                query: request._parsedUrl.query ? JSON.parse('{"' + decodeURI(request._parsedUrl.query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') : {},
                file: _file,
                _id: _file.split('.')[0],
                version: version,
                name: _file
              };
              http = {
                request: request,
                response: response,
                params: params
              };
              self.findOne(params._id).download.call(self, http, version);
            } else {
              next();
            }
          } else {
            next();
          }
        }
      });
      _methods = {};
      _methods[self.methodNames.MeteorFileUnlink] = function(inst) {
        var __inst, __instData, user, userFuncs;
        check(inst, Object);
        if (self.debug) {
          console.info('[FilesCollection] [Unlink Method]');
        }
        if (self.allowClientCode) {
          __instData = cp(_insts[inst._prefix], inst);
          if (self.onBeforeRemove && _.isFunction(self.onBeforeRemove)) {
            user = false;
            userFuncs = {
              userId: this.userId,
              user: function() {
                if (Meteor.users) {
                  return Meteor.users.findOne(this.userId);
                } else {
                  return void 0;
                }
              }
            };
            __inst = self.find.call(__instData, inst.search);
            if (!self.onBeforeRemove.call(userFuncs, __inst.cursor || null)) {
              throw new Meteor.Error(403, '[FilesCollection] [remove] Not permitted!');
            }
          }
          self.remove.call(__instData, inst.search);
          return true;
        } else {
          throw new Meteor.Error(401, '[FilesCollection] [remove] Run code from client is not allowed!');
        }
      };
      _methods[self.methodNames.MeteorFileWrite] = function(opts) {
        var e, extension, extensionWithDot, fileName, isUploadAllowed, ref, result;
        this.unblock();
        check(opts, {
          eof: Match.Optional(Boolean),
          meta: Match.Optional(Object),
          file: Object,
          fileId: String,
          binData: Match.Optional(String),
          chunkId: Match.Optional(Number),
          chunkSize: Number,
          fileLength: Number
        });
        if (opts.eof == null) {
          opts.eof = false;
        }
        if (opts.meta == null) {
          opts.meta = {};
        }
        if (opts.binData == null) {
          opts.binData = 'EOF';
        }
        if (opts.chunkId == null) {
          opts.chunkId = -1;
        }
        if (self.debug) {
          console.info("[FilesCollection] [Write Method] Got #" + opts.chunkId + "/" + opts.fileLength + " chunks, dst: " + (opts.file.name || opts.file.fileName));
        }
        if (self.onBeforeUpload && _.isFunction(self.onBeforeUpload)) {
          isUploadAllowed = self.onBeforeUpload.call(_.extend({
            file: opts.file
          }, {
            userId: this.userId,
            user: function() {
              if (Meteor.users) {
                return Meteor.users.findOne(this.userId);
              } else {
                return void 0;
              }
            }
          }), opts.file);
          if (isUploadAllowed !== true) {
            throw new Meteor.Error(403, _.isString(isUploadAllowed) ? isUploadAllowed : '@onBeforeUpload() returned false');
          }
        }
        fileName = self.getFileName(opts.file);
        ref = self.getExt(fileName), extension = ref.extension, extensionWithDot = ref.extensionWithDot;
        result = opts.file;
        result.path = self.storagePath + "/" + opts.fileId + extensionWithDot;
        result.name = fileName;
        result.meta = opts.meta;
        result.extension = extension;
        result = self.dataToSchema(result);
        result._id = opts.fileId;
        if (this.userId) {
          result.userId = this.userId;
        }
        if (opts.eof) {
          try {
            return Meteor.wrapAsync(self.handleUpload.bind(self, result, opts))();
          } catch (_error) {
            e = _error;
            if (self.debug) {
              console.warn("[FilesCollection] [Write Method] Exception:", e);
            }
            throw e;
          }
        } else {
          self.emit('handleUpload', result, opts, NOOP);
        }
        return result;
      };
      _methods[self.methodNames.MeteorFileAbort] = function(opts) {
        var ext, path, ref;
        check(opts, {
          fileId: String,
          fileData: Object,
          fileLength: Number
        });
        ext = "." + opts.fileData.ext;
        path = self.storagePath + "/" + opts.fileId + ext;
        if (self.debug) {
          console.info("[FilesCollection] [Abort Method]: For " + path);
        }
        if ((ref = self._writableStreams) != null ? ref[opts.fileId] : void 0) {
          self._writableStreams[opts.fileId].stream.end();
          delete self._writableStreams[opts.fileId];
          self.remove({
            _id: opts.fileId
          });
          self.unlink({
            _id: opts.fileId,
            path: path
          });
        }
        return true;
      };
      Meteor.methods(_methods);
    }
  }


  /*
  @locus Server
  @memberOf FilesCollection
  @name finishUpload
  @summary Internal method. Finish upload, close Writable stream, add recored to MongoDB and flush used memory
  @returns {undefined}
   */

  FilesCollection.prototype.finishUpload = Meteor.isServer ? function(result, opts, cb) {
    var self;
    fs.chmod(result.path, this.permissions, NOOP);
    self = this;
    result.type = this.getMimeType(opts.file);
    result["public"] = this["public"];
    this.collection.insert(_.clone(result), function(error, _id) {
      if (error) {
        return cb(new Meteor.Error(500, error));
      } else {
        result._id = _id;
        if (self.debug) {
          console.info("[FilesCollection] [Write Method] [finishUpload] -> " + result.path);
        }
        self.onAfterUpload && self.onAfterUpload.call(self, result);
        self.emit('afterUpload', result);
        return cb(null, result);
      }
    });
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name handleUpload
  @summary Internal method to handle upload process, pipe incoming data to Writable stream
  @returns {undefined}
   */

  FilesCollection.prototype.handleUpload = Meteor.isServer ? function(result, opts, cb) {
    var _dKeys, _hlEnd, base, binary, e, name, ref, self, start;
    self = this;
    if (opts.eof) {
      binary = opts.binData;
    } else {
      binary = new Buffer(opts.binData, 'base64');
    }
    try {
      if (opts.eof) {
        _hlEnd = function() {
          self._writableStreams[result._id].stream.end();
          delete self._writableStreams[result._id];
          self.emit('finishUpload', result, opts, cb);
        };
        if ((ref = this._writableStreams[result._id].delayed) != null ? ref[opts.fileLength] : void 0) {
          this._writableStreams[result._id].stream.write(this._writableStreams[result._id].delayed[opts.fileLength], function() {
            return bound(function() {
              delete self._writableStreams[result._id].delayed[opts.fileLength];
              _hlEnd();
            });
          });
        } else {
          _hlEnd();
        }
      } else if (opts.chunkId > 0) {
        if ((base = this._writableStreams)[name = result._id] == null) {
          base[name] = {
            stream: fs.createWriteStream(result.path, {
              flags: 'a',
              mode: this.permissions
            }),
            delayed: {}
          };
        }
        _dKeys = Object.keys(this._writableStreams[result._id].delayed);
        if (_dKeys.length) {
          _.each(this._writableStreams[result._id].delayed, function(delayed, num) {
            return bound(function() {
              if (num < opts.chunkId) {
                self._writableStreams[result._id].stream.write(delayed);
                delete self._writableStreams[result._id].delayed[num];
              }
            });
          });
        }
        start = opts.chunkSize * (opts.chunkId - 1);
        if (this._writableStreams[result._id].stream.bytesWritten < start) {
          this._writableStreams[result._id].delayed[opts.chunkId] = binary;
        } else {
          this._writableStreams[result._id].stream.write(binary);
        }
      }
    } catch (_error) {
      e = _error;
      cb(e);
    }
  } : void 0;


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name getMimeType
  @param {Object} fileData - File Object
  @summary Returns file's mime-type
  @returns {String}
   */

  FilesCollection.prototype.getMimeType = function(fileData) {
    var br, buf, error, ext, fd, mime, ref;
    check(fileData, Object);
    if (fileData != null ? fileData.type : void 0) {
      mime = fileData.type;
    }
    if (Meteor.isServer && fileData.path && (!mime || !_.isString(mime))) {
      try {
        buf = new Buffer(262);
        fd = fs.openSync(fileData.path, 'r');
        br = fs.readSync(fd, buf, 0, 262, 0);
        fs.close(fd, NOOP);
        if (br < 262) {
          buf = buf.slice(0, br);
        }
        ref = fileType(buf), mime = ref.mime, ext = ref.ext;
      } catch (_error) {
        error = _error;
      }
    }
    if (!mime || !_.isString(mime)) {
      mime = 'application/octet-stream';
    }
    return mime;
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name getFileName
  @param {Object} fileData - File Object
  @summary Returns file's name
  @returns {String}
   */

  FilesCollection.prototype.getFileName = function(fileData) {
    var cleanName, fileName;
    fileName = fileData.name || fileData.fileName;
    if (_.isString(fileName) && fileName.length > 0) {
      cleanName = function(str) {
        return str.replace(/\.\./g, '').replace(/\//g, '');
      };
      return cleanName(fileData.name || fileData.fileName);
    } else {
      return '';
    }
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name getUser
  @summary Returns object with `userId` and `user()` method which return user's object
  @returns {Object}
   */

  FilesCollection.prototype.getUser = function(http) {
    var cookie, result, user;
    result = {
      user: function() {
        return null;
      },
      userId: null
    };
    if (Meteor.isServer) {
      if (http) {
        cookie = http.request.Cookies;
        if (_.has(Package, 'accounts-base') && cookie.has('meteor_login_token')) {
          user = Meteor.users.findOne({
            'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(cookie.get('meteor_login_token'))
          });
          if (user) {
            result.user = function() {
              return user;
            };
            result.userId = user._id;
          }
        }
      }
    } else {
      if (_.has(Package, 'accounts-base') && Meteor.userId()) {
        result.user = function() {
          return Meteor.user();
        };
        result.userId = Meteor.userId();
      }
    }
    return result;
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name getExt
  @param {String} FileName - File name
  @summary Get extension from FileName
  @returns {Object}
   */

  FilesCollection.prototype.getExt = function(fileName) {
    var extension;
    if (!!~fileName.indexOf('.')) {
      extension = fileName.split('.').pop();
      return {
        ext: extension,
        extension: extension,
        extensionWithDot: '.' + extension
      };
    } else {
      return {
        ext: '',
        extension: '',
        extensionWithDot: ''
      };
    }
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name dataToSchema
  @param {Object} data - File data
  @summary Build object in accordance with schema from File data
  @returns {Object}
   */

  FilesCollection.prototype.dataToSchema = function(data) {
    return {
      name: data.name,
      extension: data.extension,
      path: data.path,
      meta: data.meta,
      type: data.type,
      size: data.size,
      versions: {
        original: {
          path: data.path,
          size: data.size,
          type: data.type,
          extension: data.extension
        }
      },
      isVideo: !!~data.type.toLowerCase().indexOf('video'),
      isAudio: !!~data.type.toLowerCase().indexOf('audio'),
      isImage: !!~data.type.toLowerCase().indexOf('image'),
      isText: !!~data.type.toLowerCase().indexOf('text'),
      isJSON: !!~data.type.toLowerCase().indexOf('json'),
      _prefix: data._prefix || this._prefix,
      _storagePath: data._storagePath || this.storagePath,
      _downloadRoute: data._downloadRoute || this.downloadRoute,
      _collectionName: data._collectionName || this.collectionName
    };
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name srch
  @param {String|Object} search - Search data
  @summary Build search object
  @returns {Object}
   */

  FilesCollection.prototype.srch = function(search) {
    if (search && _.isString(search)) {
      this.search = {
        _id: search
      };
    } else {
      this.search = search || {};
    }
    return this.search;
  };


  /*
  @locus Server
  @memberOf FilesCollection
  @name write
  @param {Buffer} buffer - Binary File's Buffer
  @param {Object} opts - {fileName: '', type: '', size: 0, meta: {...}}
  @param {Function} callback - function(error, fileObj){...}
  @summary Write buffer to FS and add to FilesCollection Collection
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.write = Meteor.isServer ? function(buffer, opts, callback) {
    var extension, extensionWithDot, fileName, path, randFileName, ref, result;
    if (opts == null) {
      opts = {};
    }
    if (this.debug) {
      console.info("[FilesCollection] [write()]");
    }
    check(opts, Match.Optional(Object));
    check(callback, Match.Optional(Function));
    if (this.checkAccess()) {
      randFileName = this.namingFunction();
      fileName = opts.name || opts.fileName ? opts.name || opts.fileName : randFileName;
      ref = this.getExt(fileName), extension = ref.extension, extensionWithDot = ref.extensionWithDot;
      path = this.storagePath + "/" + randFileName + extensionWithDot;
      opts.type = this.getMimeType(opts);
      if (!opts.meta) {
        opts.meta = {};
      }
      if (!opts.size) {
        opts.size = buffer.length;
      }
      result = this.dataToSchema({
        name: fileName,
        path: path,
        meta: opts.meta,
        type: opts.type,
        size: opts.size,
        extension: extension
      });
      if (this.debug) {
        console.info("[FilesCollection] [write]: " + fileName + " -> " + this.collectionName);
      }
      fs.outputFile(path, buffer, 'binary', function(error) {
        return bound(function() {
          if (error) {
            return callback && callback(error);
          } else {
            result._id = this.collection.insert(_.clone(result));
            return callback && callback(null, result);
          }
        });
      });
      return this;
    }
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name load
  @param {String} url - URL to file
  @param {Object} opts - {fileName: '', meta: {...}}
  @param {Function} callback - function(error, fileObj){...}
  @summary Download file, write stream to FS and add to FilesCollection Collection
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.load = Meteor.isServer ? function(url, opts, callback) {
    var extension, extensionWithDot, fileName, path, randFileName, ref, self;
    if (opts == null) {
      opts = {};
    }
    if (this.debug) {
      console.info("[FilesCollection] [load(" + url + ", " + (JSON.stringify(opts)) + ", callback)]");
    }
    check(url, String);
    check(opts, Match.Optional(Object));
    check(callback, Match.Optional(Function));
    self = this;
    randFileName = this.namingFunction();
    fileName = opts.name || opts.fileName ? opts.name || opts.fileName : randFileName;
    ref = this.getExt(fileName), extension = ref.extension, extensionWithDot = ref.extensionWithDot;
    path = this.storagePath + "/" + randFileName + extensionWithDot;
    if (!opts.meta) {
      opts.meta = {};
    }
    request.get(url).on('error', function(error) {
      return bound(function() {
        throw new Meteor.Error(500, ("Error on [load(" + url + ")]:") + JSON.stringify(error));
      });
    }).on('response', function(response) {
      return bound(function() {
        var result;
        if (self.debug) {
          console.info("[FilesCollection] [load] Received: " + url);
        }
        result = self.dataToSchema({
          name: fileName,
          path: path,
          meta: opts.meta,
          type: opts.type || response.headers['content-type'],
          size: opts.size || response.headers['content-length'],
          extension: extension
        });
        return self.collection.insert(_.clone(result), function(error, fileRef) {
          if (error) {
            if (self.debug) {
              console.warn("[FilesCollection] [load] [insert] Error: " + fileName + " -> " + self.collectionName, error);
            }
            return callback && callback(error);
          } else {
            if (self.debug) {
              console.info("[FilesCollection] [load] [insert] " + fileName + " -> " + self.collectionName);
            }
            return callback && callback(null, fileRef);
          }
        });
      });
    }).pipe(fs.createWriteStream(path, {
      flags: 'w'
    }));
    return this;
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name addFile
  @param {String} path - Path to file
  @param {String} path - Path to file
  @summary Add file from FS to FilesCollection
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.addFile = Meteor.isServer ? function(path, opts, callback) {
    var self;
    if (opts == null) {
      opts = {};
    }
    if (this.debug) {
      console.info("[FilesCollection] [addFile(" + path + ")]");
    }
    if (this["public"]) {
      throw new Meteor.Error(403, 'Can not run [addFile] on public collection! Just Move file to root of your server, then add record to Collection');
    }
    check(path, String);
    check(opts, Match.Optional(Object));
    check(callback, Match.Optional(Function));
    self = this;
    fs.stat(path, function(error, stats) {
      return bound(function() {
        var _cn, extension, extensionWithDot, fileName, pathParts, ref, result;
        if (error) {
          return callback && callback(error);
        } else if (stats.isFile()) {
          pathParts = path.split('/');
          fileName = pathParts[pathParts.length - 1];
          ref = self.getExt(fileName), extension = ref.extension, extensionWithDot = ref.extensionWithDot;
          if (!opts.type) {
            opts.type = 'application/*';
          }
          if (!opts.meta) {
            opts.meta = {};
          }
          if (!opts.size) {
            opts.size = stats.size;
          }
          result = self.dataToSchema({
            name: fileName,
            path: path,
            meta: opts.meta,
            type: opts.type,
            size: opts.size,
            extension: extension,
            _storagePath: path.replace("/" + fileName, '')
          });
          _cn = self.collectionName;
          return self.collection.insert(_.clone(result), function(error, record) {
            if (error) {
              if (self.debug) {
                console.warn("[FilesCollection] [addFile] [insert] Error: " + fileName + " -> " + _cn, error);
              }
              return callback && callback(error);
            } else {
              if (self.debug) {
                console.info("[FilesCollection] [addFile] [insert]: " + fileName + " -> " + _cn);
              }
              return callback && callback(null, result);
            }
          });
        } else {
          return callback && callback(new Meteor.Error(400, "[FilesCollection] [addFile(" + path + ")]: File does not exist"));
        }
      });
    });
    return this;
  } : void 0;


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name findOne
  @param {String|Object} search - `_id` of the file or `Object` like, {prop:'val'}
  @summary Load file
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.findOne = function(search) {
    if (this.debug) {
      console.info("[FilesCollection] [findOne(" + (JSON.stringify(search)) + ")]");
    }
    check(search, Match.Optional(Match.OneOf(Object, String)));
    this.srch(search);
    if (this.checkAccess()) {
      this.currentFile = this.collection.findOne(this.search);
      this.cursor = null;
    }
    return this;
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name find
  @param {String|Object} search - `_id` of the file or `Object` like, {prop:'val'}
  @summary Load file or bunch of files
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.find = function(search) {
    if (this.debug) {
      console.info("[FilesCollection] [find(" + (JSON.stringify(search)) + ")]");
    }
    check(search, Match.Optional(Match.OneOf(Object, String)));
    this.srch(search);
    if (this.checkAccess()) {
      this.currentFile = null;
      this.cursor = this.collection.find(this.search);
    }
    return this;
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name get
  @summary Return value of current cursor or file
  @returns {Object|[Object]}
   */

  FilesCollection.prototype.get = function() {
    if (this.debug) {
      console.info('[FilesCollection] [get()]');
    }
    if (this.cursor) {
      return this.cursor.fetch();
    }
    return this.currentFile;
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name fetch
  @summary Alias for `get()` method
  @returns {[Object]}
   */

  FilesCollection.prototype.fetch = function() {
    var data;
    if (this.debug) {
      console.info('[FilesCollection] [fetch()]');
    }
    data = this.get();
    if (!_.isArray(data)) {
      return [data];
    } else {
      return data;
    }
  };


  /*
  @locus Client
  @memberOf FilesCollection
  @name insert
  @see https://developer.mozilla.org/en-US/docs/Web/API/FileReader
  @param {Object} config - Configuration object with next properties:
    {File|Object} file           - HTML5 `files` item, like in change event: `e.currentTarget.files[0]`
    {Object}      meta           - Additional data as object, use later for search
    {Boolean}     allowWebWorkers- Allow/Deny WebWorkers usage
    {Number|dynamic} streams     - Quantity of parallel upload streams, default: 2
    {Number|dynamic} chunkSize   - Chunk size for upload
    {Function}    onUploaded     - Callback triggered when upload is finished, with two arguments `error` and `fileRef`
    {Function}    onStart        - Callback triggered when upload is started after all successful validations, with two arguments `error` (always null) and `fileRef`
    {Function}    onError        - Callback triggered on error in upload and/or FileReader, with two arguments `error` and `fileData`
    {Function}    onProgress     - Callback triggered when chunk is sent, with only argument `progress`
    {Function}    onBeforeUpload - Callback triggered right before upload is started:
        return true to continue
        return false to abort upload
  @param {Boolean} autoStart     - Start upload immediately. If set to false, you need manually call .start() method on returned class. Useful to set EventListeners.
  @summary Upload file to server over DDP
  @returns {UploadInstance} Instance. UploadInstance has next properties:
    {ReactiveVar} onPause  - Is upload process on the pause?
    {ReactiveVar} state    - active|paused|aborted|completed
    {ReactiveVar} progress - Current progress in percentage
    {Function}    pause    - Pause upload process
    {Function}    continue - Continue paused upload process
    {Function}    toggle   - Toggle continue/pause if upload process
    {Function}    abort    - Abort upload
    {Function}    readAsDataURL - Current file as data URL, use to create image preview and etc. Be aware of big files, may lead to browser crash
   */

  FilesCollection.prototype.insert = Meteor.isClient ? function(config, autoStart) {
    var mName;
    if (autoStart == null) {
      autoStart = true;
    }
    if (this.checkAccess()) {
      mName = autoStart ? 'start' : 'manual';
      return (new this._UploadInstance(config, this))[mName]();
    } else {
      throw new Meteor.Error(401, "[FilesCollection] [insert] Access Denied");
    }
  } : void 0;


  /*
  @locus Client
  @memberOf FilesCollection
  @name _UploadInstance
  @class UploadInstance
  @summary Internal Class, used in upload
   */

  FilesCollection.prototype._UploadInstance = Meteor.isClient ? UploadInstance = (function() {
    UploadInstance.prototype.__proto__ = EventEmitter.prototype;

    function UploadInstance(config1, collection) {
      var base, base1, base2, base3, self;
      this.config = config1;
      this.collection = collection;
      EventEmitter.call(this);
      if (this.collection.debug) {
        console.info('[FilesCollection] [insert()]');
      }
      self = this;
      if ((base = this.config).meta == null) {
        base.meta = {};
      }
      if ((base1 = this.config).streams == null) {
        base1.streams = 2;
      }
      if (this.config.streams < 1) {
        this.config.streams = 2;
      }
      if ((base2 = this.config).chunkSize == null) {
        base2.chunkSize = this.collection.chunkSize;
      }
      if ((base3 = this.config).allowWebWorkers == null) {
        base3.allowWebWorkers = true;
      }
      check(this.config, {
        file: Match.Any,
        meta: Match.Optional(Object),
        onError: Match.Optional(Function),
        onAbort: Match.Optional(Function),
        streams: Match.OneOf('dynamic', Number),
        onStart: Match.Optional(Function),
        chunkSize: Match.OneOf('dynamic', Number),
        onUploaded: Match.Optional(Function),
        onProgress: Match.Optional(Function),
        onBeforeUpload: Match.Optional(Function),
        allowWebWorkers: Boolean
      });
      if (this.config.file) {
        if (this.collection.debug) {
          console.time('insert ' + this.config.file.name);
        }
        if (this.collection.debug) {
          console.time('loadFile ' + this.config.file.name);
        }
        if (Worker && this.config.allowWebWorkers) {
          this.worker = new Worker('/packages/ostrio_files/worker.js');
        } else {
          this.worker = null;
        }
        this.trackerComp = null;
        this.currentChunk = 0;
        this.sentChunks = 0;
        this.EOFsent = false;
        this.transferTime = 0;
        this.fileLength = 1;
        this.fileId = this.collection.namingFunction();
        this.pipes = [];
        this.fileData = {
          size: this.config.file.size,
          type: this.config.file.type,
          name: this.config.file.name
        };
        this.fileData = _.extend(this.fileData, this.collection.getExt(self.config.file.name), {
          mime: this.collection.getMimeType(this.fileData)
        });
        this.fileData['mime-type'] = this.fileData.mime;
        this.result = new this.collection._FileUpload(_.extend(self.config, {
          fileData: this.fileData,
          fileId: this.fileId,
          MeteorFileAbort: this.collection.methodNames.MeteorFileAbort
        }));
        this.beforeunload = function(e) {
          var message;
          message = _.isFunction(self.collection.onbeforeunloadMessage) ? self.collection.onbeforeunloadMessage.call(self.result, self.fileData) : self.collection.onbeforeunloadMessage;
          if (e) {
            e.returnValue = message;
          }
          return message;
        };
        this.result.config.beforeunload = this.beforeunload;
        window.addEventListener('beforeunload', this.beforeunload, false);
        this.result.config._onEnd = function() {
          return self.emitEvent('_onEnd');
        };
        this.addListener('end', this.end);
        this.addListener('start', this.start);
        this.addListener('upload', this.upload);
        this.addListener('sendEOF', this.sendEOF);
        this.addListener('prepare', this.prepare);
        this.addListener('sendViaDDP', this.sendViaDDP);
        this.addListener('proceedChunk', this.proceedChunk);
        this.addListener('createStreams', this.createStreams);
        this.addListener('calculateStats', _.throttle(function() {
          var _t, progress;
          _t = (self.transferTime / self.sentChunks) / self.config.streams;
          self.result.estimateTime.set(_t * (self.fileLength - self.sentChunks));
          self.result.estimateSpeed.set(self.config.chunkSize / (_t / 1000));
          progress = Math.round((self.sentChunks / self.fileLength) * 100);
          self.result.progress.set(progress);
          self.config.onProgress && self.config.onProgress.call(self.result, progress, self.fileData);
          self.result.emitEvent('progress', [progress, self.fileData]);
        }, 250));
        this.addListener('_onEnd', function() {
          if (self.worker) {
            self.worker.terminate();
          }
          if (self.trackerComp) {
            self.trackerComp.stop();
          }
          if (self.beforeunload) {
            window.removeEventListener('beforeunload', self.beforeunload, false);
          }
          if (self.result) {
            return self.result.progress.set(0);
          }
        });
      } else {
        throw new Meteor.Error(500, "[FilesCollection] [insert] Have you forget to pass a File itself?");
      }
    }

    UploadInstance.prototype.end = function(error, data) {
      if (this.collection.debug) {
        console.timeEnd('insert ' + this.config.file.name);
      }
      this.emitEvent('_onEnd');
      this.result.emitEvent('uploaded', [error, data]);
      this.config.onUploaded && this.config.onUploaded.call(this.result, error, data);
      if (error) {
        if (this.collection.debug) {
          console.warn("[FilesCollection] [insert] [end] Error: ", error);
        }
        this.result.abort();
        this.result.state.set('aborted');
        this.result.emitEvent('error', [error, this.fileData]);
        this.config.onError && this.config.onError.call(this.result, error, this.fileData);
      } else {
        this.result.state.set('completed');
        this.collection.emitEvent('afterUpload', [data]);
      }
      this.result.emitEvent('end', [error, data || this.fileData]);
      return this.result;
    };

    UploadInstance.prototype.sendViaDDP = function(evt) {
      var j, len, opts, pipeFunc, ref, self;
      self = this;
      opts = {
        file: this.fileData,
        fileId: this.fileId,
        binData: evt.data.bin,
        chunkId: evt.data.chunkId,
        chunkSize: this.config.chunkSize,
        fileLength: this.fileLength
      };
      this.emitEvent('data', [evt.data.bin]);
      if (this.pipes.length) {
        ref = this.pipes;
        for (j = 0, len = ref.length; j < len; j++) {
          pipeFunc = ref[j];
          opts.binData = pipeFunc(opts.binData);
        }
      }
      if (this.fileLength === evt.data.chunkId) {
        if (this.collection.debug) {
          console.timeEnd('loadFile ' + this.config.file.name);
        }
        this.emitEvent('readEnd');
      }
      if (opts.binData && opts.binData.length) {
        Meteor.call(this.collection.methodNames.MeteorFileWrite, opts, function(error) {
          ++self.sentChunks;
          self.transferTime += (+(new Date)) - evt.data.start;
          if (error) {
            self.emitEvent('end', [error]);
          } else {
            if (self.sentChunks >= self.fileLength) {
              self.emitEvent('sendEOF', [opts]);
            } else if (self.currentChunk < self.fileLength) {
              self.emitEvent('upload');
            }
            self.emitEvent('calculateStats');
          }
        });
      }
    };

    UploadInstance.prototype.sendEOF = function(opts) {
      var self;
      if (!this.EOFsent) {
        this.EOFsent = true;
        self = this;
        opts = {
          eof: true,
          meta: this.config.meta,
          file: this.fileData,
          fileId: this.fileId,
          chunkSize: this.config.chunkSize,
          fileLength: this.fileLength
        };
        Meteor.call(this.collection.methodNames.MeteorFileWrite, opts, function() {
          return self.emitEvent('end', arguments);
        });
      }
    };

    UploadInstance.prototype.proceedChunk = function(chunkId, start) {
      var chunk, fileReader, self;
      self = this;
      chunk = this.config.file.slice(this.config.chunkSize * (chunkId - 1), this.config.chunkSize * chunkId);
      fileReader = new FileReader;
      fileReader.onloadend = function(evt) {
        var ref, ref1;
        self.emitEvent('sendViaDDP', [
          {
            data: {
              bin: ((fileReader != null ? fileReader.result : void 0) || ((ref = evt.srcElement) != null ? ref.result : void 0) || ((ref1 = evt.target) != null ? ref1.result : void 0)).split(',')[1],
              chunkId: chunkId,
              start: start
            }
          }
        ]);
      };
      fileReader.onerror = function(e) {
        self.emitEvent('end', [(e.target || e.srcElement).error]);
      };
      fileReader.readAsDataURL(chunk);
    };

    UploadInstance.prototype.upload = function() {
      var self, start;
      start = +(new Date);
      if (this.result.onPause.get()) {
        self = this;
        this.result.continueFunc = function() {
          self.emitEvent('createStreams');
        };
        return;
      }
      if (this.result.state.get() === 'aborted') {
        return this;
      }
      if (this.currentChunk <= this.fileLength) {
        ++this.currentChunk;
        if (this.worker) {
          this.worker.postMessage({
            sentChunks: this.sentChunks,
            start: start,
            currentChunk: this.currentChunk,
            chunkSize: this.config.chunkSize,
            file: this.config.file
          });
        } else {
          this.emitEvent('proceedChunk', [this.currentChunk, start]);
        }
      }
    };

    UploadInstance.prototype.createStreams = function() {
      var i, self;
      i = 1;
      self = this;
      while (i <= this.config.streams) {
        self.emitEvent('upload');
        i++;
      }
    };

    UploadInstance.prototype.prepare = function() {
      var _len, self;
      self = this;
      this.config.onStart && this.config.onStart.call(this.result, null, this.fileData);
      this.result.emitEvent('start', [null, this.fileData]);
      if (this.config.chunkSize === 'dynamic') {
        this.config.chunkSize = this.config.file.size / 1000;
        if (this.config.chunkSize < 327680) {
          this.config.chunkSize = 327680;
        } else if (this.config.chunkSize > 1048576) {
          this.config.chunkSize = 1048576;
        }
      }
      this.config.chunkSize = Math.floor(this.config.chunkSize / 8) * 8;
      _len = Math.ceil(this.config.file.size / this.config.chunkSize);
      if (this.config.streams === 'dynamic') {
        this.config.streams = _.clone(_len);
        if (this.config.streams > 24) {
          this.config.streams = 24;
        }
      }
      this.fileLength = _len <= 0 ? 1 : _len;
      if (this.config.streams > this.fileLength) {
        this.config.streams = this.fileLength;
      }
      this.result.config.fileLength = this.fileLength;
      self.emitEvent('createStreams');
    };

    UploadInstance.prototype.pipe = function(func) {
      this.pipes.push(func);
      return this;
    };

    UploadInstance.prototype.start = function() {
      var isUploadAllowed, self;
      self = this;
      if (this.config.file.size <= 0) {
        this.end(new Meteor.Error(400, 'Can\'t upload empty file'));
        return this.result;
      }
      if (this.config.onBeforeUpload && _.isFunction(this.config.onBeforeUpload)) {
        isUploadAllowed = this.config.onBeforeUpload.call(_.extend(this.result, this.collection.getUser()), this.fileData);
        if (isUploadAllowed !== true) {
          return this.end(new Meteor.Error(403, _.isString(isUploadAllowed) ? isUploadAllowed : 'config.onBeforeUpload() returned false'));
        }
      }
      if (this.collection.onBeforeUpload && _.isFunction(this.collection.onBeforeUpload)) {
        isUploadAllowed = this.collection.onBeforeUpload.call(_.extend(this.result, this.collection.getUser()), this.fileData);
        if (isUploadAllowed !== true) {
          return this.end(new Meteor.Error(403, _.isString(isUploadAllowed) ? isUploadAllowed : 'collection.onBeforeUpload() returned false'));
        }
      }
      Tracker.autorun(function(computation) {
        self.trackerComp = computation;
        if (!self.result.onPause.get()) {
          if (Meteor.status().connected) {
            self.result["continue"]();
            if (self.collection.debug) {
              console.info('[FilesCollection] [insert] [Tracker] [continue]');
            }
          } else {
            self.result.pause();
            if (self.collection.debug) {
              console.info('[FilesCollection] [insert] [Tracker] [pause]');
            }
          }
        }
      });
      if (this.worker) {
        this.worker.onmessage = function(evt) {
          if (evt.data.error) {
            if (self.collection.debug) {
              console.warn(evt.data.error);
            }
            self.emitEvent('proceedChunk', [evt.data.chunkId, evt.data.start]);
          } else {
            self.emitEvent('sendViaDDP', [evt]);
          }
        };
        this.worker.onerror = function(e) {
          self.emitEvent('end', [e.message]);
        };
      }
      if (this.collection.debug) {
        if (this.worker) {
          console.info("[FilesCollection] [insert] using WebWorkers");
        } else {
          console.info("[FilesCollection] [insert] using MainThread");
        }
      }
      self.emitEvent('prepare');
      return this.result;
    };

    UploadInstance.prototype.manual = function() {
      var self;
      self = this;
      this.result.start = function() {
        self.emitEvent('start');
      };
      this.result.pipe = function(func) {
        self.pipe(func);
        return this;
      };
      return this.result;
    };

    return UploadInstance;

  })() : void 0;


  /*
  @locus Client
  @memberOf FilesCollection
  @name _FileUpload
  @class FileUpload
  @summary Internal Class, instance of this class is returned from `insert()` method
   */

  FilesCollection.prototype._FileUpload = Meteor.isClient ? FileUpload = (function() {
    FileUpload.prototype.__proto__ = EventEmitter.prototype;

    function FileUpload(config1) {
      this.config = config1;
      EventEmitter.call(this);
      this.file = _.extend(this.config.file, this.config.fileData);
      this.state = new ReactiveVar('active');
      this.onPause = new ReactiveVar(false);
      this.progress = new ReactiveVar(0);
      this.estimateTime = new ReactiveVar(1000);
      this.estimateSpeed = new ReactiveVar(0);
    }

    FileUpload.prototype.continueFunc = function() {};

    FileUpload.prototype.pause = function() {
      if (!this.onPause.get()) {
        this.onPause.set(true);
        this.state.set('paused');
        this.emitEvent('pause', [this.file]);
      }
    };

    FileUpload.prototype["continue"] = function() {
      if (this.onPause.get()) {
        this.onPause.set(false);
        this.state.set('active');
        this.emitEvent('continue', [this.file]);
        this.continueFunc.call();
        this.continueFunc = function() {};
      }
    };

    FileUpload.prototype.toggle = function() {
      if (this.onPause.get()) {
        this["continue"]();
      } else {
        this.pause();
      }
    };

    FileUpload.prototype.abort = function() {
      window.removeEventListener('beforeunload', this.config.beforeunload, false);
      this.config.onAbort && this.config.onAbort.call(this, this.file);
      this.emitEvent('abort', [this.file]);
      this.pause();
      this.config._onEnd();
      this.state.set('aborted');
      if (this.config.debug) {
        console.timeEnd('insert ' + this.config.file.name);
      }
      if (this.config.fileLength) {
        Meteor.call(this.config.MeteorFileAbort, {
          fileId: this.config.fileId,
          fileLength: this.config.fileLength,
          fileData: this.config.fileData
        });
      }
    };

    return FileUpload;

  })() : void 0;


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name remove
  @param {String|Object} search - `_id` of the file or `Object` like, {prop:'val'}
  @param {Function} cb - Callback with one `error` argument
  @summary Remove file(s) on cursor or find and remove file(s) if search is set
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.remove = function(search, cb) {
    var files, self;
    if (this.debug) {
      console.info("[FilesCollection] [remove(" + (JSON.stringify(search)) + ")]");
    }
    check(search, Match.Optional(Match.OneOf(Object, String)));
    check(cb, Match.Optional(Function));
    if (this.checkAccess()) {
      this.srch(search);
      if (Meteor.isClient) {
        Meteor.call(this.methodNames.MeteorFileUnlink, rcp(this), (cb ? cb : NOOP));
      }
      if (Meteor.isServer) {
        files = this.collection.find(this.search);
        if (files.count() > 0) {
          self = this;
          files.forEach(function(file) {
            return self.unlink(file);
          });
        }
        this.collection.remove(this.search, cb);
      }
    } else {
      cb && cb(new Meteor.Error(401, '[FilesCollection] [remove] Access denied!'));
    }
    return this;
  };


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name update
  @see http://docs.meteor.com/#/full/update
  @summary link Mongo.Collection update method
  @returns {Mongo.Collection} Instance
   */

  FilesCollection.prototype.update = function() {
    this.collection.update.apply(this.collection, arguments);
    return this.collection;
  };


  /*
  @locus Server
  @memberOf FilesCollection
  @name deny
  @name allow
  @param {Object} rules
  @see http://docs.meteor.com/#/full/allow
  @summary link Mongo.Collection allow/deny methods
  @returns {Mongo.Collection} Instance
   */

  FilesCollection.prototype.deny = Meteor.isServer ? function(rules) {
    this.collection.deny(rules);
    return this.collection;
  } : void 0;

  FilesCollection.prototype.allow = Meteor.isServer ? function(rules) {
    this.collection.allow(rules);
    return this.collection;
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name denyClient
  @name allowClient
  @see http://docs.meteor.com/#/full/allow
  @summary Shorthands for Mongo.Collection allow/deny methods
  @returns {Mongo.Collection} Instance
   */

  FilesCollection.prototype.denyClient = Meteor.isServer ? function() {
    this.collection.deny({
      insert: function() {
        return true;
      },
      update: function() {
        return true;
      },
      remove: function() {
        return true;
      }
    });
    return this.collection;
  } : void 0;

  FilesCollection.prototype.allowClient = Meteor.isServer ? function() {
    this.collection.allow({
      insert: function() {
        return true;
      },
      update: function() {
        return true;
      },
      remove: function() {
        return true;
      }
    });
    return this.collection;
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name unlink
  @param {Object} fileRef - fileObj
  @param {String} version - [Optional] file's version
  @summary Unlink files and it's versions from FS
  @returns {FilesCollection} Instance
   */

  FilesCollection.prototype.unlink = Meteor.isServer ? function(fileRef, version) {
    var ref, ref1;
    if (this.debug) {
      console.info("[FilesCollection] [unlink(" + fileRef._id + ", " + version + ")]");
    }
    if (version) {
      if (((ref = fileRef.versions) != null ? ref[version] : void 0) && ((ref1 = fileRef.versions[version]) != null ? ref1.path : void 0)) {
        fs.unlink(fileRef.versions[version].path, NOOP);
      }
    } else {
      if (fileRef.versions && !_.isEmpty(fileRef.versions)) {
        _.each(fileRef.versions, function(vRef) {
          return bound(function() {
            return fs.unlink(vRef.path, NOOP);
          });
        });
      }
      fs.unlink(fileRef.path, NOOP);
    }
    return this;
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name _404
  @summary Internal method, used to return 404 error
  @returns {undefined}
   */

  FilesCollection.prototype._404 = Meteor.isServer ? function(http) {
    var text;
    if (this.debug) {
      console.warn("[FilesCollection] [download(" + http.request.originalUrl + ")] [_404] File not found");
    }
    text = 'File Not Found :(';
    http.response.writeHead(404, {
      'Content-Length': text.length,
      'Content-Type': 'text/plain'
    });
    http.response.end(text);
  } : void 0;


  /*
  @locus Server
  @memberOf FilesCollection
  @name download
  @param {Object|Files} self - Instance of FilesCollection
  @summary Initiates the HTTP response
  @returns {undefined}
   */

  FilesCollection.prototype.download = Meteor.isServer ? function(http, version) {
    var fileRef, responseType, self;
    if (version == null) {
      version = 'original';
    }
    if (this.debug) {
      console.info("[FilesCollection] [download(" + http.request.originalUrl + ", " + version + ")]");
    }
    responseType = '200';
    if (this.currentFile) {
      if (_.has(this.currentFile, 'versions') && _.has(this.currentFile.versions, version)) {
        fileRef = this.currentFile.versions[version];
      } else {
        fileRef = this.currentFile;
      }
    } else {
      fileRef = false;
    }
    if (!fileRef || !_.isObject(fileRef)) {
      return this._404(http);
    } else if (this.currentFile) {
      self = this;
      if (this.downloadCallback) {
        if (!this.downloadCallback.call(_.extend(http, this.getUser(http)), this.currentFile)) {
          return this._404(http);
        }
      }
      if (this.interceptDownload && _.isFunction(this.interceptDownload)) {
        if (this.interceptDownload(http, this.currentFile, version) === true) {
          return;
        }
      }
      fs.stat(fileRef.path, function(statErr, stats) {
        return bound(function() {
          var array, dispositionEncoding, dispositionName, dispositionType, end, partiral, ref, ref1, ref2, ref3, reqRange, start, stream, streamErrorHandler, take, text;
          if (statErr || !stats.isFile()) {
            return self._404(http);
          }
          if (stats.size !== fileRef.size && !self.integrityCheck) {
            fileRef.size = stats.size;
          }
          if (stats.size !== fileRef.size && self.integrityCheck) {
            responseType = '400';
          }
          partiral = false;
          reqRange = false;
          if (http.params.query.download && http.params.query.download === 'true') {
            dispositionType = 'attachment; ';
          } else {
            dispositionType = 'inline; ';
          }
          dispositionName = "filename=\"" + (encodeURIComponent(self.currentFile.name)) + "\"; filename=*UTF-8\"" + (encodeURIComponent(self.currentFile.name)) + "\"; ";
          dispositionEncoding = 'charset=utf-8';
          http.response.setHeader('Content-Type', fileRef.type);
          http.response.setHeader('Content-Disposition', dispositionType + dispositionName + dispositionEncoding);
          http.response.setHeader('Accept-Ranges', 'bytes');
          if ((ref = self.currentFile) != null ? (ref1 = ref.updatedAt) != null ? ref1.toUTCString() : void 0 : void 0) {
            http.response.setHeader('Last-Modified', (ref2 = self.currentFile) != null ? (ref3 = ref2.updatedAt) != null ? ref3.toUTCString() : void 0 : void 0);
          }
          http.response.setHeader('Connection', 'keep-alive');
          if (http.request.headers.range) {
            partiral = true;
            array = http.request.headers.range.split(/bytes=([0-9]*)-([0-9]*)/);
            start = parseInt(array[1]);
            end = parseInt(array[2]);
            if (isNaN(end)) {
              end = fileRef.size - 1;
            }
            take = end - start;
          } else {
            start = 0;
            end = fileRef.size - 1;
            take = fileRef.size;
          }
          if (partiral || (http.params.query.play && http.params.query.play === 'true')) {
            reqRange = {
              start: start,
              end: end
            };
            if (isNaN(start) && !isNaN(end)) {
              reqRange.start = end - take;
              reqRange.end = end;
            }
            if (!isNaN(start) && isNaN(end)) {
              reqRange.start = start;
              reqRange.end = start + take;
            }
            if ((start + take) >= fileRef.size) {
              reqRange.end = fileRef.size - 1;
            }
            http.response.setHeader('Pragma', 'private');
            http.response.setHeader('Expires', new Date(+(new Date) + 1000 * 32400).toUTCString());
            http.response.setHeader('Cache-Control', 'private, maxage=10800, s-maxage=32400');
            if (self.strict && (reqRange.start >= (fileRef.size - 1) || reqRange.end > (fileRef.size - 1))) {
              responseType = '416';
            } else {
              responseType = '206';
            }
          } else {
            http.response.setHeader('Cache-Control', self.cacheControl);
            responseType = '200';
          }
          streamErrorHandler = function(error) {
            http.response.writeHead(500);
            return http.response.end(error.toString());
          };
          switch (responseType) {
            case '400':
              if (self.debug) {
                console.warn("[FilesCollection] [download(" + fileRef.path + ", " + version + ")] [400] Content-Length mismatch!");
              }
              text = 'Content-Length mismatch!';
              http.response.writeHead(400, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache',
                'Content-Length': text.length
              });
              http.response.end(text);
              break;
            case '404':
              return self._404(http);
              break;
            case '416':
              if (self.debug) {
                console.info("[FilesCollection] [download(" + fileRef.path + ", " + version + ")] [416] Content-Range is not specified!");
              }
              http.response.writeHead(416, {
                'Content-Range': "bytes */" + fileRef.size
              });
              http.response.end();
              break;
            case '200':
              if (self.debug) {
                console.info("[FilesCollection] [download(" + fileRef.path + ", " + version + ")] [200]");
              }
              stream = fs.createReadStream(fileRef.path);
              stream.on('open', (function(_this) {
                return function() {
                  http.response.writeHead(200);
                  if (self.throttle) {
                    return stream.pipe(new Throttle({
                      bps: self.throttle,
                      chunksize: self.chunkSize
                    })).pipe(http.response);
                  } else {
                    return stream.pipe(http.response);
                  }
                };
              })(this)).on('error', streamErrorHandler);
              break;
            case '206':
              if (self.debug) {
                console.info("[FilesCollection] [download(" + fileRef.path + ", " + version + ")] [206]");
              }
              http.response.setHeader('Content-Range', "bytes " + reqRange.start + "-" + reqRange.end + "/" + fileRef.size);
              http.response.setHeader('Trailer', 'expires');
              http.response.setHeader('Transfer-Encoding', 'chunked');
              if (self.throttle) {
                stream = fs.createReadStream(fileRef.path, {
                  start: reqRange.start,
                  end: reqRange.end
                });
                stream.on('open', function() {
                  return http.response.writeHead(206);
                }).on('error', streamErrorHandler).on('end', function() {
                  return http.response.end();
                }).pipe(new Throttle({
                  bps: self.throttle,
                  chunksize: self.chunkSize
                })).pipe(http.response);
              } else {
                stream = fs.createReadStream(fileRef.path, {
                  start: reqRange.start,
                  end: reqRange.end
                });
                stream.on('open', function() {
                  return http.response.writeHead(206);
                }).on('error', streamErrorHandler).on('end', function() {
                  return http.response.end();
                }).pipe(http.response);
              }
              break;
          }
        });
      });
    } else {
      return this._404(http);
    }
  } : void 0;


  /*
  @locus Anywhere
  @memberOf FilesCollection
  @name link
  @param {Object}   fileRef - File reference object
  @param {String}   version - [Optional] Version of file you would like to request
  @summary Returns downloadable URL
  @returns {String} Empty string returned in case if file not found in DB
   */

  FilesCollection.prototype.link = function(fileRef, version) {
    if (version == null) {
      version = 'original';
    }
    if (this.debug) {
      console.info('[FilesCollection] [link()]');
    }
    if (_.isString(fileRef)) {
      version = fileRef;
      fileRef = null;
    }
    if (!fileRef && !this.currentFile) {
      return '';
    }
    return formatFleURL(fileRef || this.currentFile, version);
  };

  return FilesCollection;

})();


/*
@locus Anywhere
@private
@name formatFleURL
@param {Object} fileRef - File reference object
@param {String} version - [Optional] Version of file you would like build URL for
@param {Boolean}  pub   - [Optional] is file located in publicity available folder?
@summary Returns formatted URL for file
@returns {String} Downloadable link
 */

formatFleURL = function(fileRef, version) {
  var ext, ref, root;
  if (version == null) {
    version = 'original';
  }
  root = __meteor_runtime_config__.ROOT_URL.replace(/\/+$/, '');
  if ((fileRef != null ? (ref = fileRef.extension) != null ? ref.length : void 0 : void 0) > 0) {
    ext = '.' + fileRef.extension;
  } else {
    ext = '';
  }
  if (fileRef["public"] === true) {
    return root + (version === 'original' ? fileRef._downloadRoute + "/" + fileRef._id + ext : fileRef._downloadRoute + "/" + version + "-" + fileRef._id + ext);
  } else {
    return root + (fileRef._downloadRoute + "/" + fileRef._collectionName + "/" + fileRef._id + "/" + version + "/" + fileRef._id + ext);
  }
};

if (Meteor.isClient) {

  /*
  @locus Client
  @TemplateHelper
  @name fileURL
  @param {Object} fileRef - File reference object
  @param {String} version - [Optional] Version of file you would like to request
  @summary Get download URL for file by fileRef, even without subscription
  @example {{fileURL fileRef}}
  @returns {String}
   */
  Template.registerHelper('fileURL', function(fileRef, version) {
    if (!fileRef || !_.isObject(fileRef)) {
      return void 0;
    }
    version = !version || !_.isString(version) ? 'original' : version;
    if (fileRef._id) {
      return formatFleURL(fileRef, version);
    } else {
      return '';
    }
  });
}

Meteor.Files = FilesCollection;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("ostrio:files", {
  FilesCollection: FilesCollection
});

})();

//# sourceURL=meteor://💻app/packages/ostrio_files.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvb3N0cmlvX2ZpbGVzL2ZpbGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFBQSxPQUFPLGFBQVA7O0FBRUEsSUFBRyxNQUFNLENBQUMsUUFBVjtBQUNFO0FBQUE7O0tBQUE7QUFBQSxFQUdBLEtBQWUsR0FBRyxDQUFDLE9BQUosQ0FBWSxVQUFaLENBSGY7QUFBQSxFQUlBLFNBQWUsR0FBRyxDQUFDLE9BQUosQ0FBWSxRQUFaLENBSmY7QUFBQSxFQUtBLFVBQWUsR0FBRyxDQUFDLE9BQUosQ0FBWSxTQUFaLENBTGY7QUFBQSxFQU1BLFdBQWUsR0FBRyxDQUFDLE9BQUosQ0FBWSxVQUFaLENBTmY7QUFBQSxFQU9BLFdBQWUsR0FBRyxDQUFDLE9BQUosQ0FBWSxXQUFaLENBUGY7QUFBQSxFQVFBLFdBQWUsR0FBRyxDQUFDLE9BQUosQ0FBWSxNQUFaLENBUmY7QUFVQTtBQUFBOztLQVZBO0FBQUEsRUFhQSxRQUFRLE1BQU0sQ0FBQyxlQUFQLENBQXVCLFNBQUMsUUFBRDtBQUFjLFdBQU8sVUFBUCxDQUFkO0VBQUEsQ0FBdkIsQ0FiUixDQURGO0NBRkE7O0FBa0JBO0FBQUE7Ozs7R0FsQkE7O0FBQUEsTUF1QkEsR0FBUyxFQXZCVDs7QUF5QkE7QUFBQTs7Ozs7R0F6QkE7O0FBQUEsR0ErQkEsR0FBTSxTQUFDLEdBQUQ7QUFDSjtBQUFBLE1BQ0U7QUFBQSxpQkFBZ0IsR0FBRyxDQUFDLFdBQXBCO0FBQUEsSUFDQSxRQUFnQixHQUFHLENBQUMsTUFEcEI7QUFBQSxJQUVBLGdCQUFnQixHQUFHLENBQUMsY0FGcEI7QUFBQSxJQUdBLGVBQWdCLEdBQUcsQ0FBQyxhQUhwQjtBQUFBLElBSUEsV0FBZ0IsR0FBRyxDQUFDLFNBSnBCO0FBQUEsSUFLQSxPQUFnQixHQUFHLENBQUMsS0FMcEI7QUFBQSxJQU1BLFNBQWdCLEdBQUcsQ0FBQyxPQU5wQjtH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Q0FBQyxLQUFQLEdBQWUsZUE3Z0RmIiwiZmlsZSI6Ii9wYWNrYWdlcy9vc3RyaW9fZmlsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJOT09QID0gLT4gcmV0dXJuXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuICAjIyNcbiAgQHN1bW1hcnkgUmVxdWlyZSBOUE0gcGFja2FnZXNcbiAgIyMjXG4gIGZzICAgICAgICAgICA9IE5wbS5yZXF1aXJlICdmcy1leHRyYSdcbiAgZXZlbnRzICAgICAgID0gTnBtLnJlcXVpcmUgJ2V2ZW50cydcbiAgcmVxdWVzdCAgICAgID0gTnBtLnJlcXVpcmUgJ3JlcXVlc3QnXG4gIFRocm90dGxlICAgICA9IE5wbS5yZXF1aXJlICd0aHJvdHRsZSdcbiAgZmlsZVR5cGUgICAgID0gTnBtLnJlcXVpcmUgJ2ZpbGUtdHlwZSdcbiAgbm9kZVBhdGggICAgID0gTnBtLnJlcXVpcmUgJ3BhdGgnXG5cbiAgIyMjXG4gIEB2YXIge29iamVjdH0gYm91bmQgLSBNZXRlb3IuYmluZEVudmlyb25tZW50IChGaWJlciB3cmFwcGVyKVxuICAjIyNcbiAgYm91bmQgPSBNZXRlb3IuYmluZEVudmlyb25tZW50IChjYWxsYmFjaykgLT4gcmV0dXJuIGNhbGxiYWNrKClcblxuIyMjXG5AcHJpdmF0ZVxuQG5hbWUgX2luc3RzXG5Ac3VtbWFyeSBPYmplY3Qgb2YgRmlsZXNDb2xsZWN0aW9uIGluc3RhbmNlc1xuIyMjXG5faW5zdHMgPSB7fVxuXG4jIyNcbkBwcml2YXRlXG5AbmFtZSByY3BcbkBwYXJhbSB7T2JqZWN0fSBvYmogLSBJbml0aWFsIG9iamVjdFxuQHN1bW1hcnkgQ3JlYXRlIG9iamVjdCB3aXRoIG9ubHkgbmVlZGVkIHByb3BzXG4jIyNcbnJjcCA9IChvYmopIC0+XG4gIG8gPVxuICAgIGN1cnJlbnRGaWxlOiAgICBvYmouY3VycmVudEZpbGVcbiAgICBzZWFyY2g6ICAgICAgICAgb2JqLnNlYXJjaFxuICAgIGNvbGxlY3Rpb25OYW1lOiBvYmouY29sbGVjdGlvbk5hbWVcbiAgICBkb3dubG9hZFJvdXRlOiAgb2JqLmRvd25sb2FkUm91dGVcbiAgICBjaHVua1NpemU6ICAgICAgb2JqLmNodW5rU2l6ZVxuICAgIGRlYnVnOiAgICAgICAgICBvYmouZGVidWdcbiAgICBfcHJlZml4OiAgICAgICAgb2JqLl9wcmVmaXhcbiAgcmV0dXJuIG9cblxuIyMjXG5AcHJpdmF0ZVxuQG5hbWUgY3BcbkBwYXJhbSB7T2JqZWN0fSB0byAgIC0gRGVzdGluYXRpb25cbkBwYXJhbSB7T2JqZWN0fSBmcm9tIC0gU291cmNlXG5Ac3VtbWFyeSBDb3B5LVBhc3RlIG9ubHkgbmVlZGVkIHByb3BzIGZyb20gb25lIHRvIGFub3RoZXIgb2JqZWN0XG4jIyNcbmNwID0gKHRvLCBmcm9tKSAtPlxuICB0by5jdXJyZW50RmlsZSAgICA9IGZyb20uY3VycmVudEZpbGVcbiAgdG8uc2VhcmNoICAgICAgICAgPSBmcm9tLnNlYXJjaFxuICB0by5jb2xsZWN0aW9uTmFtZSA9IGZyb20uY29sbGVjdGlvbk5hbWVcbiAgdG8uZG93bmxvYWRSb3V0ZSAgPSBmcm9tLmRvd25sb2FkUm91dGVcbiAgdG8uY2h1bmtTaXplICAgICAgPSBmcm9tLmNodW5rU2l6ZVxuICB0by5kZWJ1ZyAgICAgICAgICA9IGZyb20uZGVidWdcbiAgdG8uX3ByZWZpeCAgICAgICAgPSBmcm9tLl9wcmVmaXhcbiAgcmV0dXJuIHRvXG5cbiMjI1xuQGxvY3VzIEFueXdoZXJlXG5AY2xhc3MgRmlsZXNDb2xsZWN0aW9uXG5AcGFyYW0gY29uZmlnICAgICAgICAgICB7T2JqZWN0fSAgIC0gW0JvdGhdICAgQ29uZmlndXJhdGlvbiBvYmplY3Qgd2l0aCBuZXh0IHByb3BlcnRpZXM6XG5AcGFyYW0gY29uZmlnLmRlYnVnICAgICB7Qm9vbGVhbn0gIC0gW0JvdGhdICAgVHVybiBvbi9vZiBkZWJ1Z2dpbmcgYW5kIGV4dHJhIGxvZ2dpbmdcbkBwYXJhbSBjb25maWcuc2NoZW1hICAgIHtPYmplY3R9ICAgLSBbQm90aF0gICBDb2xsZWN0aW9uIFNjaGVtYVxuQHBhcmFtIGNvbmZpZy5wdWJsaWMgICAge0Jvb2xlYW59ICAtIFtCb3RoXSAgIFN0b3JlIGZpbGVzIGluIGZvbGRlciBhY2Nlc3NpYmxlIGZvciBwcm94eSBzZXJ2ZXJzLCBmb3IgbGltaXRzLCBhbmQgbW9yZSAtIHJlYWQgZG9jc1xuQHBhcmFtIGNvbmZpZy5zdHJpY3QgICAge0Jvb2xlYW59ICAtIFtTZXJ2ZXJdIFN0cmljdCBtb2RlIGZvciBwYXJ0aWFsIGNvbnRlbnQsIGlmIGlzIGB0cnVlYCBzZXJ2ZXIgd2lsbCByZXR1cm4gYDQxNmAgcmVzcG9uc2UgY29kZSwgd2hlbiBgcmFuZ2VgIGlzIG5vdCBzcGVjaWZpZWQsIG90aGVyd2lzZSBzZXJ2ZXIgcmV0dXJuIGAyMDZgXG5AcGFyYW0gY29uZmlnLnByb3RlY3RlZCB7RnVuY3Rpb259IC0gW0JvdGhdICAgSWYgYHRydWVgIC0gZmlsZXMgd2lsbCBiZSBzZXJ2ZWQgb25seSB0byBhdXRob3JpemVkIHVzZXJzLCBpZiBgZnVuY3Rpb24oKWAgLSB5b3UncmUgYWJsZSB0byBjaGVjayB2aXNpdG9yJ3MgcGVybWlzc2lvbnMgaW4geW91ciBvd24gd2F5IGZ1bmN0aW9uJ3MgY29udGV4dCBoYXM6XG4gIC0gYHJlcXVlc3RgIC0gT24gc2VydmVyIG9ubHlcbiAgLSBgcmVzcG9uc2VgIC0gT24gc2VydmVyIG9ubHlcbiAgLSBgdXNlcigpYFxuICAtIGB1c2VySWRgXG5AcGFyYW0gY29uZmlnLmNodW5rU2l6ZSAgICAgIHtOdW1iZXJ9ICAtIFtCb3RoXSBVcGxvYWQgY2h1bmsgc2l6ZSwgZGVmYXVsdDogNTI0Mjg4IGJ5dGVzICgwLDUgTWIpXG5AcGFyYW0gY29uZmlnLnBlcm1pc3Npb25zICAgIHtOdW1iZXJ9ICAtIFtTZXJ2ZXJdIFBlcm1pc3Npb25zIHdoaWNoIHdpbGwgYmUgc2V0IHRvIHVwbG9hZGVkIGZpbGVzIChvY3RhbCksIGxpa2U6IGA1MTFgIG9yIGAwbzc1NWAuIERlZmF1bHQ6IDA2NDRcbkBwYXJhbSBjb25maWcuc3RvcmFnZVBhdGggICAge1N0cmluZ30gIC0gW1NlcnZlcl0gU3RvcmFnZSBwYXRoIG9uIGZpbGUgc3lzdGVtXG5AcGFyYW0gY29uZmlnLmNhY2hlQ29udHJvbCAgIHtTdHJpbmd9ICAtIFtTZXJ2ZXJdIERlZmF1bHQgYENhY2hlLUNvbnRyb2xgIGhlYWRlclxuQHBhcmFtIGNvbmZpZy50aHJvdHRsZSAgICAgICB7TnVtYmVyfSAgLSBbU2VydmVyXSBicHMgdGhyb3R0bGUgdGhyZXNob2xkXG5AcGFyYW0gY29uZmlnLmRvd25sb2FkUm91dGUgIHtTdHJpbmd9ICAtIFtCb3RoXSAgIFNlcnZlciBSb3V0ZSB1c2VkIHRvIHJldHJpZXZlIGZpbGVzXG5AcGFyYW0gY29uZmlnLmNvbGxlY3Rpb25OYW1lIHtTdHJpbmd9ICAtIFtCb3RoXSAgIENvbGxlY3Rpb24gbmFtZVxuQHBhcmFtIGNvbmZpZy5uYW1pbmdGdW5jdGlvbiB7RnVuY3Rpb259LSBbQm90aF0gICBGdW5jdGlvbiB3aGljaCByZXR1cm5zIGBTdHJpbmdgXG5AcGFyYW0gY29uZmlnLmludGVncml0eUNoZWNrIHtCb29sZWFufSAtIFtTZXJ2ZXJdIENoZWNrIGZpbGUncyBpbnRlZ3JpdHkgYmVmb3JlIHNlcnZpbmcgdG8gdXNlcnNcbkBwYXJhbSBjb25maWcub25BZnRlclVwbG9hZCAge0Z1bmN0aW9ufS0gW1NlcnZlcl0gQ2FsbGVkIHJpZ2h0IGFmdGVyIGZpbGUgaXMgcmVhZHkgb24gRlMuIFVzZSB0byB0cmFuc2ZlciBmaWxlIHNvbWV3aGVyZSBlbHNlLCBvciBkbyBvdGhlciB0aGluZyB3aXRoIGZpbGUgZGlyZWN0bHlcbkBwYXJhbSBjb25maWcub25CZWZvcmVVcGxvYWQge0Z1bmN0aW9ufS0gW0JvdGhdICAgRnVuY3Rpb24gd2hpY2ggZXhlY3V0ZXMgb24gc2VydmVyIGFmdGVyIHJlY2VpdmluZyBlYWNoIGNodW5rIGFuZCBvbiBjbGllbnQgcmlnaHQgYmVmb3JlIGJlZ2lubmluZyB1cGxvYWQuIEZ1bmN0aW9uIGNvbnRleHQgaXMgYEZpbGVgIC0gc28geW91IGFyZSBhYmxlIHRvIGNoZWNrIGZvciBleHRlbnNpb24sIG1pbWUtdHlwZSwgc2l6ZSBhbmQgZXRjLlxucmV0dXJuIGB0cnVlYCB0byBjb250aW51ZVxucmV0dXJuIGBmYWxzZWAgb3IgYFN0cmluZ2AgdG8gYWJvcnQgdXBsb2FkXG5AcGFyYW0gY29uZmlnLm9uQmVmb3JlUmVtb3ZlIHtGdW5jdGlvbn0gLSBbU2VydmVyXSBFeGVjdXRlcyBiZWZvcmUgcmVtb3ZpbmcgZmlsZSBvbiBzZXJ2ZXIsIHNvIHlvdSBjYW4gY2hlY2sgcGVybWlzc2lvbnMuIFJldHVybiBgdHJ1ZWAgdG8gYWxsb3cgYWN0aW9uIGFuZCBgZmFsc2VgIHRvIGRlbnkuXG5AcGFyYW0gY29uZmlnLmFsbG93Q2xpZW50Q29kZSAge0Jvb2xlYW59ICAtIFtCb3RoXSAgIEFsbG93IHRvIHJ1biBgcmVtb3ZlYCBmcm9tIGNsaWVudFxuQHBhcmFtIGNvbmZpZy5kb3dubG9hZENhbGxiYWNrIHtGdW5jdGlvbn0gLSBbU2VydmVyXSBDYWxsYmFjayB0cmlnZ2VyZWQgZWFjaCB0aW1lIGZpbGUgaXMgcmVxdWVzdGVkLCByZXR1cm4gdHJ1dGh5IHZhbHVlIHRvIGNvbnRpbnVlIGRvd25sb2FkLCBvciBmYWxzeSB0byBhYm9ydFxuQHBhcmFtIGNvbmZpZy5pbnRlcmNlcHREb3dubG9hZCB7RnVuY3Rpb259IC0gW1NlcnZlcl0gSW50ZXJjZXB0IGRvd25sb2FkIHJlcXVlc3QsIHNvIHlvdSBjYW4gc2VydmUgZmlsZSBmcm9tIHRoaXJkLXBhcnR5IHJlc291cmNlLCBhcmd1bWVudHMge2h0dHA6IHtyZXF1ZXN0OiB7Li4ufSwgcmVzcG9uc2U6IHsuLi59fSwgZmlsZVJlZjogey4uLn19XG5AcGFyYW0gY29uZmlnLm9uYmVmb3JldW5sb2FkTWVzc2FnZSB7U3RyaW5nfEZ1bmN0aW9ufSAtIFtDbGllbnRdIE1lc3NhZ2Ugc2hvd24gdG8gdXNlciB3aGVuIGNsb3NpbmcgYnJvd3NlcidzIHdpbmRvdyBvciB0YWIgd2hpbGUgdXBsb2FkIHByb2Nlc3MgaXMgcnVubmluZ1xuQHN1bW1hcnkgQ3JlYXRlIG5ldyBpbnN0YW5jZSBvZiBGaWxlc0NvbGxlY3Rpb25cbiMjI1xuY2xhc3MgRmlsZXNDb2xsZWN0aW9uXG4gIF9fcHJvdG9fXzogZG8gLT4gaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gZXZlbnRzLkV2ZW50RW1pdHRlci5wcm90b3R5cGUgZWxzZSBFdmVudEVtaXR0ZXIucHJvdG90eXBlXG4gIGNvbnN0cnVjdG9yOiAoY29uZmlnKSAtPlxuICAgIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgZXZlbnRzLkV2ZW50RW1pdHRlci5jYWxsIEBcbiAgICBlbHNlXG4gICAgICBFdmVudEVtaXR0ZXIuY2FsbCBAXG4gICAge0BzdG9yYWdlUGF0aCwgQGNvbGxlY3Rpb25OYW1lLCBAZG93bmxvYWRSb3V0ZSwgQHNjaGVtYSwgQGNodW5rU2l6ZSwgQG5hbWluZ0Z1bmN0aW9uLCBAZGVidWcsIEBvbmJlZm9yZXVubG9hZE1lc3NhZ2UsIEBwZXJtaXNzaW9ucywgQGFsbG93Q2xpZW50Q29kZSwgQG9uQmVmb3JlVXBsb2FkLCBAaW50ZWdyaXR5Q2hlY2ssIEBwcm90ZWN0ZWQsIEBwdWJsaWMsIEBzdHJpY3QsIEBkb3dubG9hZENhbGxiYWNrLCBAY2FjaGVDb250cm9sLCBAdGhyb3R0bGUsIEBvbkFmdGVyVXBsb2FkLCBAaW50ZXJjZXB0RG93bmxvYWQsIEBvbkJlZm9yZVJlbW92ZX0gPSBjb25maWcgaWYgY29uZmlnXG5cbiAgICBzZWxmICAgICAgICAgICAgICAgPSBAXG4gICAgY29va2llICAgICAgICAgICAgID0gbmV3IENvb2tpZXMoKVxuICAgIEBkZWJ1ZyAgICAgICAgICAgID89IGZhbHNlXG4gICAgQHB1YmxpYyAgICAgICAgICAgPz0gZmFsc2VcbiAgICBAcHJvdGVjdGVkICAgICAgICA/PSBmYWxzZVxuICAgIEBjaHVua1NpemUgICAgICAgID89IDEwMjQqNTEyXG4gICAgQGNodW5rU2l6ZSAgICAgICAgID0gTWF0aC5mbG9vcihAY2h1bmtTaXplIC8gOCkgKiA4XG4gICAgaWYgQHB1YmxpYyBhbmQgbm90IEBkb3dubG9hZFJvdXRlXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJbRmlsZXNDb2xsZWN0aW9uLiN7QGNvbGxlY3Rpb25OYW1lfV06IFxcXCJkb3dubG9hZFJvdXRlXFxcIiBtdXN0IGJlIGV4cGxpY2l0bHkgcHJvdmlkZWQgb24gXFxcInB1YmxpY1xcXCIgY29sbGVjdGlvbnMhIE5vdGU6IFxcXCJkb3dubG9hZFJvdXRlXFxcIiBtdXN0IGJlIGVxdWFsIG9uIGJlIGluc2lkZSBvZiB5b3VyIHdlYi9wcm94eS1zZXJ2ZXIgKHJlbGF0aXZlKSByb290LlwiXG4gICAgQGRvd25sb2FkUm91dGUgICAgPz0gJy9jZG4vc3RvcmFnZSdcbiAgICBAZG93bmxvYWRSb3V0ZSAgICAgPSBAZG93bmxvYWRSb3V0ZS5yZXBsYWNlIC9cXC8kLywgJydcbiAgICBAY29sbGVjdGlvbk5hbWUgICA/PSAnTWV0ZW9yVXBsb2FkRmlsZXMnXG4gICAgQG5hbWluZ0Z1bmN0aW9uICAgPz0gLT4gUmFuZG9tLmlkKClcbiAgICBAb25CZWZvcmVVcGxvYWQgICA/PSBmYWxzZVxuICAgIEBhbGxvd0NsaWVudENvZGUgID89IHRydWVcbiAgICBAaW50ZXJjZXB0RG93bmxvYWQ/PSBmYWxzZVxuXG4gICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICBAb25iZWZvcmV1bmxvYWRNZXNzYWdlID89ICdVcGxvYWQgaW4gYSBwcm9ncmVzcy4uLiBEbyB5b3Ugd2FudCB0byBhYm9ydD8nXG4gICAgICBkZWxldGUgQHN0cmljdFxuICAgICAgZGVsZXRlIEB0aHJvdHRsZVxuICAgICAgZGVsZXRlIEBzdG9yYWdlUGF0aFxuICAgICAgZGVsZXRlIEBwZXJtaXNzaW9uc1xuICAgICAgZGVsZXRlIEBjYWNoZUNvbnRyb2xcbiAgICAgIGRlbGV0ZSBAb25BZnRlclVwbG9hZFxuICAgICAgZGVsZXRlIEBpbnRlZ3JpdHlDaGVja1xuICAgICAgZGVsZXRlIEBkb3dubG9hZENhbGxiYWNrXG4gICAgICBkZWxldGUgQGludGVyY2VwdERvd25sb2FkXG4gICAgICBkZWxldGUgQG9uQmVmb3JlUmVtb3ZlXG5cbiAgICAgIGlmIEBwcm90ZWN0ZWRcbiAgICAgICAgaWYgbm90IGNvb2tpZS5oYXMoJ21ldGVvcl9sb2dpbl90b2tlbicpIGFuZCBNZXRlb3IuX2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdNZXRlb3IubG9naW5Ub2tlbicpXG4gICAgICAgICAgY29va2llLnNldCAnbWV0ZW9yX2xvZ2luX3Rva2VuJywgTWV0ZW9yLl9sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnTWV0ZW9yLmxvZ2luVG9rZW4nKSwgbnVsbCwgJy8nXG5cbiAgICAgIGNoZWNrIEBvbmJlZm9yZXVubG9hZE1lc3NhZ2UsIE1hdGNoLk9uZU9mIFN0cmluZywgRnVuY3Rpb25cbiAgICBlbHNlXG4gICAgICBAX3dyaXRhYmxlU3RyZWFtcyA/PSB7fVxuICAgICAgQHN0cmljdCAgICAgICAgICAgPz0gdHJ1ZVxuICAgICAgQHRocm90dGxlICAgICAgICAgPz0gZmFsc2VcbiAgICAgIEBwZXJtaXNzaW9ucyAgICAgID89IHBhcnNlSW50KCc2NDQnLCA4KVxuICAgICAgQGNhY2hlQ29udHJvbCAgICAgPz0gJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCwgcy1tYXhhZ2U9MzE1MzYwMDAnXG4gICAgICBAb25CZWZvcmVSZW1vdmUgICA/PSBmYWxzZVxuICAgICAgQG9uQWZ0ZXJVcGxvYWQgICAgPz0gZmFsc2VcbiAgICAgIEBpbnRlZ3JpdHlDaGVjayAgID89IHRydWVcbiAgICAgIEBkb3dubG9hZENhbGxiYWNrID89IGZhbHNlXG4gICAgICBpZiBAcHVibGljIGFuZCBub3QgQHN0b3JhZ2VQYXRoXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIltGaWxlc0NvbGxlY3Rpb24uI3tAY29sbGVjdGlvbk5hbWV9XSBcXFwic3RvcmFnZVBhdGhcXFwiIG11c3QgYmUgc2V0IG9uIFxcXCJwdWJsaWNcXFwiIGNvbGxlY3Rpb25zISBOb3RlOiBcXFwic3RvcmFnZVBhdGhcXFwiIG11c3QgYmUgZXF1YWwgb24gYmUgaW5zaWRlIG9mIHlvdXIgd2ViL3Byb3h5LXNlcnZlciAoYWJzb2x1dGUpIHJvb3QuXCJcbiAgICAgIEBzdG9yYWdlUGF0aCAgICAgID89IFwiYXNzZXRzL2FwcC91cGxvYWRzLyN7QGNvbGxlY3Rpb25OYW1lfVwiXG4gICAgICBAc3RvcmFnZVBhdGggICAgICAgPSBAc3RvcmFnZVBhdGgucmVwbGFjZSAvXFwvJC8sICcnXG4gICAgICBAc3RvcmFnZVBhdGggICAgICAgPSBub2RlUGF0aC5ub3JtYWxpemUgQHN0b3JhZ2VQYXRoXG5cbiAgICAgIGZzLm1rZGlyc1N5bmMgQHN0b3JhZ2VQYXRoXG5cbiAgICAgIGNoZWNrIEBzdHJpY3QsIEJvb2xlYW5cbiAgICAgIGNoZWNrIEB0aHJvdHRsZSwgTWF0Y2guT25lT2YgZmFsc2UsIE51bWJlclxuICAgICAgY2hlY2sgQHBlcm1pc3Npb25zLCBOdW1iZXJcbiAgICAgIGNoZWNrIEBzdG9yYWdlUGF0aCwgU3RyaW5nXG4gICAgICBjaGVjayBAY2FjaGVDb250cm9sLCBTdHJpbmdcbiAgICAgIGNoZWNrIEBvbkFmdGVyVXBsb2FkLCBNYXRjaC5PbmVPZiBmYWxzZSwgRnVuY3Rpb25cbiAgICAgIGNoZWNrIEBpbnRlZ3JpdHlDaGVjaywgQm9vbGVhblxuICAgICAgY2hlY2sgQG9uQmVmb3JlUmVtb3ZlLCBNYXRjaC5PbmVPZiBmYWxzZSwgRnVuY3Rpb25cbiAgICAgIGNoZWNrIEBkb3dubG9hZENhbGxiYWNrLCBNYXRjaC5PbmVPZiBmYWxzZSwgRnVuY3Rpb25cbiAgICAgIGNoZWNrIEBpbnRlcmNlcHREb3dubG9hZCwgTWF0Y2guT25lT2YgZmFsc2UsIEZ1bmN0aW9uXG5cbiAgICBpZiBub3QgQHNjaGVtYVxuICAgICAgQHNjaGVtYSA9XG4gICAgICAgIHNpemU6IHR5cGU6IE51bWJlclxuICAgICAgICBuYW1lOiB0eXBlOiBTdHJpbmdcbiAgICAgICAgdHlwZTogdHlwZTogU3RyaW5nXG4gICAgICAgIHBhdGg6IHR5cGU6IFN0cmluZ1xuICAgICAgICBpc1ZpZGVvOiB0eXBlOiBCb29sZWFuXG4gICAgICAgIGlzQXVkaW86IHR5cGU6IEJvb2xlYW5cbiAgICAgICAgaXNJbWFnZTogdHlwZTogQm9vbGVhblxuICAgICAgICBpc1RleHQ6IHR5cGU6IEJvb2xlYW5cbiAgICAgICAgaXNKU09OOiB0eXBlOiBCb29sZWFuXG4gICAgICAgIF9wcmVmaXg6IHR5cGU6IFN0cmluZ1xuICAgICAgICBleHRlbnNpb246XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgX3N0b3JhZ2VQYXRoOiB0eXBlOiBTdHJpbmdcbiAgICAgICAgX2Rvd25sb2FkUm91dGU6IHR5cGU6IFN0cmluZ1xuICAgICAgICBfY29sbGVjdGlvbk5hbWU6IHR5cGU6IFN0cmluZ1xuICAgICAgICBwdWJsaWM6XG4gICAgICAgICAgdHlwZTogQm9vbGVhblxuICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIG1ldGE6XG4gICAgICAgICAgdHlwZTogT2JqZWN0XG4gICAgICAgICAgYmxhY2tib3g6IHRydWVcbiAgICAgICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgICB1c2VySWQ6XG4gICAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgdXBkYXRlZEF0OiBcbiAgICAgICAgICB0eXBlOiBEYXRlXG4gICAgICAgICAgYXV0b1ZhbHVlOiAtPiBuZXcgRGF0ZSgpXG4gICAgICAgIHZlcnNpb25zOlxuICAgICAgICAgIHR5cGU6IE9iamVjdFxuICAgICAgICAgIGJsYWNrYm94OiB0cnVlXG5cbiAgICBjaGVjayBAZGVidWcsIEJvb2xlYW5cbiAgICBjaGVjayBAc2NoZW1hLCBPYmplY3RcbiAgICBjaGVjayBAcHVibGljLCBCb29sZWFuXG4gICAgY2hlY2sgQHByb3RlY3RlZCwgTWF0Y2guT25lT2YgQm9vbGVhbiwgRnVuY3Rpb25cbiAgICBjaGVjayBAY2h1bmtTaXplLCBOdW1iZXJcbiAgICBjaGVjayBAZG93bmxvYWRSb3V0ZSwgU3RyaW5nXG4gICAgY2hlY2sgQGNvbGxlY3Rpb25OYW1lLCBTdHJpbmdcbiAgICBjaGVjayBAbmFtaW5nRnVuY3Rpb24sIEZ1bmN0aW9uXG4gICAgY2hlY2sgQG9uQmVmb3JlVXBsb2FkLCBNYXRjaC5PbmVPZiBmYWxzZSwgRnVuY3Rpb25cbiAgICBjaGVjayBAYWxsb3dDbGllbnRDb2RlLCBCb29sZWFuXG5cbiAgICBpZiBAcHVibGljIGFuZCBAcHJvdGVjdGVkXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJbRmlsZXNDb2xsZWN0aW9uLiN7QGNvbGxlY3Rpb25OYW1lfV06IEZpbGVzIGNhbiBub3QgYmUgcHVibGljIGFuZCBwcm90ZWN0ZWQgYXQgdGhlIHNhbWUgdGltZSFcIlxuICAgIFxuICAgIEBjdXJzb3IgICAgICA9IG51bGxcbiAgICBAc2VhcmNoICAgICAgPSB7fVxuICAgIEBjb2xsZWN0aW9uICA9IG5ldyBNb25nby5Db2xsZWN0aW9uIEBjb2xsZWN0aW9uTmFtZVxuICAgIEBjdXJyZW50RmlsZSA9IG51bGxcbiAgICBAX3ByZWZpeCAgICAgPSBTSEEyNTYgQGNvbGxlY3Rpb25OYW1lICsgQGRvd25sb2FkUm91dGVcbiAgICBfaW5zdHNbQF9wcmVmaXhdID0gQFxuXG4gICAgQGNoZWNrQWNjZXNzID0gKGh0dHApIC0+XG4gICAgICBpZiBzZWxmLnByb3RlY3RlZFxuICAgICAgICB1c2VyID0gZmFsc2VcbiAgICAgICAgdXNlckZ1bmNzID0gc2VsZi5nZXRVc2VyIGh0dHBcbiAgICAgICAge3VzZXIsIHVzZXJJZH0gPSB1c2VyRnVuY3NcbiAgICAgICAgdXNlciA9IHVzZXIoKVxuXG4gICAgICAgIGlmIF8uaXNGdW5jdGlvbiBzZWxmLnByb3RlY3RlZFxuICAgICAgICAgIHJlc3VsdCA9IGlmIGh0dHAgdGhlbiBzZWxmLnByb3RlY3RlZC5jYWxsKF8uZXh0ZW5kKGh0dHAsIHVzZXJGdW5jcyksIChzZWxmLmN1cnJlbnRGaWxlIG9yIG51bGwpKSBlbHNlIHNlbGYucHJvdGVjdGVkLmNhbGwgdXNlckZ1bmNzLCAoc2VsZi5jdXJyZW50RmlsZSBvciBudWxsKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVzdWx0ID0gISF1c2VyXG5cbiAgICAgICAgaWYgKGh0dHAgYW5kIHJlc3VsdCBpcyB0cnVlKSBvciBub3QgaHR0cFxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByYyA9IGlmIF8uaXNOdW1iZXIocmVzdWx0KSB0aGVuIHJlc3VsdCBlbHNlIDQwMVxuICAgICAgICAgIGNvbnNvbGUud2FybiAnW0ZpbGVzQ29sbGVjdGlvbi5jaGVja0FjY2Vzc10gV0FSTjogQWNjZXNzIGRlbmllZCEnIGlmIHNlbGYuZGVidWdcbiAgICAgICAgICBpZiBodHRwXG4gICAgICAgICAgICB0ZXh0ID0gJ0FjY2VzcyBkZW5pZWQhJ1xuICAgICAgICAgICAgaHR0cC5yZXNwb25zZS53cml0ZUhlYWQgcmMsXG4gICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IHRleHQubGVuZ3RoXG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAgICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgaHR0cC5yZXNwb25zZS5lbmQgdGV4dFxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgQG1ldGhvZE5hbWVzID1cbiAgICAgIE1ldGVvckZpbGVBYm9ydDogIFwiTWV0ZW9yRmlsZUFib3J0I3tAX3ByZWZpeH1cIlxuICAgICAgTWV0ZW9yRmlsZVdyaXRlOiAgXCJNZXRlb3JGaWxlV3JpdGUje0BfcHJlZml4fVwiXG4gICAgICBNZXRlb3JGaWxlVW5saW5rOiBcIk1ldGVvckZpbGVVbmxpbmsje0BfcHJlZml4fVwiXG5cbiAgICBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgIEBvbiAnaGFuZGxlVXBsb2FkJywgQGhhbmRsZVVwbG9hZFxuICAgICAgQG9uICdmaW5pc2hVcGxvYWQnLCBAZmluaXNoVXBsb2FkXG5cbiAgICAgIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlIChyZXF1ZXN0LCByZXNwb25zZSwgbmV4dCkgLT5cbiAgICAgICAgdW5sZXNzIHNlbGYucHVibGljXG4gICAgICAgICAgaWYgISF+cmVxdWVzdC5fcGFyc2VkVXJsLnBhdGguaW5kZXhPZiBcIiN7c2VsZi5kb3dubG9hZFJvdXRlfS8je3NlbGYuY29sbGVjdGlvbk5hbWV9XCJcbiAgICAgICAgICAgIHVyaSA9IHJlcXVlc3QuX3BhcnNlZFVybC5wYXRoLnJlcGxhY2UgXCIje3NlbGYuZG93bmxvYWRSb3V0ZX0vI3tzZWxmLmNvbGxlY3Rpb25OYW1lfVwiLCAnJ1xuICAgICAgICAgICAgaWYgdXJpLmluZGV4T2YoJy8nKSBpcyAwXG4gICAgICAgICAgICAgIHVyaSA9IHVyaS5zdWJzdHJpbmcgMVxuXG4gICAgICAgICAgICB1cmlzID0gdXJpLnNwbGl0ICcvJ1xuICAgICAgICAgICAgaWYgdXJpcy5sZW5ndGggaXMgM1xuICAgICAgICAgICAgICBwYXJhbXMgPSBcbiAgICAgICAgICAgICAgICBxdWVyeTogaWYgcmVxdWVzdC5fcGFyc2VkVXJsLnF1ZXJ5IHRoZW4gSlNPTi5wYXJzZSgne1wiJyArIGRlY29kZVVSSShyZXF1ZXN0Ll9wYXJzZWRVcmwucXVlcnkpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC8mL2csICdcIixcIicpLnJlcGxhY2UoLz0vZywnXCI6XCInKSArICdcIn0nKSBlbHNlIHt9XG4gICAgICAgICAgICAgICAgX2lkOiB1cmlzWzBdXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogdXJpc1sxXVxuICAgICAgICAgICAgICAgIG5hbWU6IHVyaXNbMl1cbiAgICAgICAgICAgICAgaHR0cCA9IHtyZXF1ZXN0LCByZXNwb25zZSwgcGFyYW1zfVxuICAgICAgICAgICAgICBzZWxmLmZpbmRPbmUodXJpc1swXSkuZG93bmxvYWQuY2FsbChzZWxmLCBodHRwLCB1cmlzWzFdKSBpZiBzZWxmLmNoZWNrQWNjZXNzIGh0dHBcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiAhIX5yZXF1ZXN0Ll9wYXJzZWRVcmwucGF0aC5pbmRleE9mIFwiI3tzZWxmLmRvd25sb2FkUm91dGV9XCJcbiAgICAgICAgICAgIHVyaSA9IHJlcXVlc3QuX3BhcnNlZFVybC5wYXRoLnJlcGxhY2UgXCIje3NlbGYuZG93bmxvYWRSb3V0ZX1cIiwgJydcbiAgICAgICAgICAgIGlmIHVyaS5pbmRleE9mKCcvJykgaXMgMFxuICAgICAgICAgICAgICB1cmkgPSB1cmkuc3Vic3RyaW5nIDFcblxuICAgICAgICAgICAgdXJpcyAgPSB1cmkuc3BsaXQgJy8nXG4gICAgICAgICAgICBfZmlsZSA9IHVyaXNbdXJpcy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgaWYgX2ZpbGVcbiAgICAgICAgICAgICAgaWYgISF+X2ZpbGUuaW5kZXhPZiAnLSdcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gX2ZpbGUuc3BsaXQoJy0nKVswXVxuICAgICAgICAgICAgICAgIF9maWxlICAgPSBfZmlsZS5zcGxpdCgnLScpWzFdLnNwbGl0KCc/JylbMF1cbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHZlcnNpb24gPSAnb3JpZ2luYWwnXG4gICAgICAgICAgICAgICAgX2ZpbGUgICA9IF9maWxlLnNwbGl0KCc/JylbMF1cblxuICAgICAgICAgICAgICBwYXJhbXMgPSBcbiAgICAgICAgICAgICAgICBxdWVyeTogaWYgcmVxdWVzdC5fcGFyc2VkVXJsLnF1ZXJ5IHRoZW4gSlNPTi5wYXJzZSgne1wiJyArIGRlY29kZVVSSShyZXF1ZXN0Ll9wYXJzZWRVcmwucXVlcnkpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC8mL2csICdcIixcIicpLnJlcGxhY2UoLz0vZywnXCI6XCInKSArICdcIn0nKSBlbHNlIHt9XG4gICAgICAgICAgICAgICAgZmlsZTogX2ZpbGVcbiAgICAgICAgICAgICAgICBfaWQ6IF9maWxlLnNwbGl0KCcuJylbMF1cbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uXG4gICAgICAgICAgICAgICAgbmFtZTogX2ZpbGVcbiAgICAgICAgICAgICAgaHR0cCA9IHtyZXF1ZXN0LCByZXNwb25zZSwgcGFyYW1zfVxuICAgICAgICAgICAgICBzZWxmLmZpbmRPbmUocGFyYW1zLl9pZCkuZG93bmxvYWQuY2FsbCBzZWxmLCBodHRwLCB2ZXJzaW9uXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIG5leHQoKVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIG5leHQoKVxuICAgICAgICByZXR1cm5cblxuICAgICAgX21ldGhvZHMgPSB7fVxuICAgICAgX21ldGhvZHNbc2VsZi5tZXRob2ROYW1lcy5NZXRlb3JGaWxlVW5saW5rXSA9IChpbnN0KSAtPlxuICAgICAgICBjaGVjayBpbnN0LCBPYmplY3RcbiAgICAgICAgY29uc29sZS5pbmZvICdbRmlsZXNDb2xsZWN0aW9uXSBbVW5saW5rIE1ldGhvZF0nIGlmIHNlbGYuZGVidWdcbiAgICAgICAgXG4gICAgICAgIGlmIHNlbGYuYWxsb3dDbGllbnRDb2RlXG4gICAgICAgICAgX19pbnN0RGF0YSA9IGNwIF9pbnN0c1tpbnN0Ll9wcmVmaXhdLCBpbnN0XG4gICAgICAgICAgaWYgc2VsZi5vbkJlZm9yZVJlbW92ZSBhbmQgXy5pc0Z1bmN0aW9uIHNlbGYub25CZWZvcmVSZW1vdmVcbiAgICAgICAgICAgIHVzZXIgPSBmYWxzZVxuICAgICAgICAgICAgdXNlckZ1bmNzID0ge1xuICAgICAgICAgICAgICB1c2VySWQ6IEB1c2VySWRcbiAgICAgICAgICAgICAgdXNlcjogLT4gaWYgTWV0ZW9yLnVzZXJzIHRoZW4gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoQHVzZXJJZCkgZWxzZSB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX19pbnN0ID0gc2VsZi5maW5kLmNhbGwgX19pbnN0RGF0YSwgaW5zdC5zZWFyY2hcbiAgICAgICAgICAgIHVubGVzcyBzZWxmLm9uQmVmb3JlUmVtb3ZlLmNhbGwgdXNlckZ1bmNzLCAoX19pbnN0LmN1cnNvciBvciBudWxsKVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMywgJ1tGaWxlc0NvbGxlY3Rpb25dIFtyZW1vdmVdIE5vdCBwZXJtaXR0ZWQhJ1xuXG4gICAgICAgICAgc2VsZi5yZW1vdmUuY2FsbCBfX2luc3REYXRhLCBpbnN0LnNlYXJjaFxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1tGaWxlc0NvbGxlY3Rpb25dIFtyZW1vdmVdIFJ1biBjb2RlIGZyb20gY2xpZW50IGlzIG5vdCBhbGxvd2VkISdcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIF9tZXRob2RzW3NlbGYubWV0aG9kTmFtZXMuTWV0ZW9yRmlsZVdyaXRlXSA9IChvcHRzKSAtPlxuICAgICAgICBAdW5ibG9jaygpXG4gICAgICAgIGNoZWNrIG9wdHMsIHtcbiAgICAgICAgICBlb2Y6ICAgICAgICBNYXRjaC5PcHRpb25hbCBCb29sZWFuXG4gICAgICAgICAgbWV0YTogICAgICAgTWF0Y2guT3B0aW9uYWwgT2JqZWN0XG4gICAgICAgICAgZmlsZTogICAgICAgT2JqZWN0XG4gICAgICAgICAgZmlsZUlkOiAgICAgU3RyaW5nXG4gICAgICAgICAgYmluRGF0YTogICAgTWF0Y2guT3B0aW9uYWwgU3RyaW5nXG4gICAgICAgICAgY2h1bmtJZDogICAgTWF0Y2guT3B0aW9uYWwgTnVtYmVyXG4gICAgICAgICAgY2h1bmtTaXplOiAgTnVtYmVyXG4gICAgICAgICAgZmlsZUxlbmd0aDogTnVtYmVyXG4gICAgICAgIH1cblxuICAgICAgICBvcHRzLmVvZiAgICAgPz0gZmFsc2VcbiAgICAgICAgb3B0cy5tZXRhICAgID89IHt9XG4gICAgICAgIG9wdHMuYmluRGF0YSA/PSAnRU9GJ1xuICAgICAgICBvcHRzLmNodW5rSWQgPz0gLTFcblxuICAgICAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbV3JpdGUgTWV0aG9kXSBHb3QgIyN7b3B0cy5jaHVua0lkfS8je29wdHMuZmlsZUxlbmd0aH0gY2h1bmtzLCBkc3Q6ICN7b3B0cy5maWxlLm5hbWUgb3Igb3B0cy5maWxlLmZpbGVOYW1lfVwiIGlmIHNlbGYuZGVidWdcblxuICAgICAgICBpZiBzZWxmLm9uQmVmb3JlVXBsb2FkIGFuZCBfLmlzRnVuY3Rpb24gc2VsZi5vbkJlZm9yZVVwbG9hZFxuICAgICAgICAgIGlzVXBsb2FkQWxsb3dlZCA9IHNlbGYub25CZWZvcmVVcGxvYWQuY2FsbChfLmV4dGVuZCh7XG4gICAgICAgICAgICBmaWxlOiBvcHRzLmZpbGVcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICB1c2VySWQ6IEB1c2VySWQsIFxuICAgICAgICAgICAgdXNlcjogLT4gaWYgTWV0ZW9yLnVzZXJzIHRoZW4gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoQHVzZXJJZCkgZWxzZSB1bmRlZmluZWRcbiAgICAgICAgICB9KSwgb3B0cy5maWxlKVxuXG4gICAgICAgICAgaWYgaXNVcGxvYWRBbGxvd2VkIGlzbnQgdHJ1ZVxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIGlmIF8uaXNTdHJpbmcoaXNVcGxvYWRBbGxvd2VkKSB0aGVuIGlzVXBsb2FkQWxsb3dlZCBlbHNlICdAb25CZWZvcmVVcGxvYWQoKSByZXR1cm5lZCBmYWxzZScpXG5cbiAgICAgICAgZmlsZU5hbWUgPSBzZWxmLmdldEZpbGVOYW1lIG9wdHMuZmlsZVxuICAgICAgICB7ZXh0ZW5zaW9uLCBleHRlbnNpb25XaXRoRG90fSA9IHNlbGYuZ2V0RXh0IGZpbGVOYW1lXG5cbiAgICAgICAgcmVzdWx0ICAgICAgICAgICA9IG9wdHMuZmlsZVxuICAgICAgICByZXN1bHQucGF0aCAgICAgID0gXCIje3NlbGYuc3RvcmFnZVBhdGh9LyN7b3B0cy5maWxlSWR9I3tleHRlbnNpb25XaXRoRG90fVwiXG4gICAgICAgIHJlc3VsdC5uYW1lICAgICAgPSBmaWxlTmFtZVxuICAgICAgICByZXN1bHQubWV0YSAgICAgID0gb3B0cy5tZXRhXG4gICAgICAgIHJlc3VsdC5leHRlbnNpb24gPSBleHRlbnNpb25cbiAgICAgICAgcmVzdWx0ICAgICAgICAgICA9IHNlbGYuZGF0YVRvU2NoZW1hIHJlc3VsdFxuICAgICAgICByZXN1bHQuX2lkICAgICAgID0gb3B0cy5maWxlSWRcbiAgICAgICAgcmVzdWx0LnVzZXJJZCAgICA9IEB1c2VySWQgaWYgQHVzZXJJZFxuXG4gICAgICAgIGlmIG9wdHMuZW9mXG4gICAgICAgICAgdHJ5XG4gICAgICAgICAgICByZXR1cm4gTWV0ZW9yLndyYXBBc3luYyhzZWxmLmhhbmRsZVVwbG9hZC5iaW5kKHNlbGYsIHJlc3VsdCwgb3B0cykpKClcbiAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gXCJbRmlsZXNDb2xsZWN0aW9uXSBbV3JpdGUgTWV0aG9kXSBFeGNlcHRpb246XCIsIGUgaWYgc2VsZi5kZWJ1Z1xuICAgICAgICAgICAgdGhyb3cgZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc2VsZi5lbWl0ICdoYW5kbGVVcGxvYWQnLCByZXN1bHQsIG9wdHMsIE5PT1BcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuXG4gICAgICBfbWV0aG9kc1tzZWxmLm1ldGhvZE5hbWVzLk1ldGVvckZpbGVBYm9ydF0gPSAob3B0cykgLT5cbiAgICAgICAgY2hlY2sgb3B0cywge1xuICAgICAgICAgIGZpbGVJZDogU3RyaW5nXG4gICAgICAgICAgZmlsZURhdGE6IE9iamVjdFxuICAgICAgICAgIGZpbGVMZW5ndGg6IE51bWJlclxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ICA9IFwiLiN7b3B0cy5maWxlRGF0YS5leHR9XCJcbiAgICAgICAgcGF0aCA9IFwiI3tzZWxmLnN0b3JhZ2VQYXRofS8je29wdHMuZmlsZUlkfSN7ZXh0fVwiXG5cbiAgICAgICAgY29uc29sZS5pbmZvIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW0Fib3J0IE1ldGhvZF06IEZvciAje3BhdGh9XCIgaWYgc2VsZi5kZWJ1Z1xuICAgICAgICBpZiBzZWxmLl93cml0YWJsZVN0cmVhbXM/W29wdHMuZmlsZUlkXVxuICAgICAgICAgIHNlbGYuX3dyaXRhYmxlU3RyZWFtc1tvcHRzLmZpbGVJZF0uc3RyZWFtLmVuZCgpXG4gICAgICAgICAgZGVsZXRlIHNlbGYuX3dyaXRhYmxlU3RyZWFtc1tvcHRzLmZpbGVJZF1cbiAgICAgICAgICBzZWxmLnJlbW92ZSh7X2lkOiBvcHRzLmZpbGVJZH0pXG4gICAgICAgICAgc2VsZi51bmxpbmsoe19pZDogb3B0cy5maWxlSWQsIHBhdGh9KVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICBNZXRlb3IubWV0aG9kcyBfbWV0aG9kc1xuXG4gICMjI1xuICBAbG9jdXMgU2VydmVyXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgZmluaXNoVXBsb2FkXG4gIEBzdW1tYXJ5IEludGVybmFsIG1ldGhvZC4gRmluaXNoIHVwbG9hZCwgY2xvc2UgV3JpdGFibGUgc3RyZWFtLCBhZGQgcmVjb3JlZCB0byBNb25nb0RCIGFuZCBmbHVzaCB1c2VkIG1lbW9yeVxuICBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgZmluaXNoVXBsb2FkOiBpZiBNZXRlb3IuaXNTZXJ2ZXIgdGhlbiAocmVzdWx0LCBvcHRzLCBjYikgLT5cbiAgICBmcy5jaG1vZCByZXN1bHQucGF0aCwgQHBlcm1pc3Npb25zLCBOT09QXG4gICAgc2VsZiAgICAgICAgICA9IEBcbiAgICByZXN1bHQudHlwZSAgID0gQGdldE1pbWVUeXBlIG9wdHMuZmlsZVxuICAgIHJlc3VsdC5wdWJsaWMgPSBAcHVibGljXG5cbiAgICBAY29sbGVjdGlvbi5pbnNlcnQgXy5jbG9uZShyZXN1bHQpLCAoZXJyb3IsIF9pZCkgLT5cbiAgICAgIGlmIGVycm9yXG4gICAgICAgIGNiIG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBlcnJvclxuICAgICAgZWxzZVxuICAgICAgICByZXN1bHQuX2lkID0gX2lkXG4gICAgICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFtXcml0ZSBNZXRob2RdIFtmaW5pc2hVcGxvYWRdIC0+ICN7cmVzdWx0LnBhdGh9XCIgaWYgc2VsZi5kZWJ1Z1xuICAgICAgICBzZWxmLm9uQWZ0ZXJVcGxvYWQgYW5kIHNlbGYub25BZnRlclVwbG9hZC5jYWxsIHNlbGYsIHJlc3VsdFxuICAgICAgICBzZWxmLmVtaXQgJ2FmdGVyVXBsb2FkJywgcmVzdWx0XG4gICAgICAgIGNiIG51bGwsIHJlc3VsdFxuICAgIHJldHVyblxuICBlbHNlIHVuZGVmaW5lZFxuXG4gICMjI1xuICBAbG9jdXMgU2VydmVyXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgaGFuZGxlVXBsb2FkXG4gIEBzdW1tYXJ5IEludGVybmFsIG1ldGhvZCB0byBoYW5kbGUgdXBsb2FkIHByb2Nlc3MsIHBpcGUgaW5jb21pbmcgZGF0YSB0byBXcml0YWJsZSBzdHJlYW1cbiAgQHJldHVybnMge3VuZGVmaW5lZH1cbiAgIyMjXG4gIGhhbmRsZVVwbG9hZDogaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gKHJlc3VsdCwgb3B0cywgY2IpIC0+XG4gICAgc2VsZiA9IEBcbiAgICBpZiBvcHRzLmVvZlxuICAgICAgYmluYXJ5ID0gb3B0cy5iaW5EYXRhXG4gICAgZWxzZVxuICAgICAgYmluYXJ5ID0gbmV3IEJ1ZmZlciBvcHRzLmJpbkRhdGEsICdiYXNlNjQnXG5cbiAgICB0cnlcbiAgICAgIGlmIG9wdHMuZW9mXG4gICAgICAgIF9obEVuZCA9IC0+XG4gICAgICAgICAgc2VsZi5fd3JpdGFibGVTdHJlYW1zW3Jlc3VsdC5faWRdLnN0cmVhbS5lbmQoKVxuICAgICAgICAgIGRlbGV0ZSBzZWxmLl93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF1cbiAgICAgICAgICBzZWxmLmVtaXQgJ2ZpbmlzaFVwbG9hZCcsIHJlc3VsdCwgb3B0cywgY2JcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiBAX3dyaXRhYmxlU3RyZWFtc1tyZXN1bHQuX2lkXS5kZWxheWVkP1tvcHRzLmZpbGVMZW5ndGhdXG4gICAgICAgICAgQF93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF0uc3RyZWFtLndyaXRlIEBfd3JpdGFibGVTdHJlYW1zW3Jlc3VsdC5faWRdLmRlbGF5ZWRbb3B0cy5maWxlTGVuZ3RoXSwgKCkgLT4gYm91bmQgLT5cbiAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF0uZGVsYXllZFtvcHRzLmZpbGVMZW5ndGhdXG4gICAgICAgICAgICBfaGxFbmQoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBfaGxFbmQoKVxuICAgICAgICBcbiAgICAgIGVsc2UgaWYgb3B0cy5jaHVua0lkID4gMFxuICAgICAgICBAX3dyaXRhYmxlU3RyZWFtc1tyZXN1bHQuX2lkXSA/PVxuICAgICAgICAgIHN0cmVhbTogZnMuY3JlYXRlV3JpdGVTdHJlYW0gcmVzdWx0LnBhdGgsIHtmbGFnczogJ2EnLCBtb2RlOiBAcGVybWlzc2lvbnN9XG4gICAgICAgICAgZGVsYXllZDoge31cblxuICAgICAgICBfZEtleXMgPSBPYmplY3Qua2V5cyBAX3dyaXRhYmxlU3RyZWFtc1tyZXN1bHQuX2lkXS5kZWxheWVkXG4gICAgICAgIGlmIF9kS2V5cy5sZW5ndGhcbiAgICAgICAgICBfLmVhY2ggQF93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF0uZGVsYXllZCwgKGRlbGF5ZWQsIG51bSkgLT4gYm91bmQgLT5cbiAgICAgICAgICAgIGlmIG51bSA8IG9wdHMuY2h1bmtJZFxuICAgICAgICAgICAgICBzZWxmLl93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF0uc3RyZWFtLndyaXRlIGRlbGF5ZWRcbiAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX3dyaXRhYmxlU3RyZWFtc1tyZXN1bHQuX2lkXS5kZWxheWVkW251bV1cbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHN0YXJ0ID0gb3B0cy5jaHVua1NpemUgKiAob3B0cy5jaHVua0lkIC0gMSlcbiAgICAgICAgaWYgQF93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF0uc3RyZWFtLmJ5dGVzV3JpdHRlbiA8IHN0YXJ0XG4gICAgICAgICAgQF93cml0YWJsZVN0cmVhbXNbcmVzdWx0Ll9pZF0uZGVsYXllZFtvcHRzLmNodW5rSWRdID0gYmluYXJ5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAX3dyaXRhYmxlU3RyZWFtc1tyZXN1bHQuX2lkXS5zdHJlYW0ud3JpdGUgYmluYXJ5XG4gICAgY2F0Y2ggZVxuICAgICAgY2IgZVxuICAgIHJldHVyblxuICBlbHNlIHVuZGVmaW5lZFxuXG4gICMjI1xuICBAbG9jdXMgQW55d2hlcmVcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBnZXRNaW1lVHlwZVxuICBAcGFyYW0ge09iamVjdH0gZmlsZURhdGEgLSBGaWxlIE9iamVjdFxuICBAc3VtbWFyeSBSZXR1cm5zIGZpbGUncyBtaW1lLXR5cGVcbiAgQHJldHVybnMge1N0cmluZ31cbiAgIyMjXG4gIGdldE1pbWVUeXBlOiAoZmlsZURhdGEpIC0+XG4gICAgY2hlY2sgZmlsZURhdGEsIE9iamVjdFxuICAgIG1pbWUgPSBmaWxlRGF0YS50eXBlIGlmIGZpbGVEYXRhPy50eXBlXG4gICAgaWYgTWV0ZW9yLmlzU2VydmVyIGFuZCBmaWxlRGF0YS5wYXRoIGFuZCAobm90IG1pbWUgb3Igbm90IF8uaXNTdHJpbmcgbWltZSlcbiAgICAgIHRyeVxuICAgICAgICBidWYgPSBuZXcgQnVmZmVyIDI2MlxuICAgICAgICBmZCAgPSBmcy5vcGVuU3luYyBmaWxlRGF0YS5wYXRoLCAncidcbiAgICAgICAgYnIgID0gZnMucmVhZFN5bmMgZmQsIGJ1ZiwgMCwgMjYyLCAwXG4gICAgICAgIGZzLmNsb3NlIGZkLCBOT09QXG4gICAgICAgIGJ1ZiA9IGJ1Zi5zbGljZSAwLCBiciBpZiBiciA8IDI2MlxuICAgICAgICB7bWltZSwgZXh0fSA9IGZpbGVUeXBlIGJ1ZlxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICBpZiBub3QgbWltZSBvciBub3QgXy5pc1N0cmluZyBtaW1lXG4gICAgICBtaW1lID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgXG4gICAgcmV0dXJuIG1pbWVcblxuICAjIyNcbiAgQGxvY3VzIEFueXdoZXJlXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgZ2V0RmlsZU5hbWVcbiAgQHBhcmFtIHtPYmplY3R9IGZpbGVEYXRhIC0gRmlsZSBPYmplY3RcbiAgQHN1bW1hcnkgUmV0dXJucyBmaWxlJ3MgbmFtZVxuICBAcmV0dXJucyB7U3RyaW5nfVxuICAjIyNcbiAgZ2V0RmlsZU5hbWU6IChmaWxlRGF0YSkgLT5cbiAgICBmaWxlTmFtZSA9IGZpbGVEYXRhLm5hbWUgb3IgZmlsZURhdGEuZmlsZU5hbWVcbiAgICBpZiBfLmlzU3RyaW5nKGZpbGVOYW1lKSBhbmQgZmlsZU5hbWUubGVuZ3RoID4gMFxuICAgICAgY2xlYW5OYW1lID0gKHN0cikgLT4gc3RyLnJlcGxhY2UoL1xcLlxcLi9nLCAnJykucmVwbGFjZSAvXFwvL2csICcnXG4gICAgICByZXR1cm4gY2xlYW5OYW1lKGZpbGVEYXRhLm5hbWUgb3IgZmlsZURhdGEuZmlsZU5hbWUpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICcnXG5cbiAgIyMjXG4gIEBsb2N1cyBBbnl3aGVyZVxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGdldFVzZXJcbiAgQHN1bW1hcnkgUmV0dXJucyBvYmplY3Qgd2l0aCBgdXNlcklkYCBhbmQgYHVzZXIoKWAgbWV0aG9kIHdoaWNoIHJldHVybiB1c2VyJ3Mgb2JqZWN0XG4gIEByZXR1cm5zIHtPYmplY3R9XG4gICMjI1xuICBnZXRVc2VyOiAoaHR0cCkgLT5cbiAgICByZXN1bHQgPSBcbiAgICAgIHVzZXI6IC0+IHJldHVybiBudWxsXG4gICAgICB1c2VySWQ6IG51bGxcbiAgICAgIFxuICAgIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgaWYgaHR0cFxuICAgICAgICBjb29raWUgPSBodHRwLnJlcXVlc3QuQ29va2llc1xuICAgICAgICBpZiBfLmhhcyhQYWNrYWdlLCAnYWNjb3VudHMtYmFzZScpIGFuZCBjb29raWUuaGFzICdtZXRlb3JfbG9naW5fdG9rZW4nXG4gICAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lICdzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW4nOiBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4gY29va2llLmdldCAnbWV0ZW9yX2xvZ2luX3Rva2VuJ1xuICAgICAgICAgIGlmIHVzZXJcbiAgICAgICAgICAgIHJlc3VsdC51c2VyID0gKCkgLT4gcmV0dXJuIHVzZXJcbiAgICAgICAgICAgIHJlc3VsdC51c2VySWQgPSB1c2VyLl9pZFxuICAgIGVsc2VcbiAgICAgIGlmIF8uaGFzKFBhY2thZ2UsICdhY2NvdW50cy1iYXNlJykgYW5kIE1ldGVvci51c2VySWQoKVxuICAgICAgICByZXN1bHQudXNlciA9IC0+IHJldHVybiBNZXRlb3IudXNlcigpXG4gICAgICAgIHJlc3VsdC51c2VySWQgPSBNZXRlb3IudXNlcklkKClcbiAgICByZXR1cm4gcmVzdWx0XG5cbiAgIyMjXG4gIEBsb2N1cyBBbnl3aGVyZVxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGdldEV4dFxuICBAcGFyYW0ge1N0cmluZ30gRmlsZU5hbWUgLSBGaWxlIG5hbWVcbiAgQHN1bW1hcnkgR2V0IGV4dGVuc2lvbiBmcm9tIEZpbGVOYW1lXG4gIEByZXR1cm5zIHtPYmplY3R9XG4gICMjI1xuICBnZXRFeHQ6IChmaWxlTmFtZSkgLT5cbiAgICBpZiAhIX5maWxlTmFtZS5pbmRleE9mKCcuJylcbiAgICAgIGV4dGVuc2lvbiA9IGZpbGVOYW1lLnNwbGl0KCcuJykucG9wKClcbiAgICAgIHJldHVybiB7IGV4dDogZXh0ZW5zaW9uLCBleHRlbnNpb24sIGV4dGVuc2lvbldpdGhEb3Q6ICcuJyArIGV4dGVuc2lvbiB9XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHsgZXh0OiAnJywgZXh0ZW5zaW9uOiAnJywgZXh0ZW5zaW9uV2l0aERvdDogJycgfVxuXG4gICMjI1xuICBAbG9jdXMgQW55d2hlcmVcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBkYXRhVG9TY2hlbWFcbiAgQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBGaWxlIGRhdGFcbiAgQHN1bW1hcnkgQnVpbGQgb2JqZWN0IGluIGFjY29yZGFuY2Ugd2l0aCBzY2hlbWEgZnJvbSBGaWxlIGRhdGFcbiAgQHJldHVybnMge09iamVjdH1cbiAgIyMjXG4gIGRhdGFUb1NjaGVtYTogKGRhdGEpIC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICAgICAgIGRhdGEubmFtZVxuICAgICAgZXh0ZW5zaW9uOiAgZGF0YS5leHRlbnNpb25cbiAgICAgIHBhdGg6ICAgICAgIGRhdGEucGF0aFxuICAgICAgbWV0YTogICAgICAgZGF0YS5tZXRhXG4gICAgICB0eXBlOiAgICAgICBkYXRhLnR5cGVcbiAgICAgIHNpemU6ICAgICAgIGRhdGEuc2l6ZVxuICAgICAgdmVyc2lvbnM6XG4gICAgICAgIG9yaWdpbmFsOlxuICAgICAgICAgIHBhdGg6IGRhdGEucGF0aFxuICAgICAgICAgIHNpemU6IGRhdGEuc2l6ZVxuICAgICAgICAgIHR5cGU6IGRhdGEudHlwZVxuICAgICAgICAgIGV4dGVuc2lvbjogZGF0YS5leHRlbnNpb25cbiAgICAgIGlzVmlkZW86ICEhfmRhdGEudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3ZpZGVvJylcbiAgICAgIGlzQXVkaW86ICEhfmRhdGEudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2F1ZGlvJylcbiAgICAgIGlzSW1hZ2U6ICEhfmRhdGEudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ltYWdlJylcbiAgICAgIGlzVGV4dDogICEhfmRhdGEudHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3RleHQnKVxuICAgICAgaXNKU09OOiAgISF+ZGF0YS50eXBlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignanNvbicpXG4gICAgICBfcHJlZml4OiBkYXRhLl9wcmVmaXggb3IgQF9wcmVmaXhcbiAgICAgIF9zdG9yYWdlUGF0aDogICAgZGF0YS5fc3RvcmFnZVBhdGggb3IgQHN0b3JhZ2VQYXRoXG4gICAgICBfZG93bmxvYWRSb3V0ZTogIGRhdGEuX2Rvd25sb2FkUm91dGUgb3IgQGRvd25sb2FkUm91dGVcbiAgICAgIF9jb2xsZWN0aW9uTmFtZTogZGF0YS5fY29sbGVjdGlvbk5hbWUgb3IgQGNvbGxlY3Rpb25OYW1lXG4gICAgfVxuXG4gICMjI1xuICBAbG9jdXMgQW55d2hlcmVcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBzcmNoXG4gIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gc2VhcmNoIC0gU2VhcmNoIGRhdGFcbiAgQHN1bW1hcnkgQnVpbGQgc2VhcmNoIG9iamVjdFxuICBAcmV0dXJucyB7T2JqZWN0fVxuICAjIyNcbiAgc3JjaDogKHNlYXJjaCkgLT5cbiAgICBpZiBzZWFyY2ggYW5kIF8uaXNTdHJpbmcgc2VhcmNoXG4gICAgICBAc2VhcmNoID1cbiAgICAgICAgX2lkOiBzZWFyY2hcbiAgICBlbHNlXG4gICAgICBAc2VhcmNoID0gc2VhcmNoIG9yIHt9XG4gICAgQHNlYXJjaFxuXG4gICMjI1xuICBAbG9jdXMgU2VydmVyXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgd3JpdGVcbiAgQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciAtIEJpbmFyeSBGaWxlJ3MgQnVmZmVyXG4gIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0ge2ZpbGVOYW1lOiAnJywgdHlwZTogJycsIHNpemU6IDAsIG1ldGE6IHsuLi59fVxuICBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIGZ1bmN0aW9uKGVycm9yLCBmaWxlT2JqKXsuLi59XG4gIEBzdW1tYXJ5IFdyaXRlIGJ1ZmZlciB0byBGUyBhbmQgYWRkIHRvIEZpbGVzQ29sbGVjdGlvbiBDb2xsZWN0aW9uXG4gIEByZXR1cm5zIHtGaWxlc0NvbGxlY3Rpb259IEluc3RhbmNlXG4gICMjI1xuICB3cml0ZTogaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gKGJ1ZmZlciwgb3B0cyA9IHt9LCBjYWxsYmFjaykgLT5cbiAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbd3JpdGUoKV1cIiBpZiBAZGVidWdcbiAgICBjaGVjayBvcHRzLCBNYXRjaC5PcHRpb25hbCBPYmplY3RcbiAgICBjaGVjayBjYWxsYmFjaywgTWF0Y2guT3B0aW9uYWwgRnVuY3Rpb25cblxuICAgIGlmIEBjaGVja0FjY2VzcygpXG4gICAgICByYW5kRmlsZU5hbWUgID0gQG5hbWluZ0Z1bmN0aW9uKClcbiAgICAgIGZpbGVOYW1lICAgICAgPSBpZiBvcHRzLm5hbWUgb3Igb3B0cy5maWxlTmFtZSB0aGVuIG9wdHMubmFtZSBvciBvcHRzLmZpbGVOYW1lIGVsc2UgcmFuZEZpbGVOYW1lXG5cbiAgICAgIHtleHRlbnNpb24sIGV4dGVuc2lvbldpdGhEb3R9ID0gQGdldEV4dCBmaWxlTmFtZVxuXG4gICAgICBwYXRoICAgICAgPSBcIiN7QHN0b3JhZ2VQYXRofS8je3JhbmRGaWxlTmFtZX0je2V4dGVuc2lvbldpdGhEb3R9XCJcbiAgICAgIFxuICAgICAgb3B0cy50eXBlID0gQGdldE1pbWVUeXBlIG9wdHNcbiAgICAgIG9wdHMubWV0YSA9IHt9IGlmIG5vdCBvcHRzLm1ldGFcbiAgICAgIG9wdHMuc2l6ZSA9IGJ1ZmZlci5sZW5ndGggaWYgbm90IG9wdHMuc2l6ZVxuXG4gICAgICByZXN1bHQgICAgPSBAZGF0YVRvU2NoZW1hXG4gICAgICAgIG5hbWU6ICAgICAgZmlsZU5hbWVcbiAgICAgICAgcGF0aDogICAgICBwYXRoXG4gICAgICAgIG1ldGE6ICAgICAgb3B0cy5tZXRhXG4gICAgICAgIHR5cGU6ICAgICAgb3B0cy50eXBlXG4gICAgICAgIHNpemU6ICAgICAgb3B0cy5zaXplXG4gICAgICAgIGV4dGVuc2lvbjogZXh0ZW5zaW9uXG5cbiAgICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFt3cml0ZV06ICN7ZmlsZU5hbWV9IC0+ICN7QGNvbGxlY3Rpb25OYW1lfVwiIGlmIEBkZWJ1Z1xuXG4gICAgICBmcy5vdXRwdXRGaWxlIHBhdGgsIGJ1ZmZlciwgJ2JpbmFyeScsIChlcnJvcikgLT4gYm91bmQgLT5cbiAgICAgICAgaWYgZXJyb3JcbiAgICAgICAgICBjYWxsYmFjayBhbmQgY2FsbGJhY2sgZXJyb3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlc3VsdC5faWQgPSBAY29sbGVjdGlvbi5pbnNlcnQgXy5jbG9uZSByZXN1bHRcbiAgICAgICAgICBjYWxsYmFjayBhbmQgY2FsbGJhY2sgbnVsbCwgcmVzdWx0XG4gICAgICBcbiAgICAgIHJldHVybiBAXG4gIGVsc2VcbiAgICB1bmRlZmluZWRcblxuICAjIyNcbiAgQGxvY3VzIFNlcnZlclxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGxvYWRcbiAgQHBhcmFtIHtTdHJpbmd9IHVybCAtIFVSTCB0byBmaWxlXG4gIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0ge2ZpbGVOYW1lOiAnJywgbWV0YTogey4uLn19XG4gIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gZnVuY3Rpb24oZXJyb3IsIGZpbGVPYmopey4uLn1cbiAgQHN1bW1hcnkgRG93bmxvYWQgZmlsZSwgd3JpdGUgc3RyZWFtIHRvIEZTIGFuZCBhZGQgdG8gRmlsZXNDb2xsZWN0aW9uIENvbGxlY3Rpb25cbiAgQHJldHVybnMge0ZpbGVzQ29sbGVjdGlvbn0gSW5zdGFuY2VcbiAgIyMjXG4gIGxvYWQ6IGlmIE1ldGVvci5pc1NlcnZlciB0aGVuICh1cmwsIG9wdHMgPSB7fSwgY2FsbGJhY2spIC0+XG4gICAgY29uc29sZS5pbmZvIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2xvYWQoI3t1cmx9LCAje0pTT04uc3RyaW5naWZ5KG9wdHMpfSwgY2FsbGJhY2spXVwiIGlmIEBkZWJ1Z1xuICAgIGNoZWNrIHVybCwgU3RyaW5nXG4gICAgY2hlY2sgb3B0cywgTWF0Y2guT3B0aW9uYWwgT2JqZWN0XG4gICAgY2hlY2sgY2FsbGJhY2ssIE1hdGNoLk9wdGlvbmFsIEZ1bmN0aW9uXG5cbiAgICBzZWxmICAgICAgICAgID0gQFxuICAgIHJhbmRGaWxlTmFtZSA9IEBuYW1pbmdGdW5jdGlvbigpXG4gICAgZmlsZU5hbWUgICAgID0gaWYgb3B0cy5uYW1lIG9yIG9wdHMuZmlsZU5hbWUgdGhlbiBvcHRzLm5hbWUgb3Igb3B0cy5maWxlTmFtZSBlbHNlIHJhbmRGaWxlTmFtZVxuICAgIFxuICAgIHtleHRlbnNpb24sIGV4dGVuc2lvbldpdGhEb3R9ID0gQGdldEV4dCBmaWxlTmFtZVxuICAgIHBhdGggICAgICA9IFwiI3tAc3RvcmFnZVBhdGh9LyN7cmFuZEZpbGVOYW1lfSN7ZXh0ZW5zaW9uV2l0aERvdH1cIlxuICAgIG9wdHMubWV0YSA9IHt9IGlmIG5vdCBvcHRzLm1ldGFcblxuICAgIHJlcXVlc3QuZ2V0KHVybCkub24oJ2Vycm9yJywgKGVycm9yKS0+IGJvdW5kIC0+XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yIDUwMCwgXCJFcnJvciBvbiBbbG9hZCgje3VybH0pXTpcIiArIEpTT04uc3RyaW5naWZ5IGVycm9yXG4gICAgKS5vbigncmVzcG9uc2UnLCAocmVzcG9uc2UpIC0+IGJvdW5kIC0+XG5cbiAgICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFtsb2FkXSBSZWNlaXZlZDogI3t1cmx9XCIgaWYgc2VsZi5kZWJ1Z1xuXG4gICAgICByZXN1bHQgPSBzZWxmLmRhdGFUb1NjaGVtYVxuICAgICAgICBuYW1lOiAgICAgIGZpbGVOYW1lXG4gICAgICAgIHBhdGg6ICAgICAgcGF0aFxuICAgICAgICBtZXRhOiAgICAgIG9wdHMubWV0YVxuICAgICAgICB0eXBlOiAgICAgIG9wdHMudHlwZSBvciByZXNwb25zZS5oZWFkZXJzWydjb250ZW50LXR5cGUnXVxuICAgICAgICBzaXplOiAgICAgIG9wdHMuc2l6ZSBvciByZXNwb25zZS5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddXG4gICAgICAgIGV4dGVuc2lvbjogZXh0ZW5zaW9uXG5cbiAgICAgIHNlbGYuY29sbGVjdGlvbi5pbnNlcnQgXy5jbG9uZShyZXN1bHQpLCAoZXJyb3IsIGZpbGVSZWYpIC0+XG4gICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgY29uc29sZS53YXJuIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2xvYWRdIFtpbnNlcnRdIEVycm9yOiAje2ZpbGVOYW1lfSAtPiAje3NlbGYuY29sbGVjdGlvbk5hbWV9XCIsIGVycm9yIGlmIHNlbGYuZGVidWdcbiAgICAgICAgICBjYWxsYmFjayBhbmQgY2FsbGJhY2sgZXJyb3JcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFtsb2FkXSBbaW5zZXJ0XSAje2ZpbGVOYW1lfSAtPiAje3NlbGYuY29sbGVjdGlvbk5hbWV9XCIgaWYgc2VsZi5kZWJ1Z1xuICAgICAgICAgIGNhbGxiYWNrIGFuZCBjYWxsYmFjayBudWxsLCBmaWxlUmVmXG4gICAgKS5waXBlIGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHBhdGgsIHtmbGFnczogJ3cnfSlcblxuICAgIHJldHVybiBAXG4gIGVsc2VcbiAgICB1bmRlZmluZWRcblxuICAjIyNcbiAgQGxvY3VzIFNlcnZlclxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGFkZEZpbGVcbiAgQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBQYXRoIHRvIGZpbGVcbiAgQHBhcmFtIHtTdHJpbmd9IHBhdGggLSBQYXRoIHRvIGZpbGVcbiAgQHN1bW1hcnkgQWRkIGZpbGUgZnJvbSBGUyB0byBGaWxlc0NvbGxlY3Rpb25cbiAgQHJldHVybnMge0ZpbGVzQ29sbGVjdGlvbn0gSW5zdGFuY2VcbiAgIyMjXG4gIGFkZEZpbGU6IGlmIE1ldGVvci5pc1NlcnZlciB0aGVuIChwYXRoLCBvcHRzID0ge30sIGNhbGxiYWNrKSAtPlxuICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFthZGRGaWxlKCN7cGF0aH0pXVwiIGlmIEBkZWJ1Z1xuXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDMsICdDYW4gbm90IHJ1biBbYWRkRmlsZV0gb24gcHVibGljIGNvbGxlY3Rpb24hIEp1c3QgTW92ZSBmaWxlIHRvIHJvb3Qgb2YgeW91ciBzZXJ2ZXIsIHRoZW4gYWRkIHJlY29yZCB0byBDb2xsZWN0aW9uJyBpZiBAcHVibGljXG4gICAgY2hlY2sgcGF0aCwgU3RyaW5nXG4gICAgY2hlY2sgb3B0cywgTWF0Y2guT3B0aW9uYWwgT2JqZWN0XG4gICAgY2hlY2sgY2FsbGJhY2ssIE1hdGNoLk9wdGlvbmFsIEZ1bmN0aW9uXG5cbiAgICBzZWxmID0gQFxuICAgIGZzLnN0YXQgcGF0aCwgKGVycm9yLCBzdGF0cykgLT4gYm91bmQgLT5cbiAgICAgIGlmIGVycm9yXG4gICAgICAgIGNhbGxiYWNrIGFuZCBjYWxsYmFjayBlcnJvclxuICAgICAgZWxzZSBpZiBzdGF0cy5pc0ZpbGUoKVxuICAgICAgICBwYXRoUGFydHMgPSBwYXRoLnNwbGl0ICcvJ1xuICAgICAgICBmaWxlTmFtZSAgPSBwYXRoUGFydHNbcGF0aFBhcnRzLmxlbmd0aCAtIDFdXG5cbiAgICAgICAge2V4dGVuc2lvbiwgZXh0ZW5zaW9uV2l0aERvdH0gPSBzZWxmLmdldEV4dCBmaWxlTmFtZVxuXG4gICAgICAgIG9wdHMudHlwZSA9ICdhcHBsaWNhdGlvbi8qJyBpZiBub3Qgb3B0cy50eXBlXG4gICAgICAgIG9wdHMubWV0YSA9IHt9IGlmIG5vdCBvcHRzLm1ldGFcbiAgICAgICAgb3B0cy5zaXplID0gc3RhdHMuc2l6ZSBpZiBub3Qgb3B0cy5zaXplXG5cbiAgICAgICAgcmVzdWx0ID0gc2VsZi5kYXRhVG9TY2hlbWFcbiAgICAgICAgICBuYW1lOiAgICAgICAgIGZpbGVOYW1lXG4gICAgICAgICAgcGF0aDogICAgICAgICBwYXRoXG4gICAgICAgICAgbWV0YTogICAgICAgICBvcHRzLm1ldGFcbiAgICAgICAgICB0eXBlOiAgICAgICAgIG9wdHMudHlwZVxuICAgICAgICAgIHNpemU6ICAgICAgICAgb3B0cy5zaXplXG4gICAgICAgICAgZXh0ZW5zaW9uOiAgICBleHRlbnNpb25cbiAgICAgICAgICBfc3RvcmFnZVBhdGg6IHBhdGgucmVwbGFjZSBcIi8je2ZpbGVOYW1lfVwiLCAnJ1xuXG4gICAgICAgIF9jbiA9IHNlbGYuY29sbGVjdGlvbk5hbWVcbiAgICAgICAgc2VsZi5jb2xsZWN0aW9uLmluc2VydCBfLmNsb25lKHJlc3VsdCksIChlcnJvciwgcmVjb3JkKSAtPlxuICAgICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gXCJbRmlsZXNDb2xsZWN0aW9uXSBbYWRkRmlsZV0gW2luc2VydF0gRXJyb3I6ICN7ZmlsZU5hbWV9IC0+ICN7X2NufVwiLCBlcnJvciBpZiBzZWxmLmRlYnVnXG4gICAgICAgICAgICBjYWxsYmFjayBhbmQgY2FsbGJhY2sgZXJyb3JcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbYWRkRmlsZV0gW2luc2VydF06ICN7ZmlsZU5hbWV9IC0+ICN7X2NufVwiIGlmIHNlbGYuZGVidWdcbiAgICAgICAgICAgIGNhbGxiYWNrIGFuZCBjYWxsYmFjayBudWxsLCByZXN1bHRcbiAgICAgIGVsc2VcbiAgICAgICAgY2FsbGJhY2sgYW5kIGNhbGxiYWNrIG5ldyBNZXRlb3IuRXJyb3IgNDAwLCBcIltGaWxlc0NvbGxlY3Rpb25dIFthZGRGaWxlKCN7cGF0aH0pXTogRmlsZSBkb2VzIG5vdCBleGlzdFwiXG5cbiAgICByZXR1cm4gQFxuICBlbHNlXG4gICAgdW5kZWZpbmVkXG5cbiAgIyMjXG4gIEBsb2N1cyBBbnl3aGVyZVxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGZpbmRPbmVcbiAgQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBzZWFyY2ggLSBgX2lkYCBvZiB0aGUgZmlsZSBvciBgT2JqZWN0YCBsaWtlLCB7cHJvcDondmFsJ31cbiAgQHN1bW1hcnkgTG9hZCBmaWxlXG4gIEByZXR1cm5zIHtGaWxlc0NvbGxlY3Rpb259IEluc3RhbmNlXG4gICMjI1xuICBmaW5kT25lOiAoc2VhcmNoKSAtPlxuICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFtmaW5kT25lKCN7SlNPTi5zdHJpbmdpZnkoc2VhcmNoKX0pXVwiIGlmIEBkZWJ1Z1xuICAgIGNoZWNrIHNlYXJjaCwgTWF0Y2guT3B0aW9uYWwgTWF0Y2guT25lT2YgT2JqZWN0LCBTdHJpbmdcbiAgICBAc3JjaCBzZWFyY2hcblxuICAgIGlmIEBjaGVja0FjY2VzcygpXG4gICAgICBAY3VycmVudEZpbGUgPSBAY29sbGVjdGlvbi5maW5kT25lIEBzZWFyY2hcbiAgICAgIEBjdXJzb3IgICAgICA9IG51bGxcbiAgICByZXR1cm4gQFxuXG4gICMjI1xuICBAbG9jdXMgQW55d2hlcmVcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBmaW5kXG4gIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gc2VhcmNoIC0gYF9pZGAgb2YgdGhlIGZpbGUgb3IgYE9iamVjdGAgbGlrZSwge3Byb3A6J3ZhbCd9XG4gIEBzdW1tYXJ5IExvYWQgZmlsZSBvciBidW5jaCBvZiBmaWxlc1xuICBAcmV0dXJucyB7RmlsZXNDb2xsZWN0aW9ufSBJbnN0YW5jZVxuICAjIyNcbiAgZmluZDogKHNlYXJjaCkgLT5cbiAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbZmluZCgje0pTT04uc3RyaW5naWZ5KHNlYXJjaCl9KV1cIiBpZiBAZGVidWdcbiAgICBjaGVjayBzZWFyY2gsIE1hdGNoLk9wdGlvbmFsIE1hdGNoLk9uZU9mIE9iamVjdCwgU3RyaW5nXG4gICAgQHNyY2ggc2VhcmNoXG5cbiAgICBpZiBAY2hlY2tBY2Nlc3MoKVxuICAgICAgQGN1cnJlbnRGaWxlID0gbnVsbFxuICAgICAgQGN1cnNvciA9IEBjb2xsZWN0aW9uLmZpbmQgQHNlYXJjaFxuICAgIHJldHVybiBAXG5cbiAgIyMjXG4gIEBsb2N1cyBBbnl3aGVyZVxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGdldFxuICBAc3VtbWFyeSBSZXR1cm4gdmFsdWUgb2YgY3VycmVudCBjdXJzb3Igb3IgZmlsZVxuICBAcmV0dXJucyB7T2JqZWN0fFtPYmplY3RdfVxuICAjIyNcbiAgZ2V0OiAoKSAtPlxuICAgIGNvbnNvbGUuaW5mbyAnW0ZpbGVzQ29sbGVjdGlvbl0gW2dldCgpXScgaWYgQGRlYnVnXG4gICAgcmV0dXJuIEBjdXJzb3IuZmV0Y2goKSBpZiBAY3Vyc29yXG4gICAgcmV0dXJuIEBjdXJyZW50RmlsZVxuXG4gICMjI1xuICBAbG9jdXMgQW55d2hlcmVcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBmZXRjaFxuICBAc3VtbWFyeSBBbGlhcyBmb3IgYGdldCgpYCBtZXRob2RcbiAgQHJldHVybnMge1tPYmplY3RdfVxuICAjIyNcbiAgZmV0Y2g6ICgpIC0+XG4gICAgY29uc29sZS5pbmZvICdbRmlsZXNDb2xsZWN0aW9uXSBbZmV0Y2goKV0nIGlmIEBkZWJ1Z1xuICAgIGRhdGEgPSBAZ2V0KClcbiAgICBpZiBub3QgXy5pc0FycmF5IGRhdGFcbiAgICAgIHJldHVybiBbZGF0YV1cbiAgICBlbHNlXG4gICAgICBkYXRhXG5cbiAgIyMjXG4gIEBsb2N1cyBDbGllbnRcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBpbnNlcnRcbiAgQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRmlsZVJlYWRlclxuICBAcGFyYW0ge09iamVjdH0gY29uZmlnIC0gQ29uZmlndXJhdGlvbiBvYmplY3Qgd2l0aCBuZXh0IHByb3BlcnRpZXM6XG4gICAge0ZpbGV8T2JqZWN0fSBmaWxlICAgICAgICAgICAtIEhUTUw1IGBmaWxlc2AgaXRlbSwgbGlrZSBpbiBjaGFuZ2UgZXZlbnQ6IGBlLmN1cnJlbnRUYXJnZXQuZmlsZXNbMF1gXG4gICAge09iamVjdH0gICAgICBtZXRhICAgICAgICAgICAtIEFkZGl0aW9uYWwgZGF0YSBhcyBvYmplY3QsIHVzZSBsYXRlciBmb3Igc2VhcmNoXG4gICAge0Jvb2xlYW59ICAgICBhbGxvd1dlYldvcmtlcnMtIEFsbG93L0RlbnkgV2ViV29ya2VycyB1c2FnZVxuICAgIHtOdW1iZXJ8ZHluYW1pY30gc3RyZWFtcyAgICAgLSBRdWFudGl0eSBvZiBwYXJhbGxlbCB1cGxvYWQgc3RyZWFtcywgZGVmYXVsdDogMlxuICAgIHtOdW1iZXJ8ZHluYW1pY30gY2h1bmtTaXplICAgLSBDaHVuayBzaXplIGZvciB1cGxvYWRcbiAgICB7RnVuY3Rpb259ICAgIG9uVXBsb2FkZWQgICAgIC0gQ2FsbGJhY2sgdHJpZ2dlcmVkIHdoZW4gdXBsb2FkIGlzIGZpbmlzaGVkLCB3aXRoIHR3byBhcmd1bWVudHMgYGVycm9yYCBhbmQgYGZpbGVSZWZgXG4gICAge0Z1bmN0aW9ufSAgICBvblN0YXJ0ICAgICAgICAtIENhbGxiYWNrIHRyaWdnZXJlZCB3aGVuIHVwbG9hZCBpcyBzdGFydGVkIGFmdGVyIGFsbCBzdWNjZXNzZnVsIHZhbGlkYXRpb25zLCB3aXRoIHR3byBhcmd1bWVudHMgYGVycm9yYCAoYWx3YXlzIG51bGwpIGFuZCBgZmlsZVJlZmBcbiAgICB7RnVuY3Rpb259ICAgIG9uRXJyb3IgICAgICAgIC0gQ2FsbGJhY2sgdHJpZ2dlcmVkIG9uIGVycm9yIGluIHVwbG9hZCBhbmQvb3IgRmlsZVJlYWRlciwgd2l0aCB0d28gYXJndW1lbnRzIGBlcnJvcmAgYW5kIGBmaWxlRGF0YWBcbiAgICB7RnVuY3Rpb259ICAgIG9uUHJvZ3Jlc3MgICAgIC0gQ2FsbGJhY2sgdHJpZ2dlcmVkIHdoZW4gY2h1bmsgaXMgc2VudCwgd2l0aCBvbmx5IGFyZ3VtZW50IGBwcm9ncmVzc2BcbiAgICB7RnVuY3Rpb259ICAgIG9uQmVmb3JlVXBsb2FkIC0gQ2FsbGJhY2sgdHJpZ2dlcmVkIHJpZ2h0IGJlZm9yZSB1cGxvYWQgaXMgc3RhcnRlZDpcbiAgICAgICAgcmV0dXJuIHRydWUgdG8gY29udGludWVcbiAgICAgICAgcmV0dXJuIGZhbHNlIHRvIGFib3J0IHVwbG9hZFxuICBAcGFyYW0ge0Jvb2xlYW59IGF1dG9TdGFydCAgICAgLSBTdGFydCB1cGxvYWQgaW1tZWRpYXRlbHkuIElmIHNldCB0byBmYWxzZSwgeW91IG5lZWQgbWFudWFsbHkgY2FsbCAuc3RhcnQoKSBtZXRob2Qgb24gcmV0dXJuZWQgY2xhc3MuIFVzZWZ1bCB0byBzZXQgRXZlbnRMaXN0ZW5lcnMuXG4gIEBzdW1tYXJ5IFVwbG9hZCBmaWxlIHRvIHNlcnZlciBvdmVyIEREUFxuICBAcmV0dXJucyB7VXBsb2FkSW5zdGFuY2V9IEluc3RhbmNlLiBVcGxvYWRJbnN0YW5jZSBoYXMgbmV4dCBwcm9wZXJ0aWVzOlxuICAgIHtSZWFjdGl2ZVZhcn0gb25QYXVzZSAgLSBJcyB1cGxvYWQgcHJvY2VzcyBvbiB0aGUgcGF1c2U/XG4gICAge1JlYWN0aXZlVmFyfSBzdGF0ZSAgICAtIGFjdGl2ZXxwYXVzZWR8YWJvcnRlZHxjb21wbGV0ZWRcbiAgICB7UmVhY3RpdmVWYXJ9IHByb2dyZXNzIC0gQ3VycmVudCBwcm9ncmVzcyBpbiBwZXJjZW50YWdlXG4gICAge0Z1bmN0aW9ufSAgICBwYXVzZSAgICAtIFBhdXNlIHVwbG9hZCBwcm9jZXNzXG4gICAge0Z1bmN0aW9ufSAgICBjb250aW51ZSAtIENvbnRpbnVlIHBhdXNlZCB1cGxvYWQgcHJvY2Vzc1xuICAgIHtGdW5jdGlvbn0gICAgdG9nZ2xlICAgLSBUb2dnbGUgY29udGludWUvcGF1c2UgaWYgdXBsb2FkIHByb2Nlc3NcbiAgICB7RnVuY3Rpb259ICAgIGFib3J0ICAgIC0gQWJvcnQgdXBsb2FkXG4gICAge0Z1bmN0aW9ufSAgICByZWFkQXNEYXRhVVJMIC0gQ3VycmVudCBmaWxlIGFzIGRhdGEgVVJMLCB1c2UgdG8gY3JlYXRlIGltYWdlIHByZXZpZXcgYW5kIGV0Yy4gQmUgYXdhcmUgb2YgYmlnIGZpbGVzLCBtYXkgbGVhZCB0byBicm93c2VyIGNyYXNoXG4gICMjI1xuICBpbnNlcnQ6IGlmIE1ldGVvci5pc0NsaWVudCB0aGVuIChjb25maWcsIGF1dG9TdGFydCA9IHRydWUpIC0+XG4gICAgaWYgQGNoZWNrQWNjZXNzKClcbiAgICAgIG1OYW1lID0gaWYgYXV0b1N0YXJ0IHRoZW4gJ3N0YXJ0JyBlbHNlICdtYW51YWwnXG4gICAgICByZXR1cm4gKG5ldyBAX1VwbG9hZEluc3RhbmNlKGNvbmZpZywgQCkpW21OYW1lXSgpXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciA0MDEsIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2luc2VydF0gQWNjZXNzIERlbmllZFwiXG4gIGVsc2UgdW5kZWZpbmVkXG5cbiAgIyMjXG4gIEBsb2N1cyBDbGllbnRcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSBfVXBsb2FkSW5zdGFuY2VcbiAgQGNsYXNzIFVwbG9hZEluc3RhbmNlXG4gIEBzdW1tYXJ5IEludGVybmFsIENsYXNzLCB1c2VkIGluIHVwbG9hZFxuICAjIyNcbiAgX1VwbG9hZEluc3RhbmNlOiBpZiBNZXRlb3IuaXNDbGllbnQgdGhlbiBjbGFzcyBVcGxvYWRJbnN0YW5jZVxuICAgIF9fcHJvdG9fXzogRXZlbnRFbWl0dGVyLnByb3RvdHlwZVxuICAgIGNvbnN0cnVjdG9yOiAoQGNvbmZpZywgQGNvbGxlY3Rpb24pIC0+XG4gICAgICBFdmVudEVtaXR0ZXIuY2FsbCBAXG4gICAgICBjb25zb2xlLmluZm8gJ1tGaWxlc0NvbGxlY3Rpb25dIFtpbnNlcnQoKV0nIGlmIEBjb2xsZWN0aW9uLmRlYnVnXG4gICAgICBzZWxmICAgICAgICAgICAgICAgICAgICAgPSBAXG4gICAgICBAY29uZmlnLm1ldGEgICAgICAgICAgICA/PSB7fVxuICAgICAgQGNvbmZpZy5zdHJlYW1zICAgICAgICAgPz0gMlxuICAgICAgQGNvbmZpZy5zdHJlYW1zICAgICAgICAgID0gMiBpZiBAY29uZmlnLnN0cmVhbXMgPCAxXG4gICAgICBAY29uZmlnLmNodW5rU2l6ZSAgICAgICA/PSBAY29sbGVjdGlvbi5jaHVua1NpemVcbiAgICAgIEBjb25maWcuYWxsb3dXZWJXb3JrZXJzID89IHRydWVcblxuICAgICAgY2hlY2sgQGNvbmZpZywge1xuICAgICAgICBmaWxlOiAgICAgICAgICAgIE1hdGNoLkFueVxuICAgICAgICBtZXRhOiAgICAgICAgICAgIE1hdGNoLk9wdGlvbmFsIE9iamVjdFxuICAgICAgICBvbkVycm9yOiAgICAgICAgIE1hdGNoLk9wdGlvbmFsIEZ1bmN0aW9uXG4gICAgICAgIG9uQWJvcnQ6ICAgICAgICAgTWF0Y2guT3B0aW9uYWwgRnVuY3Rpb25cbiAgICAgICAgc3RyZWFtczogICAgICAgICBNYXRjaC5PbmVPZiAnZHluYW1pYycsIE51bWJlclxuICAgICAgICBvblN0YXJ0OiAgICAgICAgIE1hdGNoLk9wdGlvbmFsIEZ1bmN0aW9uXG4gICAgICAgIGNodW5rU2l6ZTogICAgICAgTWF0Y2guT25lT2YgJ2R5bmFtaWMnLCBOdW1iZXJcbiAgICAgICAgb25VcGxvYWRlZDogICAgICBNYXRjaC5PcHRpb25hbCBGdW5jdGlvblxuICAgICAgICBvblByb2dyZXNzOiAgICAgIE1hdGNoLk9wdGlvbmFsIEZ1bmN0aW9uXG4gICAgICAgIG9uQmVmb3JlVXBsb2FkOiAgTWF0Y2guT3B0aW9uYWwgRnVuY3Rpb25cbiAgICAgICAgYWxsb3dXZWJXb3JrZXJzOiBCb29sZWFuXG4gICAgICB9XG5cbiAgICAgIGlmIEBjb25maWcuZmlsZVxuICAgICAgICBjb25zb2xlLnRpbWUoJ2luc2VydCAnICsgQGNvbmZpZy5maWxlLm5hbWUpIGlmIEBjb2xsZWN0aW9uLmRlYnVnXG4gICAgICAgIGNvbnNvbGUudGltZSgnbG9hZEZpbGUgJyArIEBjb25maWcuZmlsZS5uYW1lKSBpZiBAY29sbGVjdGlvbi5kZWJ1Z1xuXG4gICAgICAgIGlmIFdvcmtlciBhbmQgQGNvbmZpZy5hbGxvd1dlYldvcmtlcnNcbiAgICAgICAgICBAd29ya2VyID0gbmV3IFdvcmtlciAnL3BhY2thZ2VzL29zdHJpb19maWxlcy93b3JrZXIuanMnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAd29ya2VyID0gbnVsbFxuXG4gICAgICAgIEB0cmFja2VyQ29tcCAgPSBudWxsXG4gICAgICAgIEBjdXJyZW50Q2h1bmsgPSAwXG4gICAgICAgIEBzZW50Q2h1bmtzICAgPSAwXG4gICAgICAgIEBFT0ZzZW50ICAgICAgPSBmYWxzZVxuICAgICAgICBAdHJhbnNmZXJUaW1lID0gMFxuICAgICAgICBAZmlsZUxlbmd0aCA9IDFcbiAgICAgICAgQGZpbGVJZCAgICAgPSBAY29sbGVjdGlvbi5uYW1pbmdGdW5jdGlvbigpXG4gICAgICAgIEBwaXBlcyAgICAgID0gW11cbiAgICAgICAgQGZpbGVEYXRhICAgPVxuICAgICAgICAgIHNpemU6IEBjb25maWcuZmlsZS5zaXplXG4gICAgICAgICAgdHlwZTogQGNvbmZpZy5maWxlLnR5cGVcbiAgICAgICAgICBuYW1lOiBAY29uZmlnLmZpbGUubmFtZVxuXG4gICAgICAgIEBmaWxlRGF0YSA9IF8uZXh0ZW5kIEBmaWxlRGF0YSwgQGNvbGxlY3Rpb24uZ2V0RXh0KHNlbGYuY29uZmlnLmZpbGUubmFtZSksIHttaW1lOiBAY29sbGVjdGlvbi5nZXRNaW1lVHlwZShAZmlsZURhdGEpfVxuICAgICAgICBAZmlsZURhdGFbJ21pbWUtdHlwZSddID0gQGZpbGVEYXRhLm1pbWVcblxuICAgICAgICBAcmVzdWx0ID0gbmV3IEBjb2xsZWN0aW9uLl9GaWxlVXBsb2FkIF8uZXh0ZW5kIHNlbGYuY29uZmlnLCB7QGZpbGVEYXRhLCBAZmlsZUlkLCBNZXRlb3JGaWxlQWJvcnQ6IEBjb2xsZWN0aW9uLm1ldGhvZE5hbWVzLk1ldGVvckZpbGVBYm9ydH1cblxuICAgICAgICBAYmVmb3JldW5sb2FkID0gKGUpIC0+XG4gICAgICAgICAgbWVzc2FnZSA9IGlmIF8uaXNGdW5jdGlvbihzZWxmLmNvbGxlY3Rpb24ub25iZWZvcmV1bmxvYWRNZXNzYWdlKSB0aGVuIHNlbGYuY29sbGVjdGlvbi5vbmJlZm9yZXVubG9hZE1lc3NhZ2UuY2FsbChzZWxmLnJlc3VsdCwgc2VsZi5maWxlRGF0YSkgZWxzZSBzZWxmLmNvbGxlY3Rpb24ub25iZWZvcmV1bmxvYWRNZXNzYWdlXG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IG1lc3NhZ2UgaWYgZVxuICAgICAgICAgIHJldHVybiBtZXNzYWdlXG4gICAgICAgIEByZXN1bHQuY29uZmlnLmJlZm9yZXVubG9hZCA9IEBiZWZvcmV1bmxvYWRcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2JlZm9yZXVubG9hZCcsIEBiZWZvcmV1bmxvYWQsIGZhbHNlXG4gICAgICAgICAgXG4gICAgICAgIEByZXN1bHQuY29uZmlnLl9vbkVuZCA9IC0+IHNlbGYuZW1pdEV2ZW50ICdfb25FbmQnXG5cbiAgICAgICAgQGFkZExpc3RlbmVyICdlbmQnLCBAZW5kXG4gICAgICAgIEBhZGRMaXN0ZW5lciAnc3RhcnQnLCBAc3RhcnRcbiAgICAgICAgQGFkZExpc3RlbmVyICd1cGxvYWQnLCBAdXBsb2FkXG4gICAgICAgIEBhZGRMaXN0ZW5lciAnc2VuZEVPRicsIEBzZW5kRU9GXG4gICAgICAgIEBhZGRMaXN0ZW5lciAncHJlcGFyZScsIEBwcmVwYXJlXG4gICAgICAgIEBhZGRMaXN0ZW5lciAnc2VuZFZpYUREUCcsIEBzZW5kVmlhRERQXG4gICAgICAgIEBhZGRMaXN0ZW5lciAncHJvY2VlZENodW5rJywgQHByb2NlZWRDaHVua1xuICAgICAgICBAYWRkTGlzdGVuZXIgJ2NyZWF0ZVN0cmVhbXMnLCBAY3JlYXRlU3RyZWFtc1xuXG4gICAgICAgIEBhZGRMaXN0ZW5lciAnY2FsY3VsYXRlU3RhdHMnLCBfLnRocm90dGxlIC0+XG4gICAgICAgICAgX3QgPSAoc2VsZi50cmFuc2ZlclRpbWUgLyBzZWxmLnNlbnRDaHVua3MpIC8gc2VsZi5jb25maWcuc3RyZWFtc1xuICAgICAgICAgIHNlbGYucmVzdWx0LmVzdGltYXRlVGltZS5zZXQgKF90ICogKHNlbGYuZmlsZUxlbmd0aCAtIHNlbGYuc2VudENodW5rcykpXG4gICAgICAgICAgc2VsZi5yZXN1bHQuZXN0aW1hdGVTcGVlZC5zZXQgKHNlbGYuY29uZmlnLmNodW5rU2l6ZSAvIChfdCAvIDEwMDApKVxuICAgICAgICAgIHByb2dyZXNzID0gTWF0aC5yb3VuZCgoc2VsZi5zZW50Q2h1bmtzIC8gc2VsZi5maWxlTGVuZ3RoKSAqIDEwMClcbiAgICAgICAgICBzZWxmLnJlc3VsdC5wcm9ncmVzcy5zZXQgcHJvZ3Jlc3NcbiAgICAgICAgICBzZWxmLmNvbmZpZy5vblByb2dyZXNzIGFuZCBzZWxmLmNvbmZpZy5vblByb2dyZXNzLmNhbGwgc2VsZi5yZXN1bHQsIHByb2dyZXNzLCBzZWxmLmZpbGVEYXRhXG4gICAgICAgICAgc2VsZi5yZXN1bHQuZW1pdEV2ZW50ICdwcm9ncmVzcycsIFtwcm9ncmVzcywgc2VsZi5maWxlRGF0YV1cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgLCAyNTBcblxuICAgICAgICBAYWRkTGlzdGVuZXIgJ19vbkVuZCcsIC0+IFxuICAgICAgICAgIHNlbGYud29ya2VyLnRlcm1pbmF0ZSgpIGlmIHNlbGYud29ya2VyXG4gICAgICAgICAgc2VsZi50cmFja2VyQ29tcC5zdG9wKCkgaWYgc2VsZi50cmFja2VyQ29tcFxuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBzZWxmLmJlZm9yZXVubG9hZCwgZmFsc2UpIGlmIHNlbGYuYmVmb3JldW5sb2FkXG4gICAgICAgICAgc2VsZi5yZXN1bHQucHJvZ3Jlc3Muc2V0KDApIGlmIHNlbGYucmVzdWx0XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgNTAwLCBcIltGaWxlc0NvbGxlY3Rpb25dIFtpbnNlcnRdIEhhdmUgeW91IGZvcmdldCB0byBwYXNzIGEgRmlsZSBpdHNlbGY/XCJcblxuICAgIGVuZDogKGVycm9yLCBkYXRhKSAtPlxuICAgICAgY29uc29sZS50aW1lRW5kKCdpbnNlcnQgJyArIEBjb25maWcuZmlsZS5uYW1lKSBpZiBAY29sbGVjdGlvbi5kZWJ1Z1xuICAgICAgQGVtaXRFdmVudCAnX29uRW5kJ1xuICAgICAgQHJlc3VsdC5lbWl0RXZlbnQgJ3VwbG9hZGVkJywgW2Vycm9yLCBkYXRhXVxuICAgICAgQGNvbmZpZy5vblVwbG9hZGVkIGFuZCBAY29uZmlnLm9uVXBsb2FkZWQuY2FsbCBAcmVzdWx0LCBlcnJvciwgZGF0YVxuICAgICAgaWYgZXJyb3JcbiAgICAgICAgY29uc29sZS53YXJuIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2luc2VydF0gW2VuZF0gRXJyb3I6IFwiLCBlcnJvciBpZiBAY29sbGVjdGlvbi5kZWJ1Z1xuICAgICAgICBAcmVzdWx0LmFib3J0KClcbiAgICAgICAgQHJlc3VsdC5zdGF0ZS5zZXQgJ2Fib3J0ZWQnXG4gICAgICAgIEByZXN1bHQuZW1pdEV2ZW50ICdlcnJvcicsIFtlcnJvciwgQGZpbGVEYXRhXVxuICAgICAgICBAY29uZmlnLm9uRXJyb3IgYW5kIEBjb25maWcub25FcnJvci5jYWxsIEByZXN1bHQsIGVycm9yLCBAZmlsZURhdGFcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlc3VsdC5zdGF0ZS5zZXQgJ2NvbXBsZXRlZCdcbiAgICAgICAgQGNvbGxlY3Rpb24uZW1pdEV2ZW50ICdhZnRlclVwbG9hZCcsIFtkYXRhXVxuICAgICAgQHJlc3VsdC5lbWl0RXZlbnQgJ2VuZCcsIFtlcnJvciwgKGRhdGEgb3IgQGZpbGVEYXRhKV1cbiAgICAgIHJldHVybiBAcmVzdWx0XG5cbiAgICBzZW5kVmlhRERQOiAoZXZ0KSAtPlxuICAgICAgc2VsZiA9IEBcbiAgICAgIG9wdHMgPVxuICAgICAgICBmaWxlOiAgICAgICBAZmlsZURhdGFcbiAgICAgICAgZmlsZUlkOiAgICAgQGZpbGVJZFxuICAgICAgICBiaW5EYXRhOiAgICBldnQuZGF0YS5iaW5cbiAgICAgICAgY2h1bmtJZDogICAgZXZ0LmRhdGEuY2h1bmtJZFxuICAgICAgICBjaHVua1NpemU6ICBAY29uZmlnLmNodW5rU2l6ZVxuICAgICAgICBmaWxlTGVuZ3RoOiBAZmlsZUxlbmd0aFxuXG4gICAgICBAZW1pdEV2ZW50ICdkYXRhJywgW2V2dC5kYXRhLmJpbl1cbiAgICAgIGlmIEBwaXBlcy5sZW5ndGhcbiAgICAgICAgZm9yIHBpcGVGdW5jIGluIEBwaXBlc1xuICAgICAgICAgIG9wdHMuYmluRGF0YSA9IHBpcGVGdW5jIG9wdHMuYmluRGF0YVxuXG4gICAgICBpZiBAZmlsZUxlbmd0aCBpcyBldnQuZGF0YS5jaHVua0lkXG4gICAgICAgIGNvbnNvbGUudGltZUVuZCgnbG9hZEZpbGUgJyArIEBjb25maWcuZmlsZS5uYW1lKSBpZiBAY29sbGVjdGlvbi5kZWJ1Z1xuICAgICAgICBAZW1pdEV2ZW50ICdyZWFkRW5kJ1xuXG4gICAgICBpZiBvcHRzLmJpbkRhdGEgYW5kIG9wdHMuYmluRGF0YS5sZW5ndGhcbiAgICAgICAgTWV0ZW9yLmNhbGwgQGNvbGxlY3Rpb24ubWV0aG9kTmFtZXMuTWV0ZW9yRmlsZVdyaXRlLCBvcHRzLCAoZXJyb3IpIC0+XG4gICAgICAgICAgKytzZWxmLnNlbnRDaHVua3NcbiAgICAgICAgICBzZWxmLnRyYW5zZmVyVGltZSArPSAoK25ldyBEYXRlKSAtIGV2dC5kYXRhLnN0YXJ0XG4gICAgICAgICAgaWYgZXJyb3JcbiAgICAgICAgICAgIHNlbGYuZW1pdEV2ZW50ICdlbmQnLCBbZXJyb3JdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgc2VsZi5zZW50Q2h1bmtzID49IHNlbGYuZmlsZUxlbmd0aFxuICAgICAgICAgICAgICBzZWxmLmVtaXRFdmVudCAnc2VuZEVPRicsIFtvcHRzXVxuICAgICAgICAgICAgZWxzZSBpZiBzZWxmLmN1cnJlbnRDaHVuayA8IHNlbGYuZmlsZUxlbmd0aFxuICAgICAgICAgICAgICBzZWxmLmVtaXRFdmVudCAndXBsb2FkJ1xuICAgICAgICAgICAgc2VsZi5lbWl0RXZlbnQgJ2NhbGN1bGF0ZVN0YXRzJ1xuICAgICAgICAgIHJldHVyblxuICAgICAgcmV0dXJuXG5cbiAgICBzZW5kRU9GOiAob3B0cykgLT5cbiAgICAgIHVubGVzcyBARU9Gc2VudFxuICAgICAgICBARU9Gc2VudCA9IHRydWVcbiAgICAgICAgc2VsZiA9IEBcbiAgICAgICAgb3B0cyA9XG4gICAgICAgICAgZW9mOiAgICAgICAgdHJ1ZVxuICAgICAgICAgIG1ldGE6ICAgICAgIEBjb25maWcubWV0YVxuICAgICAgICAgIGZpbGU6ICAgICAgIEBmaWxlRGF0YVxuICAgICAgICAgIGZpbGVJZDogICAgIEBmaWxlSWRcbiAgICAgICAgICBjaHVua1NpemU6ICBAY29uZmlnLmNodW5rU2l6ZVxuICAgICAgICAgIGZpbGVMZW5ndGg6IEBmaWxlTGVuZ3RoXG5cbiAgICAgICAgTWV0ZW9yLmNhbGwgQGNvbGxlY3Rpb24ubWV0aG9kTmFtZXMuTWV0ZW9yRmlsZVdyaXRlLCBvcHRzLCAtPiBcbiAgICAgICAgICBzZWxmLmVtaXRFdmVudCAnZW5kJywgYXJndW1lbnRzXG4gICAgICByZXR1cm5cblxuICAgIHByb2NlZWRDaHVuazogKGNodW5rSWQsIHN0YXJ0KSAtPlxuICAgICAgc2VsZiAgICAgICA9IEBcbiAgICAgIGNodW5rICAgICAgPSBAY29uZmlnLmZpbGUuc2xpY2UgKEBjb25maWcuY2h1bmtTaXplICogKGNodW5rSWQgLSAxKSksIChAY29uZmlnLmNodW5rU2l6ZSAqIGNodW5rSWQpXG4gICAgICBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXJcblxuICAgICAgZmlsZVJlYWRlci5vbmxvYWRlbmQgPSAoZXZ0KSAtPlxuICAgICAgICBzZWxmLmVtaXRFdmVudCAnc2VuZFZpYUREUCcsIFt7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgYmluOiAoZmlsZVJlYWRlcj8ucmVzdWx0IG9yIGV2dC5zcmNFbGVtZW50Py5yZXN1bHQgb3IgZXZ0LnRhcmdldD8ucmVzdWx0KS5zcGxpdCgnLCcpWzFdXG4gICAgICAgICAgICBjaHVua0lkOiBjaHVua0lkXG4gICAgICAgICAgICBzdGFydDogc3RhcnRcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICAgIHJldHVyblxuICAgICAgZmlsZVJlYWRlci5vbmVycm9yID0gKGUpIC0+XG4gICAgICAgIHNlbGYuZW1pdEV2ZW50ICdlbmQnLCBbKGUudGFyZ2V0IG9yIGUuc3JjRWxlbWVudCkuZXJyb3JdXG4gICAgICAgIHJldHVyblxuXG4gICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwgY2h1bmtcbiAgICAgIHJldHVyblxuXG4gICAgdXBsb2FkOiAtPiBcbiAgICAgIHN0YXJ0ID0gK25ldyBEYXRlXG4gICAgICBpZiBAcmVzdWx0Lm9uUGF1c2UuZ2V0KClcbiAgICAgICAgc2VsZiA9IEBcbiAgICAgICAgQHJlc3VsdC5jb250aW51ZUZ1bmMgPSAtPlxuICAgICAgICAgIHNlbGYuZW1pdEV2ZW50ICdjcmVhdGVTdHJlYW1zJ1xuICAgICAgICAgIHJldHVyblxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgQHJlc3VsdC5zdGF0ZS5nZXQoKSBpcyAnYWJvcnRlZCdcbiAgICAgICAgcmV0dXJuIEBcblxuICAgICAgaWYgQGN1cnJlbnRDaHVuayA8PSBAZmlsZUxlbmd0aFxuICAgICAgICArK0BjdXJyZW50Q2h1bmtcbiAgICAgICAgaWYgQHdvcmtlclxuICAgICAgICAgIEB3b3JrZXIucG9zdE1lc3NhZ2Uoe0BzZW50Q2h1bmtzLCBzdGFydCwgQGN1cnJlbnRDaHVuaywgY2h1bmtTaXplOiBAY29uZmlnLmNodW5rU2l6ZSwgZmlsZTogQGNvbmZpZy5maWxlfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBlbWl0RXZlbnQgJ3Byb2NlZWRDaHVuaycsIFtAY3VycmVudENodW5rLCBzdGFydF1cbiAgICAgIHJldHVyblxuXG4gICAgY3JlYXRlU3RyZWFtczogLT5cbiAgICAgIGkgICAgPSAxXG4gICAgICBzZWxmID0gQFxuICAgICAgd2hpbGUgaSA8PSBAY29uZmlnLnN0cmVhbXNcbiAgICAgICAgc2VsZi5lbWl0RXZlbnQgJ3VwbG9hZCdcbiAgICAgICAgaSsrXG4gICAgICByZXR1cm5cblxuICAgIHByZXBhcmU6IC0+XG4gICAgICBzZWxmID0gQFxuXG4gICAgICBAY29uZmlnLm9uU3RhcnQgYW5kIEBjb25maWcub25TdGFydC5jYWxsIEByZXN1bHQsIG51bGwsIEBmaWxlRGF0YVxuICAgICAgQHJlc3VsdC5lbWl0RXZlbnQgJ3N0YXJ0JywgW251bGwsIEBmaWxlRGF0YV1cblxuICAgICAgaWYgQGNvbmZpZy5jaHVua1NpemUgaXMgJ2R5bmFtaWMnXG4gICAgICAgIEBjb25maWcuY2h1bmtTaXplID0gQGNvbmZpZy5maWxlLnNpemUgLyAxMDAwXG4gICAgICAgIGlmIEBjb25maWcuY2h1bmtTaXplIDwgMzI3NjgwXG4gICAgICAgICAgQGNvbmZpZy5jaHVua1NpemUgPSAzMjc2ODBcbiAgICAgICAgZWxzZSBpZiBAY29uZmlnLmNodW5rU2l6ZSA+IDEwNDg1NzZcbiAgICAgICAgICBAY29uZmlnLmNodW5rU2l6ZSA9IDEwNDg1NzZcblxuICAgICAgQGNvbmZpZy5jaHVua1NpemUgPSBNYXRoLmZsb29yKEBjb25maWcuY2h1bmtTaXplIC8gOCkgKiA4XG4gICAgICBfbGVuID0gTWF0aC5jZWlsKEBjb25maWcuZmlsZS5zaXplIC8gQGNvbmZpZy5jaHVua1NpemUpXG4gICAgICBpZiBAY29uZmlnLnN0cmVhbXMgaXMgJ2R5bmFtaWMnXG4gICAgICAgIEBjb25maWcuc3RyZWFtcyA9IF8uY2xvbmUgX2xlblxuICAgICAgICBAY29uZmlnLnN0cmVhbXMgPSAyNCBpZiBAY29uZmlnLnN0cmVhbXMgPiAyNFxuXG4gICAgICBAZmlsZUxlbmd0aCAgICAgICAgICAgICAgID0gaWYgX2xlbiA8PSAwIHRoZW4gMSBlbHNlIF9sZW5cbiAgICAgIEBjb25maWcuc3RyZWFtcyAgICAgICAgICAgPSBAZmlsZUxlbmd0aCBpZiBAY29uZmlnLnN0cmVhbXMgPiBAZmlsZUxlbmd0aFxuICAgICAgQHJlc3VsdC5jb25maWcuZmlsZUxlbmd0aCA9IEBmaWxlTGVuZ3RoXG5cbiAgICAgIHNlbGYuZW1pdEV2ZW50ICdjcmVhdGVTdHJlYW1zJ1xuICAgICAgcmV0dXJuXG5cbiAgICBwaXBlOiAoZnVuYykgLT4gXG4gICAgICBAcGlwZXMucHVzaCBmdW5jXG4gICAgICByZXR1cm4gQFxuXG4gICAgc3RhcnQ6IC0+XG4gICAgICBzZWxmID0gQFxuICAgICAgaWYgQGNvbmZpZy5maWxlLnNpemUgPD0gMFxuICAgICAgICBAZW5kIG5ldyBNZXRlb3IuRXJyb3IgNDAwLCAnQ2FuXFwndCB1cGxvYWQgZW1wdHkgZmlsZSdcbiAgICAgICAgcmV0dXJuIEByZXN1bHRcblxuICAgICAgaWYgQGNvbmZpZy5vbkJlZm9yZVVwbG9hZCBhbmQgXy5pc0Z1bmN0aW9uIEBjb25maWcub25CZWZvcmVVcGxvYWRcbiAgICAgICAgaXNVcGxvYWRBbGxvd2VkID0gQGNvbmZpZy5vbkJlZm9yZVVwbG9hZC5jYWxsIF8uZXh0ZW5kKEByZXN1bHQsIEBjb2xsZWN0aW9uLmdldFVzZXIoKSksIEBmaWxlRGF0YVxuICAgICAgICBpZiBpc1VwbG9hZEFsbG93ZWQgaXNudCB0cnVlXG4gICAgICAgICAgcmV0dXJuIEBlbmQgbmV3IE1ldGVvci5FcnJvcig0MDMsIGlmIF8uaXNTdHJpbmcoaXNVcGxvYWRBbGxvd2VkKSB0aGVuIGlzVXBsb2FkQWxsb3dlZCBlbHNlICdjb25maWcub25CZWZvcmVVcGxvYWQoKSByZXR1cm5lZCBmYWxzZScpXG5cbiAgICAgIGlmIEBjb2xsZWN0aW9uLm9uQmVmb3JlVXBsb2FkIGFuZCBfLmlzRnVuY3Rpb24gQGNvbGxlY3Rpb24ub25CZWZvcmVVcGxvYWRcbiAgICAgICAgaXNVcGxvYWRBbGxvd2VkID0gQGNvbGxlY3Rpb24ub25CZWZvcmVVcGxvYWQuY2FsbCBfLmV4dGVuZChAcmVzdWx0LCBAY29sbGVjdGlvbi5nZXRVc2VyKCkpLCBAZmlsZURhdGFcbiAgICAgICAgaWYgaXNVcGxvYWRBbGxvd2VkIGlzbnQgdHJ1ZVxuICAgICAgICAgIHJldHVybiBAZW5kIG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBpZiBfLmlzU3RyaW5nKGlzVXBsb2FkQWxsb3dlZCkgdGhlbiBpc1VwbG9hZEFsbG93ZWQgZWxzZSAnY29sbGVjdGlvbi5vbkJlZm9yZVVwbG9hZCgpIHJldHVybmVkIGZhbHNlJylcblxuICAgICAgVHJhY2tlci5hdXRvcnVuIChjb21wdXRhdGlvbikgLT5cbiAgICAgICAgc2VsZi50cmFja2VyQ29tcCA9IGNvbXB1dGF0aW9uXG4gICAgICAgIHVubGVzcyBzZWxmLnJlc3VsdC5vblBhdXNlLmdldCgpXG4gICAgICAgICAgaWYgTWV0ZW9yLnN0YXR1cygpLmNvbm5lY3RlZFxuICAgICAgICAgICAgc2VsZi5yZXN1bHQuY29udGludWUoKVxuICAgICAgICAgICAgY29uc29sZS5pbmZvICdbRmlsZXNDb2xsZWN0aW9uXSBbaW5zZXJ0XSBbVHJhY2tlcl0gW2NvbnRpbnVlXScgaWYgc2VsZi5jb2xsZWN0aW9uLmRlYnVnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZi5yZXN1bHQucGF1c2UoKVxuICAgICAgICAgICAgY29uc29sZS5pbmZvICdbRmlsZXNDb2xsZWN0aW9uXSBbaW5zZXJ0XSBbVHJhY2tlcl0gW3BhdXNlXScgaWYgc2VsZi5jb2xsZWN0aW9uLmRlYnVnXG4gICAgICAgIHJldHVyblxuXG4gICAgICBpZiBAd29ya2VyXG4gICAgICAgIEB3b3JrZXIub25tZXNzYWdlID0gKGV2dCkgLT5cbiAgICAgICAgICBpZiBldnQuZGF0YS5lcnJvclxuICAgICAgICAgICAgY29uc29sZS53YXJuIGV2dC5kYXRhLmVycm9yIGlmIHNlbGYuY29sbGVjdGlvbi5kZWJ1Z1xuICAgICAgICAgICAgc2VsZi5lbWl0RXZlbnQgJ3Byb2NlZWRDaHVuaycsIFtldnQuZGF0YS5jaHVua0lkLCBldnQuZGF0YS5zdGFydF1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxmLmVtaXRFdmVudCAnc2VuZFZpYUREUCcsIFtldnRdXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIEB3b3JrZXIub25lcnJvciAgID0gKGUpIC0+IFxuICAgICAgICAgIHNlbGYuZW1pdEV2ZW50ICdlbmQnLCBbZS5tZXNzYWdlXVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICBpZiBAY29sbGVjdGlvbi5kZWJ1Z1xuICAgICAgICBpZiBAd29ya2VyXG4gICAgICAgICAgY29uc29sZS5pbmZvIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2luc2VydF0gdXNpbmcgV2ViV29ya2Vyc1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbaW5zZXJ0XSB1c2luZyBNYWluVGhyZWFkXCJcblxuICAgICAgc2VsZi5lbWl0RXZlbnQgJ3ByZXBhcmUnXG4gICAgICByZXR1cm4gQHJlc3VsdFxuXG4gICAgbWFudWFsOiAtPiBcbiAgICAgIHNlbGYgPSBAXG4gICAgICBAcmVzdWx0LnN0YXJ0ID0gLT5cbiAgICAgICAgc2VsZi5lbWl0RXZlbnQgJ3N0YXJ0J1xuICAgICAgICByZXR1cm5cbiAgICAgIEByZXN1bHQucGlwZSA9IChmdW5jKSAtPlxuICAgICAgICBzZWxmLnBpcGUgZnVuY1xuICAgICAgICByZXR1cm4gQFxuICAgICAgcmV0dXJuIEByZXN1bHRcbiAgZWxzZSB1bmRlZmluZWRcblxuICAjIyNcbiAgQGxvY3VzIENsaWVudFxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIF9GaWxlVXBsb2FkXG4gIEBjbGFzcyBGaWxlVXBsb2FkXG4gIEBzdW1tYXJ5IEludGVybmFsIENsYXNzLCBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGlzIHJldHVybmVkIGZyb20gYGluc2VydCgpYCBtZXRob2RcbiAgIyMjXG4gIF9GaWxlVXBsb2FkOiBpZiBNZXRlb3IuaXNDbGllbnQgdGhlbiBjbGFzcyBGaWxlVXBsb2FkXG4gICAgX19wcm90b19fOiBFdmVudEVtaXR0ZXIucHJvdG90eXBlXG4gICAgY29uc3RydWN0b3I6IChAY29uZmlnKSAtPlxuICAgICAgRXZlbnRFbWl0dGVyLmNhbGwgQFxuICAgICAgQGZpbGUgICAgICAgICAgPSBfLmV4dGVuZCBAY29uZmlnLmZpbGUsIEBjb25maWcuZmlsZURhdGFcbiAgICAgIEBzdGF0ZSAgICAgICAgID0gbmV3IFJlYWN0aXZlVmFyICdhY3RpdmUnXG4gICAgICBAb25QYXVzZSAgICAgICA9IG5ldyBSZWFjdGl2ZVZhciBmYWxzZVxuICAgICAgQHByb2dyZXNzICAgICAgPSBuZXcgUmVhY3RpdmVWYXIgMFxuICAgICAgQGVzdGltYXRlVGltZSAgPSBuZXcgUmVhY3RpdmVWYXIgMTAwMFxuICAgICAgQGVzdGltYXRlU3BlZWQgPSBuZXcgUmVhY3RpdmVWYXIgMFxuICAgIGNvbnRpbnVlRnVuYzogIC0+IHJldHVyblxuICAgIHBhdXNlOiAtPlxuICAgICAgdW5sZXNzIEBvblBhdXNlLmdldCgpXG4gICAgICAgIEBvblBhdXNlLnNldCB0cnVlXG4gICAgICAgIEBzdGF0ZS5zZXQgJ3BhdXNlZCdcbiAgICAgICAgQGVtaXRFdmVudCAncGF1c2UnLCBbQGZpbGVdXG4gICAgICByZXR1cm5cbiAgICBjb250aW51ZTogLT5cbiAgICAgIGlmIEBvblBhdXNlLmdldCgpXG4gICAgICAgIEBvblBhdXNlLnNldCBmYWxzZVxuICAgICAgICBAc3RhdGUuc2V0ICdhY3RpdmUnXG4gICAgICAgIEBlbWl0RXZlbnQgJ2NvbnRpbnVlJywgW0BmaWxlXVxuICAgICAgICBAY29udGludWVGdW5jLmNhbGwoKVxuICAgICAgICBAY29udGludWVGdW5jID0gLT4gcmV0dXJuXG4gICAgICByZXR1cm5cbiAgICB0b2dnbGU6IC0+XG4gICAgICBpZiBAb25QYXVzZS5nZXQoKSB0aGVuIEBjb250aW51ZSgpIGVsc2UgQHBhdXNlKClcbiAgICAgIHJldHVyblxuICAgIGFib3J0OiAtPlxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ2JlZm9yZXVubG9hZCcsIEBjb25maWcuYmVmb3JldW5sb2FkLCBmYWxzZVxuICAgICAgQGNvbmZpZy5vbkFib3J0IGFuZCBAY29uZmlnLm9uQWJvcnQuY2FsbCBALCBAZmlsZVxuICAgICAgQGVtaXRFdmVudCAnYWJvcnQnLCBbQGZpbGVdXG4gICAgICBAcGF1c2UoKVxuICAgICAgQGNvbmZpZy5fb25FbmQoKVxuICAgICAgQHN0YXRlLnNldCAnYWJvcnRlZCdcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnaW5zZXJ0ICcgKyBAY29uZmlnLmZpbGUubmFtZSkgaWYgQGNvbmZpZy5kZWJ1Z1xuICAgICAgaWYgQGNvbmZpZy5maWxlTGVuZ3RoXG4gICAgICAgIE1ldGVvci5jYWxsIEBjb25maWcuTWV0ZW9yRmlsZUFib3J0LCB7ZmlsZUlkOiBAY29uZmlnLmZpbGVJZCwgZmlsZUxlbmd0aDogQGNvbmZpZy5maWxlTGVuZ3RoLCBmaWxlRGF0YTogQGNvbmZpZy5maWxlRGF0YX1cbiAgICAgIHJldHVyblxuICBlbHNlIHVuZGVmaW5lZFxuXG4gICMjI1xuICBAbG9jdXMgQW55d2hlcmVcbiAgQG1lbWJlck9mIEZpbGVzQ29sbGVjdGlvblxuICBAbmFtZSByZW1vdmVcbiAgQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBzZWFyY2ggLSBgX2lkYCBvZiB0aGUgZmlsZSBvciBgT2JqZWN0YCBsaWtlLCB7cHJvcDondmFsJ31cbiAgQHBhcmFtIHtGdW5jdGlvbn0gY2IgLSBDYWxsYmFjayB3aXRoIG9uZSBgZXJyb3JgIGFyZ3VtZW50XG4gIEBzdW1tYXJ5IFJlbW92ZSBmaWxlKHMpIG9uIGN1cnNvciBvciBmaW5kIGFuZCByZW1vdmUgZmlsZShzKSBpZiBzZWFyY2ggaXMgc2V0XG4gIEByZXR1cm5zIHtGaWxlc0NvbGxlY3Rpb259IEluc3RhbmNlXG4gICMjI1xuICByZW1vdmU6IChzZWFyY2gsIGNiKSAtPlxuICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFtyZW1vdmUoI3tKU09OLnN0cmluZ2lmeShzZWFyY2gpfSldXCIgaWYgQGRlYnVnXG4gICAgY2hlY2sgc2VhcmNoLCBNYXRjaC5PcHRpb25hbCBNYXRjaC5PbmVPZiBPYmplY3QsIFN0cmluZ1xuICAgIGNoZWNrIGNiLCBNYXRjaC5PcHRpb25hbCBGdW5jdGlvblxuXG4gICAgaWYgQGNoZWNrQWNjZXNzKClcbiAgICAgIEBzcmNoIHNlYXJjaFxuICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgIE1ldGVvci5jYWxsIEBtZXRob2ROYW1lcy5NZXRlb3JGaWxlVW5saW5rLCByY3AoQCksIChpZiBjYiB0aGVuIGNiIGVsc2UgTk9PUClcblxuICAgICAgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgIGZpbGVzID0gQGNvbGxlY3Rpb24uZmluZCBAc2VhcmNoXG4gICAgICAgIGlmIGZpbGVzLmNvdW50KCkgPiAwXG4gICAgICAgICAgc2VsZiA9IEBcbiAgICAgICAgICBmaWxlcy5mb3JFYWNoIChmaWxlKSAtPiBzZWxmLnVubGluayBmaWxlXG4gICAgICAgIEBjb2xsZWN0aW9uLnJlbW92ZSBAc2VhcmNoLCBjYlxuICAgIGVsc2VcbiAgICAgIGNiIGFuZCBjYiBuZXcgTWV0ZW9yLkVycm9yIDQwMSwgJ1tGaWxlc0NvbGxlY3Rpb25dIFtyZW1vdmVdIEFjY2VzcyBkZW5pZWQhJ1xuICAgIHJldHVybiBAXG5cbiAgIyMjXG4gIEBsb2N1cyBBbnl3aGVyZVxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIHVwZGF0ZVxuICBAc2VlIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vIy9mdWxsL3VwZGF0ZVxuICBAc3VtbWFyeSBsaW5rIE1vbmdvLkNvbGxlY3Rpb24gdXBkYXRlIG1ldGhvZFxuICBAcmV0dXJucyB7TW9uZ28uQ29sbGVjdGlvbn0gSW5zdGFuY2VcbiAgIyMjXG4gIHVwZGF0ZTogLT5cbiAgICBAY29sbGVjdGlvbi51cGRhdGUuYXBwbHkgQGNvbGxlY3Rpb24sIGFyZ3VtZW50c1xuICAgIHJldHVybiBAY29sbGVjdGlvblxuXG4gICMjI1xuICBAbG9jdXMgU2VydmVyXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgZGVueVxuICBAbmFtZSBhbGxvd1xuICBAcGFyYW0ge09iamVjdH0gcnVsZXNcbiAgQHNlZSBodHRwOi8vZG9jcy5tZXRlb3IuY29tLyMvZnVsbC9hbGxvd1xuICBAc3VtbWFyeSBsaW5rIE1vbmdvLkNvbGxlY3Rpb24gYWxsb3cvZGVueSBtZXRob2RzXG4gIEByZXR1cm5zIHtNb25nby5Db2xsZWN0aW9ufSBJbnN0YW5jZVxuICAjIyNcbiAgZGVueTogaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gKHJ1bGVzKSAtPlxuICAgIEBjb2xsZWN0aW9uLmRlbnkgcnVsZXNcbiAgICByZXR1cm4gQGNvbGxlY3Rpb25cbiAgZWxzZSB1bmRlZmluZWRcbiAgYWxsb3c6IGlmIE1ldGVvci5pc1NlcnZlciB0aGVuIChydWxlcykgLT5cbiAgICBAY29sbGVjdGlvbi5hbGxvdyBydWxlc1xuICAgIHJldHVybiBAY29sbGVjdGlvblxuICBlbHNlIHVuZGVmaW5lZFxuXG4gICMjI1xuICBAbG9jdXMgU2VydmVyXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgZGVueUNsaWVudFxuICBAbmFtZSBhbGxvd0NsaWVudFxuICBAc2VlIGh0dHA6Ly9kb2NzLm1ldGVvci5jb20vIy9mdWxsL2FsbG93XG4gIEBzdW1tYXJ5IFNob3J0aGFuZHMgZm9yIE1vbmdvLkNvbGxlY3Rpb24gYWxsb3cvZGVueSBtZXRob2RzXG4gIEByZXR1cm5zIHtNb25nby5Db2xsZWN0aW9ufSBJbnN0YW5jZVxuICAjIyNcbiAgZGVueUNsaWVudDogaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gLT5cbiAgICBAY29sbGVjdGlvbi5kZW55XG4gICAgICBpbnNlcnQ6IC0+IHRydWVcbiAgICAgIHVwZGF0ZTogLT4gdHJ1ZVxuICAgICAgcmVtb3ZlOiAtPiB0cnVlXG4gICAgcmV0dXJuIEBjb2xsZWN0aW9uXG4gIGVsc2UgdW5kZWZpbmVkXG4gIGFsbG93Q2xpZW50OiBpZiBNZXRlb3IuaXNTZXJ2ZXIgdGhlbiAtPlxuICAgIEBjb2xsZWN0aW9uLmFsbG93XG4gICAgICBpbnNlcnQ6IC0+IHRydWVcbiAgICAgIHVwZGF0ZTogLT4gdHJ1ZVxuICAgICAgcmVtb3ZlOiAtPiB0cnVlXG4gICAgcmV0dXJuIEBjb2xsZWN0aW9uXG4gIGVsc2UgdW5kZWZpbmVkXG5cblxuICAjIyNcbiAgQGxvY3VzIFNlcnZlclxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIHVubGlua1xuICBAcGFyYW0ge09iamVjdH0gZmlsZVJlZiAtIGZpbGVPYmpcbiAgQHBhcmFtIHtTdHJpbmd9IHZlcnNpb24gLSBbT3B0aW9uYWxdIGZpbGUncyB2ZXJzaW9uXG4gIEBzdW1tYXJ5IFVubGluayBmaWxlcyBhbmQgaXQncyB2ZXJzaW9ucyBmcm9tIEZTXG4gIEByZXR1cm5zIHtGaWxlc0NvbGxlY3Rpb259IEluc3RhbmNlXG4gICMjI1xuICB1bmxpbms6IGlmIE1ldGVvci5pc1NlcnZlciB0aGVuIChmaWxlUmVmLCB2ZXJzaW9uKSAtPlxuICAgIGNvbnNvbGUuaW5mbyBcIltGaWxlc0NvbGxlY3Rpb25dIFt1bmxpbmsoI3tmaWxlUmVmLl9pZH0sICN7dmVyc2lvbn0pXVwiIGlmIEBkZWJ1Z1xuICAgIGlmIHZlcnNpb25cbiAgICAgIGlmIGZpbGVSZWYudmVyc2lvbnM/W3ZlcnNpb25dIGFuZCBmaWxlUmVmLnZlcnNpb25zW3ZlcnNpb25dPy5wYXRoXG4gICAgICAgIGZzLnVubGluayBmaWxlUmVmLnZlcnNpb25zW3ZlcnNpb25dLnBhdGgsIE5PT1BcbiAgICBlbHNlXG4gICAgICBpZiBmaWxlUmVmLnZlcnNpb25zIGFuZCBub3QgXy5pc0VtcHR5IGZpbGVSZWYudmVyc2lvbnNcbiAgICAgICAgXy5lYWNoIGZpbGVSZWYudmVyc2lvbnMsICh2UmVmKSAtPiBib3VuZCAtPlxuICAgICAgICAgIGZzLnVubGluayB2UmVmLnBhdGgsIE5PT1BcbiAgICAgIGZzLnVubGluayBmaWxlUmVmLnBhdGgsIE5PT1BcbiAgICByZXR1cm4gQFxuICBlbHNlIHVuZGVmaW5lZFxuXG4gICMjI1xuICBAbG9jdXMgU2VydmVyXG4gIEBtZW1iZXJPZiBGaWxlc0NvbGxlY3Rpb25cbiAgQG5hbWUgXzQwNFxuICBAc3VtbWFyeSBJbnRlcm5hbCBtZXRob2QsIHVzZWQgdG8gcmV0dXJuIDQwNCBlcnJvclxuICBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgXzQwNDogaWYgTWV0ZW9yLmlzU2VydmVyIHRoZW4gKGh0dHApIC0+XG4gICAgY29uc29sZS53YXJuIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2Rvd25sb2FkKCN7aHR0cC5yZXF1ZXN0Lm9yaWdpbmFsVXJsfSldIFtfNDA0XSBGaWxlIG5vdCBmb3VuZFwiIGlmIEBkZWJ1Z1xuICAgIHRleHQgPSAnRmlsZSBOb3QgRm91bmQgOignXG4gICAgaHR0cC5yZXNwb25zZS53cml0ZUhlYWQgNDA0LFxuICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogdGV4dC5sZW5ndGhcbiAgICAgICdDb250ZW50LVR5cGUnOiAgICd0ZXh0L3BsYWluJ1xuICAgIGh0dHAucmVzcG9uc2UuZW5kIHRleHRcbiAgICByZXR1cm5cbiAgZWxzZSB1bmRlZmluZWRcblxuICAjIyNcbiAgQGxvY3VzIFNlcnZlclxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGRvd25sb2FkXG4gIEBwYXJhbSB7T2JqZWN0fEZpbGVzfSBzZWxmIC0gSW5zdGFuY2Ugb2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBzdW1tYXJ5IEluaXRpYXRlcyB0aGUgSFRUUCByZXNwb25zZVxuICBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgZG93bmxvYWQ6IGlmIE1ldGVvci5pc1NlcnZlciB0aGVuIChodHRwLCB2ZXJzaW9uID0gJ29yaWdpbmFsJykgLT5cbiAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbZG93bmxvYWQoI3todHRwLnJlcXVlc3Qub3JpZ2luYWxVcmx9LCAje3ZlcnNpb259KV1cIiBpZiBAZGVidWdcbiAgICByZXNwb25zZVR5cGUgPSAnMjAwJ1xuICAgIGlmIEBjdXJyZW50RmlsZVxuICAgICAgaWYgXy5oYXMoQGN1cnJlbnRGaWxlLCAndmVyc2lvbnMnKSBhbmQgXy5oYXMgQGN1cnJlbnRGaWxlLnZlcnNpb25zLCB2ZXJzaW9uXG4gICAgICAgIGZpbGVSZWYgPSBAY3VycmVudEZpbGUudmVyc2lvbnNbdmVyc2lvbl1cbiAgICAgIGVsc2VcbiAgICAgICAgZmlsZVJlZiA9IEBjdXJyZW50RmlsZVxuICAgIGVsc2VcbiAgICAgIGZpbGVSZWYgPSBmYWxzZVxuXG4gICAgaWYgbm90IGZpbGVSZWYgb3Igbm90IF8uaXNPYmplY3QoZmlsZVJlZilcbiAgICAgIHJldHVybiBAXzQwNCBodHRwXG4gICAgZWxzZSBpZiBAY3VycmVudEZpbGVcbiAgICAgIHNlbGYgPSBAXG5cbiAgICAgIGlmIEBkb3dubG9hZENhbGxiYWNrXG4gICAgICAgIHVubGVzcyBAZG93bmxvYWRDYWxsYmFjay5jYWxsIF8uZXh0ZW5kKGh0dHAsIEBnZXRVc2VyKGh0dHApKSwgQGN1cnJlbnRGaWxlXG4gICAgICAgICAgcmV0dXJuIEBfNDA0IGh0dHBcblxuICAgICAgaWYgQGludGVyY2VwdERvd25sb2FkIGFuZCBfLmlzRnVuY3Rpb24gQGludGVyY2VwdERvd25sb2FkXG4gICAgICAgIGlmIEBpbnRlcmNlcHREb3dubG9hZChodHRwLCBAY3VycmVudEZpbGUsIHZlcnNpb24pIGlzIHRydWVcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgZnMuc3RhdCBmaWxlUmVmLnBhdGgsIChzdGF0RXJyLCBzdGF0cykgLT4gYm91bmQgLT5cbiAgICAgICAgaWYgc3RhdEVyciBvciBub3Qgc3RhdHMuaXNGaWxlKClcbiAgICAgICAgICByZXR1cm4gc2VsZi5fNDA0IGh0dHBcblxuICAgICAgICBmaWxlUmVmLnNpemUgPSBzdGF0cy5zaXplIGlmIHN0YXRzLnNpemUgaXNudCBmaWxlUmVmLnNpemUgYW5kIG5vdCBzZWxmLmludGVncml0eUNoZWNrXG4gICAgICAgIHJlc3BvbnNlVHlwZSA9ICc0MDAnIGlmIHN0YXRzLnNpemUgaXNudCBmaWxlUmVmLnNpemUgYW5kIHNlbGYuaW50ZWdyaXR5Q2hlY2tcbiAgICAgICAgcGFydGlyYWwgICAgID0gZmFsc2VcbiAgICAgICAgcmVxUmFuZ2UgICAgID0gZmFsc2VcblxuICAgICAgICBpZiBodHRwLnBhcmFtcy5xdWVyeS5kb3dubG9hZCBhbmQgaHR0cC5wYXJhbXMucXVlcnkuZG93bmxvYWQgPT0gJ3RydWUnXG4gICAgICAgICAgZGlzcG9zaXRpb25UeXBlID0gJ2F0dGFjaG1lbnQ7ICdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRpc3Bvc2l0aW9uVHlwZSA9ICdpbmxpbmU7ICdcblxuICAgICAgICBkaXNwb3NpdGlvbk5hbWUgICAgID0gXCJmaWxlbmFtZT1cXFwiI3tlbmNvZGVVUklDb21wb25lbnQoc2VsZi5jdXJyZW50RmlsZS5uYW1lKX1cXFwiOyBmaWxlbmFtZT0qVVRGLThcXFwiI3tlbmNvZGVVUklDb21wb25lbnQoc2VsZi5jdXJyZW50RmlsZS5uYW1lKX1cXFwiOyBcIlxuICAgICAgICBkaXNwb3NpdGlvbkVuY29kaW5nID0gJ2NoYXJzZXQ9dXRmLTgnXG5cbiAgICAgICAgaHR0cC5yZXNwb25zZS5zZXRIZWFkZXIgJ0NvbnRlbnQtVHlwZScsIGZpbGVSZWYudHlwZVxuICAgICAgICBodHRwLnJlc3BvbnNlLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsIGRpc3Bvc2l0aW9uVHlwZSArIGRpc3Bvc2l0aW9uTmFtZSArIGRpc3Bvc2l0aW9uRW5jb2RpbmdcbiAgICAgICAgaHR0cC5yZXNwb25zZS5zZXRIZWFkZXIgJ0FjY2VwdC1SYW5nZXMnLCAnYnl0ZXMnXG4gICAgICAgIGh0dHAucmVzcG9uc2Uuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgc2VsZi5jdXJyZW50RmlsZT8udXBkYXRlZEF0Py50b1VUQ1N0cmluZygpIGlmIHNlbGYuY3VycmVudEZpbGU/LnVwZGF0ZWRBdD8udG9VVENTdHJpbmcoKVxuICAgICAgICBodHRwLnJlc3BvbnNlLnNldEhlYWRlciAnQ29ubmVjdGlvbicsICdrZWVwLWFsaXZlJ1xuXG4gICAgICAgIGlmIGh0dHAucmVxdWVzdC5oZWFkZXJzLnJhbmdlXG4gICAgICAgICAgcGFydGlyYWwgPSB0cnVlXG4gICAgICAgICAgYXJyYXkgICAgPSBodHRwLnJlcXVlc3QuaGVhZGVycy5yYW5nZS5zcGxpdCAvYnl0ZXM9KFswLTldKiktKFswLTldKikvXG4gICAgICAgICAgc3RhcnQgICAgPSBwYXJzZUludCBhcnJheVsxXVxuICAgICAgICAgIGVuZCAgICAgID0gcGFyc2VJbnQgYXJyYXlbMl1cbiAgICAgICAgICBpZiBpc05hTihlbmQpXG4gICAgICAgICAgICBlbmQgICAgPSBmaWxlUmVmLnNpemUgLSAxXG4gICAgICAgICAgdGFrZSAgICAgPSBlbmQgLSBzdGFydFxuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhcnQgICAgPSAwXG4gICAgICAgICAgZW5kICAgICAgPSBmaWxlUmVmLnNpemUgLSAxXG4gICAgICAgICAgdGFrZSAgICAgPSBmaWxlUmVmLnNpemVcblxuICAgICAgICBpZiBwYXJ0aXJhbCBvciAoaHR0cC5wYXJhbXMucXVlcnkucGxheSBhbmQgaHR0cC5wYXJhbXMucXVlcnkucGxheSA9PSAndHJ1ZScpXG4gICAgICAgICAgcmVxUmFuZ2UgPSB7c3RhcnQsIGVuZH1cbiAgICAgICAgICBpZiBpc05hTihzdGFydCkgYW5kIG5vdCBpc05hTiBlbmRcbiAgICAgICAgICAgIHJlcVJhbmdlLnN0YXJ0ID0gZW5kIC0gdGFrZVxuICAgICAgICAgICAgcmVxUmFuZ2UuZW5kICAgPSBlbmRcbiAgICAgICAgICBpZiBub3QgaXNOYU4oc3RhcnQpIGFuZCBpc05hTiBlbmRcbiAgICAgICAgICAgIHJlcVJhbmdlLnN0YXJ0ID0gc3RhcnRcbiAgICAgICAgICAgIHJlcVJhbmdlLmVuZCAgID0gc3RhcnQgKyB0YWtlXG5cbiAgICAgICAgICByZXFSYW5nZS5lbmQgPSBmaWxlUmVmLnNpemUgLSAxIGlmICgoc3RhcnQgKyB0YWtlKSA+PSBmaWxlUmVmLnNpemUpXG4gICAgICAgICAgaHR0cC5yZXNwb25zZS5zZXRIZWFkZXIgJ1ByYWdtYScsICdwcml2YXRlJ1xuICAgICAgICAgIGh0dHAucmVzcG9uc2Uuc2V0SGVhZGVyICdFeHBpcmVzJywgbmV3IERhdGUoK25ldyBEYXRlICsgMTAwMCozMjQwMCkudG9VVENTdHJpbmcoKVxuICAgICAgICAgIGh0dHAucmVzcG9uc2Uuc2V0SGVhZGVyICdDYWNoZS1Db250cm9sJywgJ3ByaXZhdGUsIG1heGFnZT0xMDgwMCwgcy1tYXhhZ2U9MzI0MDAnXG5cbiAgICAgICAgICBpZiBzZWxmLnN0cmljdCBhbmQgKHJlcVJhbmdlLnN0YXJ0ID49IChmaWxlUmVmLnNpemUgLSAxKSBvciByZXFSYW5nZS5lbmQgPiAoZmlsZVJlZi5zaXplIC0gMSkpXG4gICAgICAgICAgICByZXNwb25zZVR5cGUgPSAnNDE2J1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZSA9ICcyMDYnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBodHRwLnJlc3BvbnNlLnNldEhlYWRlciAnQ2FjaGUtQ29udHJvbCcsIHNlbGYuY2FjaGVDb250cm9sXG4gICAgICAgICAgcmVzcG9uc2VUeXBlID0gJzIwMCdcblxuICAgICAgICBzdHJlYW1FcnJvckhhbmRsZXIgPSAoZXJyb3IpIC0+XG4gICAgICAgICAgaHR0cC5yZXNwb25zZS53cml0ZUhlYWQgNTAwXG4gICAgICAgICAgaHR0cC5yZXNwb25zZS5lbmQgZXJyb3IudG9TdHJpbmcoKVxuXG4gICAgICAgIHN3aXRjaCByZXNwb25zZVR5cGVcbiAgICAgICAgICB3aGVuICc0MDAnXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gXCJbRmlsZXNDb2xsZWN0aW9uXSBbZG93bmxvYWQoI3tmaWxlUmVmLnBhdGh9LCAje3ZlcnNpb259KV0gWzQwMF0gQ29udGVudC1MZW5ndGggbWlzbWF0Y2ghXCIgaWYgc2VsZi5kZWJ1Z1xuICAgICAgICAgICAgdGV4dCA9ICdDb250ZW50LUxlbmd0aCBtaXNtYXRjaCEnXG4gICAgICAgICAgICBodHRwLnJlc3BvbnNlLndyaXRlSGVhZCA0MDAsXG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAgICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgICAnQ2FjaGUtQ29udHJvbCc6ICAnbm8tY2FjaGUnXG4gICAgICAgICAgICAgICdDb250ZW50LUxlbmd0aCc6IHRleHQubGVuZ3RoXG4gICAgICAgICAgICBodHRwLnJlc3BvbnNlLmVuZCB0ZXh0XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIHdoZW4gJzQwNCdcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl80MDQgaHR0cFxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB3aGVuICc0MTYnXG4gICAgICAgICAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbZG93bmxvYWQoI3tmaWxlUmVmLnBhdGh9LCAje3ZlcnNpb259KV0gWzQxNl0gQ29udGVudC1SYW5nZSBpcyBub3Qgc3BlY2lmaWVkIVwiIGlmIHNlbGYuZGVidWdcbiAgICAgICAgICAgIGh0dHAucmVzcG9uc2Uud3JpdGVIZWFkIDQxNixcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtUmFuZ2UnOiBcImJ5dGVzICovI3tmaWxlUmVmLnNpemV9XCJcbiAgICAgICAgICAgIGh0dHAucmVzcG9uc2UuZW5kKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgd2hlbiAnMjAwJ1xuICAgICAgICAgICAgY29uc29sZS5pbmZvIFwiW0ZpbGVzQ29sbGVjdGlvbl0gW2Rvd25sb2FkKCN7ZmlsZVJlZi5wYXRofSwgI3t2ZXJzaW9ufSldIFsyMDBdXCIgaWYgc2VsZi5kZWJ1Z1xuICAgICAgICAgICAgc3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbSBmaWxlUmVmLnBhdGhcbiAgICAgICAgICAgIHN0cmVhbS5vbignb3BlbicsID0+XG4gICAgICAgICAgICAgIGh0dHAucmVzcG9uc2Uud3JpdGVIZWFkIDIwMFxuICAgICAgICAgICAgICBpZiBzZWxmLnRocm90dGxlXG4gICAgICAgICAgICAgICAgc3RyZWFtLnBpcGUoIG5ldyBUaHJvdHRsZSB7YnBzOiBzZWxmLnRocm90dGxlLCBjaHVua3NpemU6IHNlbGYuY2h1bmtTaXplfVxuICAgICAgICAgICAgICAgICkucGlwZSBodHRwLnJlc3BvbnNlXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzdHJlYW0ucGlwZSBodHRwLnJlc3BvbnNlXG4gICAgICAgICAgICApLm9uICdlcnJvcicsIHN0cmVhbUVycm9ySGFuZGxlclxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB3aGVuICcyMDYnXG4gICAgICAgICAgICBjb25zb2xlLmluZm8gXCJbRmlsZXNDb2xsZWN0aW9uXSBbZG93bmxvYWQoI3tmaWxlUmVmLnBhdGh9LCAje3ZlcnNpb259KV0gWzIwNl1cIiBpZiBzZWxmLmRlYnVnXG4gICAgICAgICAgICBodHRwLnJlc3BvbnNlLnNldEhlYWRlciAnQ29udGVudC1SYW5nZScsIFwiYnl0ZXMgI3tyZXFSYW5nZS5zdGFydH0tI3tyZXFSYW5nZS5lbmR9LyN7ZmlsZVJlZi5zaXplfVwiXG4gICAgICAgICAgICBodHRwLnJlc3BvbnNlLnNldEhlYWRlciAnVHJhaWxlcicsICdleHBpcmVzJ1xuICAgICAgICAgICAgaHR0cC5yZXNwb25zZS5zZXRIZWFkZXIgJ1RyYW5zZmVyLUVuY29kaW5nJywgJ2NodW5rZWQnXG4gICAgICAgICAgICBpZiBzZWxmLnRocm90dGxlXG4gICAgICAgICAgICAgIHN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0gZmlsZVJlZi5wYXRoLCB7c3RhcnQ6IHJlcVJhbmdlLnN0YXJ0LCBlbmQ6IHJlcVJhbmdlLmVuZH1cbiAgICAgICAgICAgICAgc3RyZWFtLm9uKCdvcGVuJywgLT4gaHR0cC5yZXNwb25zZS53cml0ZUhlYWQgMjA2XG4gICAgICAgICAgICAgICkub24oJ2Vycm9yJywgc3RyZWFtRXJyb3JIYW5kbGVyXG4gICAgICAgICAgICAgICkub24oJ2VuZCcsIC0+IGh0dHAucmVzcG9uc2UuZW5kKClcbiAgICAgICAgICAgICAgKS5waXBlKCBuZXcgVGhyb3R0bGUge2Jwczogc2VsZi50aHJvdHRsZSwgY2h1bmtzaXplOiBzZWxmLmNodW5rU2l6ZX1cbiAgICAgICAgICAgICAgKS5waXBlIGh0dHAucmVzcG9uc2VcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgc3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbSBmaWxlUmVmLnBhdGgsIHtzdGFydDogcmVxUmFuZ2Uuc3RhcnQsIGVuZDogcmVxUmFuZ2UuZW5kfVxuICAgICAgICAgICAgICBzdHJlYW0ub24oJ29wZW4nLCAtPiBodHRwLnJlc3BvbnNlLndyaXRlSGVhZCAyMDZcbiAgICAgICAgICAgICAgKS5vbignZXJyb3InLCBzdHJlYW1FcnJvckhhbmRsZXJcbiAgICAgICAgICAgICAgKS5vbignZW5kJywgLT4gaHR0cC5yZXNwb25zZS5lbmQoKVxuICAgICAgICAgICAgICApLnBpcGUgaHR0cC5yZXNwb25zZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgIHJldHVyblxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAXzQwNCBodHRwXG4gIGVsc2UgdW5kZWZpbmVkXG5cbiAgIyMjXG4gIEBsb2N1cyBBbnl3aGVyZVxuICBAbWVtYmVyT2YgRmlsZXNDb2xsZWN0aW9uXG4gIEBuYW1lIGxpbmtcbiAgQHBhcmFtIHtPYmplY3R9ICAgZmlsZVJlZiAtIEZpbGUgcmVmZXJlbmNlIG9iamVjdFxuICBAcGFyYW0ge1N0cmluZ30gICB2ZXJzaW9uIC0gW09wdGlvbmFsXSBWZXJzaW9uIG9mIGZpbGUgeW91IHdvdWxkIGxpa2UgdG8gcmVxdWVzdFxuICBAc3VtbWFyeSBSZXR1cm5zIGRvd25sb2FkYWJsZSBVUkxcbiAgQHJldHVybnMge1N0cmluZ30gRW1wdHkgc3RyaW5nIHJldHVybmVkIGluIGNhc2UgaWYgZmlsZSBub3QgZm91bmQgaW4gREJcbiAgIyMjXG4gIGxpbms6IChmaWxlUmVmLCB2ZXJzaW9uID0gJ29yaWdpbmFsJykgLT5cbiAgICBjb25zb2xlLmluZm8gJ1tGaWxlc0NvbGxlY3Rpb25dIFtsaW5rKCldJyBpZiBAZGVidWdcbiAgICBpZiBfLmlzU3RyaW5nIGZpbGVSZWZcbiAgICAgIHZlcnNpb24gPSBmaWxlUmVmXG4gICAgICBmaWxlUmVmID0gbnVsbFxuICAgIHJldHVybiAnJyBpZiBub3QgZmlsZVJlZiBhbmQgbm90IEBjdXJyZW50RmlsZVxuICAgIHJldHVybiBmb3JtYXRGbGVVUkwgKGZpbGVSZWYgb3IgQGN1cnJlbnRGaWxlKSwgdmVyc2lvblxuXG4jIyNcbkBsb2N1cyBBbnl3aGVyZVxuQHByaXZhdGVcbkBuYW1lIGZvcm1hdEZsZVVSTFxuQHBhcmFtIHtPYmplY3R9IGZpbGVSZWYgLSBGaWxlIHJlZmVyZW5jZSBvYmplY3RcbkBwYXJhbSB7U3RyaW5nfSB2ZXJzaW9uIC0gW09wdGlvbmFsXSBWZXJzaW9uIG9mIGZpbGUgeW91IHdvdWxkIGxpa2UgYnVpbGQgVVJMIGZvclxuQHBhcmFtIHtCb29sZWFufSAgcHViICAgLSBbT3B0aW9uYWxdIGlzIGZpbGUgbG9jYXRlZCBpbiBwdWJsaWNpdHkgYXZhaWxhYmxlIGZvbGRlcj9cbkBzdW1tYXJ5IFJldHVybnMgZm9ybWF0dGVkIFVSTCBmb3IgZmlsZVxuQHJldHVybnMge1N0cmluZ30gRG93bmxvYWRhYmxlIGxpbmtcbiMjI1xuZm9ybWF0RmxlVVJMID0gKGZpbGVSZWYsIHZlcnNpb24gPSAnb3JpZ2luYWwnKSAtPlxuICByb290ID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5ST09UX1VSTC5yZXBsYWNlKC9cXC8rJC8sICcnKVxuXG4gIGlmIGZpbGVSZWY/LmV4dGVuc2lvbj8ubGVuZ3RoID4gMFxuICAgIGV4dCA9ICcuJyArIGZpbGVSZWYuZXh0ZW5zaW9uXG4gIGVsc2VcbiAgICBleHQgPSAnJ1xuXG4gIGlmIGZpbGVSZWYucHVibGljIGlzIHRydWVcbiAgICByZXR1cm4gcm9vdCArIChpZiB2ZXJzaW9uIGlzICdvcmlnaW5hbCcgdGhlbiBcIiN7ZmlsZVJlZi5fZG93bmxvYWRSb3V0ZX0vI3tmaWxlUmVmLl9pZH0je2V4dH1cIiBlbHNlIFwiI3tmaWxlUmVmLl9kb3dubG9hZFJvdXRlfS8je3ZlcnNpb259LSN7ZmlsZVJlZi5faWR9I3tleHR9XCIpXG4gIGVsc2VcbiAgICByZXR1cm4gcm9vdCArIFwiI3tmaWxlUmVmLl9kb3dubG9hZFJvdXRlfS8je2ZpbGVSZWYuX2NvbGxlY3Rpb25OYW1lfS8je2ZpbGVSZWYuX2lkfS8je3ZlcnNpb259LyN7ZmlsZVJlZi5faWR9I3tleHR9XCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICMjI1xuICBAbG9jdXMgQ2xpZW50XG4gIEBUZW1wbGF0ZUhlbHBlclxuICBAbmFtZSBmaWxlVVJMXG4gIEBwYXJhbSB7T2JqZWN0fSBmaWxlUmVmIC0gRmlsZSByZWZlcmVuY2Ugb2JqZWN0XG4gIEBwYXJhbSB7U3RyaW5nfSB2ZXJzaW9uIC0gW09wdGlvbmFsXSBWZXJzaW9uIG9mIGZpbGUgeW91IHdvdWxkIGxpa2UgdG8gcmVxdWVzdFxuICBAc3VtbWFyeSBHZXQgZG93bmxvYWQgVVJMIGZvciBmaWxlIGJ5IGZpbGVSZWYsIGV2ZW4gd2l0aG91dCBzdWJzY3JpcHRpb25cbiAgQGV4YW1wbGUge3tmaWxlVVJMIGZpbGVSZWZ9fVxuICBAcmV0dXJucyB7U3RyaW5nfVxuICAjIyNcbiAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ2ZpbGVVUkwnLCAoZmlsZVJlZiwgdmVyc2lvbikgLT5cbiAgICByZXR1cm4gdW5kZWZpbmVkIGlmIG5vdCBmaWxlUmVmIG9yIG5vdCBfLmlzT2JqZWN0IGZpbGVSZWZcbiAgICB2ZXJzaW9uID0gaWYgbm90IHZlcnNpb24gb3Igbm90IF8uaXNTdHJpbmcodmVyc2lvbikgdGhlbiAnb3JpZ2luYWwnIGVsc2UgdmVyc2lvblxuICAgIGlmIGZpbGVSZWYuX2lkXG4gICAgICByZXR1cm4gZm9ybWF0RmxlVVJMIGZpbGVSZWYsIHZlcnNpb25cbiAgICBlbHNlXG4gICAgICByZXR1cm4gJydcblxuTWV0ZW9yLkZpbGVzID0gRmlsZXNDb2xsZWN0aW9uIl19
