(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var FS = Package['cfs:base-package'].FS;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cfs:gridfs":{"gridfs.server.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cfs_gridfs/gridfs.server.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var path = Npm.require('path');

var mongodb = Npm.require('mongodb');

var ObjectID = Npm.require('mongodb').ObjectID;

var Grid = Npm.require('gridfs-stream'); //var Grid = Npm.require('gridfs-locking-stream');


var chunkSize = 1024 * 1024 * 2; // 256k is default GridFS chunk size, but performs terribly for largish files

/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {FS.StorageAdapter} An instance of FS.StorageAdapter.
 *
 * Creates a GridFS store instance on the server. Inherits from FS.StorageAdapter
 * type.
 */

FS.Store.GridFS = function (name, options) {
  var self = this;
  options = options || {};
  var gridfsName = name;
  var mongoOptions = options.mongoOptions || {};
  if (!(self instanceof FS.Store.GridFS)) throw new Error('FS.Store.GridFS missing keyword "new"');

  if (!options.mongoUrl) {
    options.mongoUrl = process.env.MONGO_URL; // When using a Meteor MongoDB instance, preface name with "cfs_gridfs."

    gridfsName = "cfs_gridfs." + name;
  }

  if (!options.mongoOptions) {
    options.mongoOptions = {
      db: {
        native_parser: true
      },
      server: {
        auto_reconnect: true
      }
    };
  }

  if (options.chunkSize) {
    chunkSize = options.chunkSize;
  }

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.gridfs',
    fileKey: function (fileObj) {
      // We should not have to mount the file here - We assume its taken
      // care of - Otherwise we create new files instead of overwriting
      var key = {
        _id: null,
        filename: null
      }; // If we're passed a fileObj, we retrieve the _id and filename from it.

      if (fileObj) {
        var info = fileObj._getInfo(name, {
          updateFileRecordFirst: false
        });

        key._id = info.key || null;
        key.filename = info.name || fileObj.name({
          updateFileRecordFirst: false
        }) || fileObj.collectionName + '-' + fileObj._id;
      } // If key._id is null at this point, createWriteStream will let GridFS generate a new ID


      return key;
    },
    createReadStream: function (fileKey, options) {
      options = options || {}; // Init GridFS

      var gfs = new Grid(self.db, mongodb); // Set the default streamning settings

      var settings = {
        _id: new ObjectID(fileKey._id),
        root: gridfsName
      }; // Check if this should be a partial read

      if (typeof options.start !== 'undefined' && typeof options.end !== 'undefined') {
        // Add partial info
        settings.range = {
          startPos: options.start,
          endPos: options.end
        };
      }

      FS.debug && console.log('GRIDFS', settings);
      return gfs.createReadStream(settings);
    },
    createWriteStream: function (fileKey, options) {
      options = options || {}; // Init GridFS

      var gfs = new Grid(self.db, mongodb);
      var opts = {
        filename: fileKey.filename,
        mode: 'w',
        root: gridfsName,
        chunk_size: options.chunk_size || chunkSize,
        // We allow aliases, metadata and contentType to be passed in via
        // options
        aliases: options.aliases || [],
        metadata: options.metadata || null,
        content_type: options.contentType || 'application/octet-stream'
      };

      if (fileKey._id) {
        opts._id = new ObjectID(fileKey._id);
      }

      var writeStream = gfs.createWriteStream(opts);
      writeStream.on('close', function (file) {
        if (!file) {
          // gridfs-stream will emit "close" without passing a file
          // if there is an error. We can simply exit here because
          // the "error" listener will also be called in this case.
          return;
        }

        if (FS.debug) console.log('SA GridFS - DONE!'); // Emit end and return the fileKey, size, and updated date

        writeStream.emit('stored', {
          // Set the generated _id so that we know it for future reads and writes.
          // We store the _id as a string and only convert to ObjectID right before
          // reading, writing, or deleting. If we store the ObjectID itself,
          // Meteor (EJSON?) seems to convert it to a LocalCollection.ObjectID,
          // which GFS doesn't understand.
          fileKey: file._id.toString(),
          size: file.length,
          storedAt: file.uploadDate || new Date()
        });
      });
      writeStream.on('error', function (error) {
        console.log('SA GridFS - ERROR!', error);
      });
      return writeStream;
    },
    remove: function (fileKey, callback) {
      // Init GridFS
      var gfs = new Grid(self.db, mongodb);

      try {
        gfs.remove({
          _id: new ObjectID(fileKey._id),
          root: gridfsName
        }, callback);
      } catch (err) {
        callback(err);
      }
    },
    // Not implemented
    watch: function () {
      throw new Error("GridFS storage adapter does not support the sync option");
    },
    init: function (callback) {
      mongodb.MongoClient.connect(options.mongoUrl, mongoOptions, function (err, db) {
        if (err) {
          return callback(err);
        }

        self.db = db;
        callback(null);
      });
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/cfs:gridfs/gridfs.server.js");

/* Exports */
Package._define("cfs:gridfs");

})();

//# sourceURL=meteor://💻app/packages/cfs_gridfs.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY2ZzOmdyaWRmcy9ncmlkZnMuc2VydmVyLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJOcG0iLCJyZXF1aXJlIiwibW9uZ29kYiIsIk9iamVjdElEIiwiR3JpZCIsImNodW5rU2l6ZSIsIkZTIiwiU3RvcmUiLCJHcmlkRlMiLCJuYW1lIiwib3B0aW9ucyIsInNlbGYiLCJncmlkZnNOYW1lIiwibW9uZ29PcHRpb25zIiwiRXJyb3IiLCJtb25nb1VybCIsInByb2Nlc3MiLCJlbnYiLCJNT05HT19VUkwiLCJkYiIsIm5hdGl2ZV9wYXJzZXIiLCJzZXJ2ZXIiLCJhdXRvX3JlY29ubmVjdCIsIlN0b3JhZ2VBZGFwdGVyIiwidHlwZU5hbWUiLCJmaWxlS2V5IiwiZmlsZU9iaiIsImtleSIsIl9pZCIsImZpbGVuYW1lIiwiaW5mbyIsIl9nZXRJbmZvIiwidXBkYXRlRmlsZVJlY29yZEZpcnN0IiwiY29sbGVjdGlvbk5hbWUiLCJjcmVhdGVSZWFkU3RyZWFtIiwiZ2ZzIiwic2V0dGluZ3MiLCJyb290Iiwic3RhcnQiLCJlbmQiLCJyYW5nZSIsInN0YXJ0UG9zIiwiZW5kUG9zIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvcHRzIiwibW9kZSIsImNodW5rX3NpemUiLCJhbGlhc2VzIiwibWV0YWRhdGEiLCJjb250ZW50X3R5cGUiLCJjb250ZW50VHlwZSIsIndyaXRlU3RyZWFtIiwib24iLCJmaWxlIiwiZW1pdCIsInRvU3RyaW5nIiwic2l6ZSIsImxlbmd0aCIsInN0b3JlZEF0IiwidXBsb2FkRGF0ZSIsIkRhdGUiLCJlcnJvciIsInJlbW92ZSIsImNhbGxiYWNrIiwiZXJyIiwid2F0Y2giLCJpbml0IiwiTW9uZ29DbGllbnQiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsSUFBSSxHQUFHQyxHQUFHLENBQUNDLE9BQUosQ0FBWSxNQUFa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QyxXQUFHLENBQUM4QixNQUFKLENBQVc7QUFBRXJDLGFBQUcsRUFBRSxJQUFJekIsUUFBSixDQUFhc0IsT0FBTyxDQUFDRyxHQUFyQixDQUFQO0FBQWtDUyxjQUFJLEVBQUV6QjtBQUF4QyxTQUFYLEVBQWlFc0QsUUFBakU7QUFDRCxPQUZELENBRUUsT0FBTUMsR0FBTixFQUFXO0FBQ1hELGdCQUFRLENBQUNDLEdBQUQsQ0FBUjtBQUNEO0FBQ0YsS0E5R3lDO0FBZ0gxQztBQUNBQyxTQUFLLEVBQUUsWUFBVztBQUNoQixZQUFNLElBQUl0RCxLQUFKLENBQVUseURBQVYsQ0FBTjtBQUNELEtBbkh5QztBQXFIMUN1RCxRQUFJLEVBQUUsVUFBU0gsUUFBVCxFQUFtQjtBQUN2QmhFLGFBQU8sQ0FBQ29FLFdBQVIsQ0FBb0JDLE9BQXBCLENBQTRCN0QsT0FBTyxDQUFDSyxRQUFwQyxFQUE4Q0YsWUFBOUMsRUFBNEQsVUFBVXNELEdBQVYsRUFBZWhELEVBQWYsRUFBbUI7QUFDN0UsWUFBSWdELEdBQUosRUFBUztBQUFFLGlCQUFPRCxRQUFRLENBQUNDLEdBQUQsQ0FBZjtBQUF1Qjs7QUFDbEN4RCxZQUFJLENBQUNRLEVBQUwsR0FBVUEsRUFBVjtBQUNBK0MsZ0JBQVEsQ0FBQyxJQUFELENBQVI7QUFDRCxPQUpEO0FBS0Q7QUEzSHlDLEdBQXJDLENBQVA7QUE2SEQsQ0FySkQsQyIsImZpbGUiOiIvcGFja2FnZXMvY2ZzX2dyaWRmcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBwYXRoID0gTnBtLnJlcXVpcmUoJ3BhdGgnKTtcbnZhciBtb25nb2RiID0gTnBtLnJlcXVpcmUoJ21vbmdvZGInKTtcbnZhciBPYmplY3RJRCA9IE5wbS5yZXF1aXJlKCdtb25nb2RiJykuT2JqZWN0SUQ7XG52YXIgR3JpZCA9IE5wbS5yZXF1aXJlKCdncmlkZnMtc3RyZWFtJyk7XG4vL3ZhciBHcmlkID0gTnBtLnJlcXVpcmUoJ2dyaWRmcy1sb2NraW5nLXN0cmVhbScpO1xuXG52YXIgY2h1bmtTaXplID0gMTAyNCoxMDI0KjI7IC8vIDI1NmsgaXMgZGVmYXVsdCBHcmlkRlMgY2h1bmsgc2l6ZSwgYnV0IHBlcmZvcm1zIHRlcnJpYmx5IGZvciBsYXJnaXNoIGZpbGVzXG5cbi8qKlxuICogQHB1YmxpY1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBzdG9yZSBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuYmVmb3JlU2F2ZV0gLSBGdW5jdGlvbiB0byBydW4gYmVmb3JlIHNhdmluZyBhIGZpbGUgZnJvbSB0aGUgc2VydmVyLiBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24gd2lsbCBiZSB0aGUgYEZTLkZpbGVgIGluc3RhbmNlIHdlJ3JlIHNhdmluZy4gVGhlIGZ1bmN0aW9uIG1heSBhbHRlciBpdHMgcHJvcGVydGllcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhUcmllcz01XSAtIE1heCB0aW1lcyB0byBhdHRlbXB0IHNhdmluZyBhIGZpbGVcbiAqIEByZXR1cm5zIHtGUy5TdG9yYWdlQWRhcHRlcn0gQW4gaW5zdGFuY2Ugb2YgRlMuU3RvcmFnZUFkYXB0ZXIuXG4gKlxuICogQ3JlYXRlcyBhIEdyaWRGUyBzdG9yZSBpbnN0YW5jZSBvbiB0aGUgc2VydmVyLiBJbmhlcml0cyBmcm9tIEZTLlN0b3JhZ2VBZGFwdGVyXG4gKiB0eXBlLlxuICovXG5cbkZTLlN0b3JlLkdyaWRGUyA9IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgZ3JpZGZzTmFtZSA9IG5hbWU7XG4gIHZhciBtb25nb09wdGlvbnMgPSBvcHRpb25zLm1vbmdvT3B0aW9ucyB8fCB7fTtcblxuICBpZiAoIShzZWxmIGluc3RhbmNlb2YgRlMuU3RvcmUuR3JpZEZTKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLkdyaWRGUyBtaXNzaW5nIGtleXdvcmQgXCJuZXdcIicpO1xuXG4gIGlmICghb3B0aW9ucy5tb25nb1VybCkge1xuICAgIG9wdGlvbnMubW9uZ29VcmwgPSBwcm9jZXNzLmVudi5NT05HT19VUkw7XG4gICAgLy8gV2hlbiB1c2luZyBhIE1ldGVvciBNb25nb0RCIGluc3RhbmNlLCBwcmVmYWNlIG5hbWUgd2l0aCBcImNmc19ncmlkZnMuXCJcbiAgICBncmlkZnNOYW1lID0gXCJjZnNfZ3JpZGZzLlwiICsgbmFtZTtcbiAgfVxuXG4gIGlmICghb3B0aW9ucy5tb25nb09wdGlvbnMpIHtcbiAgICBvcHRpb25zLm1vbmdvT3B0aW9ucyA9IHsgZGI6IHsgbmF0aXZlX3BhcnNlcjogdHJ1ZSB9LCBzZXJ2ZXI6IHsgYXV0b19yZWNvbm5lY3Q6IHRydWUgfX07XG4gIH1cblxuICBpZiAob3B0aW9ucy5jaHVua1NpemUpIHtcbiAgICBjaHVua1NpemUgPSBvcHRpb25zLmNodW5rU2l6ZTtcbiAgfVxuXG4gIHJldHVybiBuZXcgRlMuU3RvcmFnZUFkYXB0ZXIobmFtZSwgb3B0aW9ucywge1xuXG4gICAgdHlwZU5hbWU6ICdzdG9yYWdlLmdyaWRmcycsXG4gICAgZmlsZUtleTogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgLy8gV2Ugc2hvdWxkIG5vdCBoYXZlIHRvIG1vdW50IHRoZSBmaWxlIGhlcmUgLSBXZSBhc3N1bWUgaXRzIHRha2VuXG4gICAgICAvLyBjYXJlIG9mIC0gT3RoZXJ3aXNlIHdlIGNyZWF0ZSBuZXcgZmlsZXMgaW5zdGVhZCBvZiBvdmVyd3JpdGluZ1xuICAgICAgdmFyIGtleSA9IHtcbiAgICAgICAgX2lkOiBudWxsLFxuICAgICAgICBmaWxlbmFtZTogbnVsbFxuICAgICAgfTtcblxuICAgICAgLy8gSWYgd2UncmUgcGFzc2VkIGEgZmlsZU9iaiwgd2UgcmV0cmlldmUgdGhlIF9pZCBhbmQgZmlsZW5hbWUgZnJvbSBpdC5cbiAgICAgIGlmIChmaWxlT2JqKSB7XG4gICAgICAgIHZhciBpbmZvID0gZmlsZU9iai5fZ2V0SW5mbyhuYW1lLCB7dXBkYXRlRmlsZVJlY29yZEZpcnN0OiBmYWxzZX0pO1xuICAgICAgICBrZXkuX2lkID0gaW5mby5rZXkgfHwgbnVsbDtcbiAgICAgICAga2V5LmZpbGVuYW1lID0gaW5mby5uYW1lIHx8IGZpbGVPYmoubmFtZSh7dXBkYXRlRmlsZVJlY29yZEZpcnN0OiBmYWxzZX0pIHx8IChmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBrZXkuX2lkIGlzIG51bGwgYXQgdGhpcyBwb2ludCwgY3JlYXRlV3JpdGVTdHJlYW0gd2lsbCBsZXQgR3JpZEZTIGdlbmVyYXRlIGEgbmV3IElEXG4gICAgICByZXR1cm4ga2V5O1xuICAgIH0sXG4gICAgY3JlYXRlUmVhZFN0cmVhbTogZnVuY3Rpb24oZmlsZUtleSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIC8vIEluaXQgR3JpZEZTXG4gICAgICB2YXIgZ2ZzID0gbmV3IEdyaWQoc2VsZi5kYiwgbW9uZ29kYik7XG5cbiAgICAgIC8vIFNldCB0aGUgZGVmYXVsdCBzdHJlYW1uaW5nIHNldHRpbmdzXG4gICAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICAgIF9pZDogbmV3IE9iamVjdElEKGZpbGVLZXkuX2lkKSxcbiAgICAgICAgcm9vdDogZ3JpZGZzTmFtZVxuICAgICAgfTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgYSBwYXJ0aWFsIHJlYWRcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zdGFydCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdGlvbnMuZW5kICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgLy8gQWRkIHBhcnRpYWwgaW5mb1xuICAgICAgICBzZXR0aW5ncy5yYW5nZSA9IHtcbiAgICAgICAgICBzdGFydFBvczogb3B0aW9ucy5zdGFydCxcbiAgICAgICAgICBlbmRQb3M6IG9wdGlvbnMuZW5kXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdHUklERlMnLCBzZXR0aW5ncyk7XG5cbiAgICAgIHJldHVybiBnZnMuY3JlYXRlUmVhZFN0cmVhbShzZXR0aW5ncyk7XG5cbiAgICB9LFxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgLy8gSW5pdCBHcmlkRlNcbiAgICAgIHZhciBnZnMgPSBuZXcgR3JpZChzZWxmLmRiLCBtb25nb2RiKTtcblxuICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgIGZpbGVuYW1lOiBmaWxlS2V5LmZpbGVuYW1lLFxuICAgICAgICBtb2RlOiAndycsXG4gICAgICAgIHJvb3Q6IGdyaWRmc05hbWUsXG4gICAgICAgIGNodW5rX3NpemU6IG9wdGlvbnMuY2h1bmtfc2l6ZSB8fCBjaHVua1NpemUsXG4gICAgICAgIC8vIFdlIGFsbG93IGFsaWFzZXMsIG1ldGFkYXRhIGFuZCBjb250ZW50VHlwZSB0byBiZSBwYXNzZWQgaW4gdmlhXG4gICAgICAgIC8vIG9wdGlvbnNcbiAgICAgICAgYWxpYXNlczogb3B0aW9ucy5hbGlhc2VzIHx8IFtdLFxuICAgICAgICBtZXRhZGF0YTogb3B0aW9ucy5tZXRhZGF0YSB8fCBudWxsLFxuICAgICAgICBjb250ZW50X3R5cGU6IG9wdGlvbnMuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICAgIH07XG5cbiAgICAgIGlmIChmaWxlS2V5Ll9pZCkge1xuICAgICAgICBvcHRzLl9pZCA9IG5ldyBPYmplY3RJRChmaWxlS2V5Ll9pZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB3cml0ZVN0cmVhbSA9IGdmcy5jcmVhdGVXcml0ZVN0cmVhbShvcHRzKTtcblxuICAgICAgd3JpdGVTdHJlYW0ub24oJ2Nsb3NlJywgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAvLyBncmlkZnMtc3RyZWFtIHdpbGwgZW1pdCBcImNsb3NlXCIgd2l0aG91dCBwYXNzaW5nIGEgZmlsZVxuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIGVycm9yLiBXZSBjYW4gc2ltcGx5IGV4aXQgaGVyZSBiZWNhdXNlXG4gICAgICAgICAgLy8gdGhlIFwiZXJyb3JcIiBsaXN0ZW5lciB3aWxsIGFsc28gYmUgY2FsbGVkIGluIHRoaXMgY2FzZS5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKCdTQSBHcmlkRlMgLSBET05FIScpO1xuXG4gICAgICAgIC8vIEVtaXQgZW5kIGFuZCByZXR1cm4gdGhlIGZpbGVLZXksIHNpemUsIGFuZCB1cGRhdGVkIGRhdGVcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnc3RvcmVkJywge1xuICAgICAgICAgIC8vIFNldCB0aGUgZ2VuZXJhdGVkIF9pZCBzbyB0aGF0IHdlIGtub3cgaXQgZm9yIGZ1dHVyZSByZWFkcyBhbmQgd3JpdGVzLlxuICAgICAgICAgIC8vIFdlIHN0b3JlIHRoZSBfaWQgYXMgYSBzdHJpbmcgYW5kIG9ubHkgY29udmVydCB0byBPYmplY3RJRCByaWdodCBiZWZvcmVcbiAgICAgICAgICAvLyByZWFkaW5nLCB3cml0aW5nLCBvciBkZWxldGluZy4gSWYgd2Ugc3RvcmUgdGhlIE9iamVjdElEIGl0c2VsZixcbiAgICAgICAgICAvLyBNZXRlb3IgKEVKU09OPykgc2VlbXMgdG8gY29udmVydCBpdCB0byBhIExvY2FsQ29sbGVjdGlvbi5PYmplY3RJRCxcbiAgICAgICAgICAvLyB3aGljaCBHRlMgZG9lc24ndCB1bmRlcnN0YW5kLlxuICAgICAgICAgIGZpbGVLZXk6IGZpbGUuX2lkLnRvU3RyaW5nKCksXG4gICAgICAgICAgc2l6ZTogZmlsZS5sZW5ndGgsXG4gICAgICAgICAgc3RvcmVkQXQ6IGZpbGUudXBsb2FkRGF0ZSB8fCBuZXcgRGF0ZSgpXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTQSBHcmlkRlMgLSBFUlJPUiEnLCBlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHdyaXRlU3RyZWFtO1xuXG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGZpbGVLZXksIGNhbGxiYWNrKSB7XG4gICAgICAvLyBJbml0IEdyaWRGU1xuICAgICAgdmFyIGdmcyA9IG5ldyBHcmlkKHNlbGYuZGIsIG1vbmdvZGIpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBnZnMucmVtb3ZlKHsgX2lkOiBuZXcgT2JqZWN0SUQoZmlsZUtleS5faWQpLCByb290OiBncmlkZnNOYW1lIH0sIGNhbGxiYWNrKTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIE5vdCBpbXBsZW1lbnRlZFxuICAgIHdhdGNoOiBmdW5jdGlvbigpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdyaWRGUyBzdG9yYWdlIGFkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgc3luYyBvcHRpb25cIik7XG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICBtb25nb2RiLk1vbmdvQ2xpZW50LmNvbm5lY3Qob3B0aW9ucy5tb25nb1VybCwgbW9uZ29PcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBkYikge1xuICAgICAgICBpZiAoZXJyKSB7IHJldHVybiBjYWxsYmFjayhlcnIpOyB9XG4gICAgICAgIHNlbGYuZGIgPSBkYjtcbiAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbiJdfQ==
