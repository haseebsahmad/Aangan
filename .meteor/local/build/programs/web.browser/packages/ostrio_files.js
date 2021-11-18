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
var Template = Package['templating-runtime'].Template;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var SHA256 = Package.sha.SHA256;
var Random = Package.random.Random;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare, FilesCollection;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/event-emitter.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);
                i = listeners.length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/ostrio_files/files.coffee.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("ostrio:files", {
  FilesCollection: FilesCollection
});

})();
