(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"ostrio:cookies":{"cookies.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/ostrio_cookies/cookies.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Cookies: () => Cookies
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let fetch;
let WebApp;

if (Meteor.isServer) {
  WebApp = require('meteor/webapp').WebApp;
} else {
  fetch = require('meteor/fetch').fetch;
}

const NoOp = () => {};

const urlRE = /\/___cookie___\/set/;
const rootUrl = Meteor.isServer ? process.env.ROOT_URL : window.__meteor_runtime_config__.ROOT_URL || window.__meteor_runtime_config__.meteorEnv.ROOT_URL || false;
const mobileRootUrl = Meteor.isServer ? process.env.MOBILE_ROOT_URL : window.__meteor_runtime_config__.MOBILE_ROOT_URL || window.__meteor_runtime_config__.meteorEnv.MOBILE_ROOT_URL || false;
const helpers = {
  isUndefined(obj) {
    return obj === void 0;
  },

  isArray(obj) {
    return Array.isArray(obj);
  },

  clone(obj) {
    if (!this.isObject(obj)) return obj;
    return this.isArray(obj) ? obj.slice() : Object.assign({}, obj);
  }

};
const _helpers = ['Number', 'Object', 'Function'];

for (let i = 0; i < _helpers.length; i++) {
  helpers['is' + _helpers[i]] = function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + _helpers[i] + ']';
  };
}
/*
 * @url https://github.com/jshttp/cookie/blob/master/index.js
 * @name cookie
 * @author jshttp
 * @license
 * (The MIT License)
 *
 * Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com>
 * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


const decode = decodeURIComponent;
const encode = encodeURIComponent;
const pairSplitRegExp = /; */;
/*
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
/*
 * @function
 * @name tryDecode
 * @param {String} str
 * @param {Function} d
 * @summary Try decoding a string using a decoding function.
 * @private
 */

const tryDecode = (str, d) => {
  try {
    return d(str);
  } catch (e) {
    return str;
  }
};
/*
 * @function
 * @name parse
 * @param {String} str
 * @param {Object} [options]
 * @return {Object}
 * @summary
 * Parse a cookie header.
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 * @private
 */


const parse = (str, options) => {
  if (typeof str !== 'string') {
    throw new Meteor.Error(404, 'argument str must be a string');
  }

  const obj = {};
  const opt = options || {};
  let val;
  let key;
  let eqIndx;
  str.split(pairSplitRegExp).forEach(pair => {
    eqIndx = pair.indexOf('=');

    if (eqIndx < 0) {
      return;
    }

    key = pair.substr(0, eqIndx).trim();
    key = tryDecode(unescape(key), opt.decode || decode);
    val = pair.substr(++eqIndx, pair.length).trim();

    if (val[0] === '"') {
      val = val.slice(1, -1);
    }

    if (void 0 === obj[key]) {
      obj[key] = tryDecode(val, opt.decode || decode);
    }
  });
  return obj;
};
/*
 * @function
 * @name antiCircular
 * @param data {Object} - Circular or any other object which needs to be non-circular
 * @private
 */


const antiCircular = _obj => {
  const object = helpers.clone(_obj);
  const cache = new Map();
  return JSON.stringify(object, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.get(value)) {
        return void 0;
      }

      cache.set(value, true);
    }

    return value;
  });
};
/*
 * @function
 * @name serialize
 * @param {String} name
 * @param {String} val
 * @param {Object} [options]
 * @return { cookieString: String, sanitizedValue: Mixed }
 * @summary
 * Serialize data into a cookie header.
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 * serialize('foo', 'bar', { httpOnly: true }) => "foo=bar; httpOnly"
 * @private
 */


const serialize = function (key, val) {
  let opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let name;

  if (!fieldContentRegExp.test(key)) {
    name = escape(key);
  } else {
    name = key;
  }

  let sanitizedValue = val;
  let value = val;

  if (!helpers.isUndefined(value)) {
    if (helpers.isObject(value) || helpers.isArray(value)) {
      const stringified = antiCircular(value);
      value = encode("JSON.parse(".concat(stringified, ")"));
      sanitizedValue = JSON.parse(stringified);
    } else {
      value = encode(value);

      if (value && !fieldContentRegExp.test(value)) {
        value = escape(value);
      }
    }
  } else {
    value = '';
  }

  const pairs = ["".concat(name, "=").concat(value)];

  if (helpers.isNumber(opt.maxAge)) {
    pairs.push("Max-Age=".concat(opt.maxAge));
  }

  if (opt.domain && typeof opt.domain === 'string') {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new Meteor.Error(404, 'option domain is invalid');
    }

    pairs.push("Domain=".concat(opt.domain));
  }

  if (opt.path && typeof opt.path === 'string') {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new Meteor.Error(404, 'option path is invalid');
    }

    pairs.push("Path=".concat(opt.path));
  } else {
    pairs.push('Path=/');
  }

  opt.expires = opt.expires || opt.expire || false;

  if (opt.expires === Infinity) {
    pairs.push('Expires=Fri, 31 Dec 9999 23:59:59 GMT');
  } else if (opt.expires instanceof Date) {
    pairs.push("Expires=".concat(opt.expires.toUTCString()));
  } else if (opt.expires === 0) {
    pairs.push('Expires=0');
  } else if (helpers.isNumber(opt.expires)) {
    pairs.push("Expires=".concat(new Date(opt.expires).toUTCString()));
  }

  if (opt.httpOnly) {
    pairs.push('HttpOnly');
  }

  if (opt.secure) {
    pairs.push('Secure');
  }

  if (opt.firstPartyOnly) {
    pairs.push('First-Party-Only');
  }

  if (opt.sameSite) {
    pairs.push(opt.sameSite === true ? 'SameSite' : "SameSite=".concat(opt.sameSite));
  }

  return {
    cookieString: pairs.join('; '),
    sanitizedValue
  };
};

const isStringifiedRegEx = /JSON\.parse\((.*)\)/;
const isTypedRegEx = /false|true|null|undefined/;

const deserialize = string => {
  if (typeof string !== 'string') {
    return string;
  }

  if (isStringifiedRegEx.test(string)) {
    let obj = string.match(isStringifiedRegEx)[1];

    if (obj) {
      try {
        return JSON.parse(decode(obj));
      } catch (e) {
        console.error('[ostrio:cookies] [.get()] [deserialize()] Exception:', e, string, obj);
        return string;
      }
    }

    return string;
  } else if (isTypedRegEx.test(string)) {
    return JSON.parse(string);
  }

  return string;
};
/*
 * @locus Anywhere
 * @class __cookies
 * @param opts {Object} - Options (configuration) object
 * @param opts._cookies {Object|String} - Current cookies as String or Object
 * @param opts.TTL {Number|Boolean} - Default cookies expiration time (max-age) in milliseconds, by default - session (false)
 * @param opts.runOnServer {Boolean} - Expose Cookies class to Server
 * @param opts.response {http.ServerResponse|Object} - This object is created internally by a HTTP server
 * @param opts.allowQueryStringCookies {Boolean} - Allow passing Cookies in a query string (in URL). Primary should be used only in Cordova environment
 * @param opts.allowedCordovaOrigins {Regex|Boolean} - [Server] Allow setting Cookies from that specific origin which in Meteor/Cordova is localhost:12XXX (^http://localhost:12[0-9]{3}$)
 * @summary Internal Class
 */


class __cookies {
  constructor(opts) {
    this.__pendingCookies = [];
    this.TTL = opts.TTL || false;
    this.response = opts.response || false;
    this.runOnServer = opts.runOnServer || false;
    this.allowQueryStringCookies = opts.allowQueryStringCookies || false;
    this.allowedCordovaOrigins = opts.allowedCordovaOrigins || false;

    if (this.allowedCordovaOrigins === true) {
      this.allowedCordovaOrigins = /^http:\/\/localhost:12[0-9]{3}$/;
    }

    this.originRE = new RegExp("^https?://(".concat(rootUrl ? rootUrl : '').concat(mobileRootUrl ? '|' + mobileRootUrl : '', ")$"));

    if (helpers.isObject(opts._cookies)) {
      this.cookies = opts._cookies;
    } else {
      this.cookies = parse(opts._cookies);
    }
  }
  /*
   * @locus Anywhere
   * @memberOf __cookies
   * @name get
   * @param {String} key  - The name of the cookie to read
   * @param {String} _tmp - Unparsed string instead of user's cookies
   * @summary Read a cookie. If the cookie doesn't exist a null value will be returned.
   * @returns {String|void}
   */


  get(key, _tmp) {
    const cookieString = _tmp ? parse(_tmp) : this.cookies;

    if (!key || !cookieString) {
      return void 0;
    }

    if (cookieString.hasOwnProperty(key)) {
      return deserialize(cookieString[key]);
    }

    return void 0;
  }
  /*
   * @locus Anywhere
   * @memberOf __cookies
   * @name set
   * @param {String} key   - The name of the cookie to create/overwrite
   * @param {String} value - The value of the cookie
   * @param {Object} opts  - [Optional] Cookie options (see readme docs)
   * @summary Create/overwrite a cookie.
   * @returns {Boolean}
   */


  set(key, value) {
    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (key && !helpers.isUndefined(value)) {
      if (helpers.isNumber(this.TTL) && opts.expires === undefined) {
        opts.expires = new Date(+new Date() + this.TTL);
      }

      const {
        cookieString,
        sanitizedValue
      } = serialize(key, value, opts);
      this.cookies[key] = sanitizedValue;

      if (Meteor.isClient) {
        document.cookie = cookieString;
      } else if (this.response) {
        this.__pendingCookies.push(cookieString);

        this.response.setHeader('Set-Cookie', this.__pendingCookies);
      }

      return true;
    }

    return false;
  }
  /*
   * @locus Anywhere
   * @memberOf __cookies
   * @name remove
   * @param {String} key    - The name of the cookie to create/overwrite
   * @param {String} path   - [Optional] The path from where the cookie will be
   * readable. E.g., "/", "/mydir"; if not specified, defaults to the current
   * path of the current document location (string or null). The path must be
   * absolute (see RFC 2965). For more information on how to use relative paths
   * in this argument, see: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie#Using_relative_URLs_in_the_path_parameter
   * @param {String} domain - [Optional] The domain from where the cookie will
   * be readable. E.g., "example.com", ".example.com" (includes all subdomains)
   * or "subdomain.example.com"; if not specified, defaults to the host portion
   * of the current document location (string or null).
   * @summary Remove a cookie(s).
   * @returns {Boolean}
   */


  remove(key) {
    let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
    let domain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    if (key && this.cookies.hasOwnProperty(key)) {
      const {
        cookieString
      } = serialize(key, '', {
        domain,
        path,
        expires: new Date(0)
      });
      delete this.cookies[key];

      if (Meteor.isClient) {
        document.cookie = cookieString;
      } else if (this.response) {
        this.response.setHeader('Set-Cookie', cookieString);
      }

      return true;
    } else if (!key && this.keys().length > 0 && this.keys()[0] !== '') {
      const keys = Object.keys(this.cookies);

      for (let i = 0; i < keys.length; i++) {
        this.remove(keys[i]);
      }

      return true;
    }

    return false;
  }
  /*
   * @locus Anywhere
   * @memberOf __cookies
   * @name has
   * @param {String} key  - The name of the cookie to create/overwrite
   * @param {String} _tmp - Unparsed string instead of user's cookies
   * @summary Check whether a cookie exists in the current position.
   * @returns {Boolean}
   */


  has(key, _tmp) {
    const cookieString = _tmp ? parse(_tmp) : this.cookies;

    if (!key || !cookieString) {
      return false;
    }

    return cookieString.hasOwnProperty(key);
  }
  /*
   * @locus Anywhere
   * @memberOf __cookies
   * @name keys
   * @summary Returns an array of all readable cookies from this location.
   * @returns {[String]}
   */


  keys() {
    if (this.cookies) {
      return Object.keys(this.cookies);
    }

    return [];
  }
  /*
   * @locus Client
   * @memberOf __cookies
   * @name send
   * @param cb {Function} - Callback
   * @summary Send all cookies over XHR to server.
   * @returns {void}
   */


  send() {
    let cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NoOp;

    if (Meteor.isServer) {
      cb(new Meteor.Error(400, 'Can\'t run `.send()` on server, it\'s Client only method!'));
    }

    if (this.runOnServer) {
      let path = "".concat(window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || window.__meteor_runtime_config__.meteorEnv.ROOT_URL_PATH_PREFIX || '', "/___cookie___/set");
      let query = '';

      if (Meteor.isCordova && this.allowQueryStringCookies) {
        const cookiesKeys = this.keys();
        const cookiesArray = [];

        for (let i = 0; i < cookiesKeys.length; i++) {
          const {
            sanitizedValue
          } = serialize(cookiesKeys[i], this.get(cookiesKeys[i]));
          const pair = "".concat(cookiesKeys[i], "=").concat(sanitizedValue);

          if (!cookiesArray.includes(pair)) {
            cookiesArray.push(pair);
          }
        }

        if (cookiesArray.length) {
          path = Meteor.absoluteUrl('___cookie___/set');
          query = "?___cookies___=".concat(encodeURIComponent(cookiesArray.join('; ')));
        }
      }

      fetch("".concat(path).concat(query), {
        credentials: 'include',
        type: 'cors'
      }).then(response => {
        cb(void 0, response);
      }).catch(cb);
    } else {
      cb(new Meteor.Error(400, 'Can\'t send cookies on server when `runOnServer` is false.'));
    }

    return void 0;
  }

}
/*
 * @function
 * @locus Server
 * @summary Middleware handler
 * @private
 */


const __middlewareHandler = (request, response, opts) => {
  let _cookies = {};

  if (opts.runOnServer) {
    if (request.headers && request.headers.cookie) {
      _cookies = parse(request.headers.cookie);
    }

    return new __cookies({
      _cookies,
      TTL: opts.TTL,
      runOnServer: opts.runOnServer,
      response,
      allowQueryStringCookies: opts.allowQueryStringCookies
    });
  }

  throw new Meteor.Error(400, 'Can\'t use middleware when `runOnServer` is false.');
};
/*
 * @locus Anywhere
 * @class Cookies
 * @param opts {Object}
 * @param opts.TTL {Number} - Default cookies expiration time (max-age) in milliseconds, by default - session (false)
 * @param opts.auto {Boolean} - [Server] Auto-bind in middleware as `req.Cookies`, by default `true`
 * @param opts.handler {Function} - [Server] Middleware handler
 * @param opts.runOnServer {Boolean} - Expose Cookies class to Server
 * @param opts.allowQueryStringCookies {Boolean} - Allow passing Cookies in a query string (in URL). Primary should be used only in Cordova environment
 * @param opts.allowedCordovaOrigins {Regex|Boolean} - [Server] Allow setting Cookies from that specific origin which in Meteor/Cordova is localhost:12XXX (^http://localhost:12[0-9]{3}$)
 * @summary Main Cookie class
 */


class Cookies extends __cookies {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    opts.TTL = helpers.isNumber(opts.TTL) ? opts.TTL : false;
    opts.runOnServer = opts.runOnServer !== false ? true : false;
    opts.allowQueryStringCookies = opts.allowQueryStringCookies !== true ? false : true;

    if (Meteor.isClient) {
      opts._cookies = document.cookie;
      super(opts);
    } else {
      opts._cookies = {};
      super(opts);
      opts.auto = opts.auto !== false ? true : false;
      this.opts = opts;
      this.handler = helpers.isFunction(opts.handler) ? opts.handler : false;
      this.onCookies = helpers.isFunction(opts.onCookies) ? opts.onCookies : false;

      if (opts.runOnServer && !Cookies.isLoadedOnServer) {
        Cookies.isLoadedOnServer = true;

        if (opts.auto) {
          WebApp.connectHandlers.use((req, res, next) => {
            if (urlRE.test(req._parsedUrl.path)) {
              const matchedCordovaOrigin = !!req.headers.origin && this.allowedCordovaOrigins && this.allowedCordovaOrigins.test(req.headers.origin);
              const matchedOrigin = matchedCordovaOrigin || !!req.headers.origin && this.originRE.test(req.headers.origin);

              if (matchedOrigin) {
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
              }

              const cookiesArray = [];
              let cookiesObject = {};

              if (matchedCordovaOrigin && opts.allowQueryStringCookies && req.query.___cookies___) {
                cookiesObject = parse(decodeURIComponent(req.query.___cookies___));
              } else if (req.headers.cookie) {
                cookiesObject = parse(req.headers.cookie);
              }

              const cookiesKeys = Object.keys(cookiesObject);

              if (cookiesKeys.length) {
                for (let i = 0; i < cookiesKeys.length; i++) {
                  const {
                    cookieString
                  } = serialize(cookiesKeys[i], cookiesObject[cookiesKeys[i]]);

                  if (!cookiesArray.includes(cookieString)) {
                    cookiesArray.push(cookieString);
                  }
                }

                if (cookiesArray.length) {
                  res.setHeader('Set-Cookie', cookiesArray);
                }
              }

              helpers.isFunction(this.onCookies) && this.onCookies(__middlewareHandler(req, res, opts));
              res.writeHead(200);
              res.end('');
            } else {
              req.Cookies = __middlewareHandler(req, res, opts);
              helpers.isFunction(this.handler) && this.handler(req.Cookies);
              next();
            }
          });
        }
      }
    }
  }
  /*
   * @locus Server
   * @memberOf Cookies
   * @name middleware
   * @summary Get Cookies instance into callback
   * @returns {void}
   */


  middleware() {
    if (!Meteor.isServer) {
      throw new Meteor.Error(500, '[ostrio:cookies] Can\'t use `.middleware()` on Client, it\'s Server only!');
    }

    return (req, res, next) => {
      helpers.isFunction(this.handler) && this.handler(__middlewareHandler(req, res, this.opts));
      next();
    };
  }

}

if (Meteor.isServer) {
  Cookies.isLoadedOnServer = false;
}
/* Export the Cookies class */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/ostrio:cookies/cookies.js");

/* Exports */
Package._define("ostrio:cookies", exports);

})();

//# sourceURL=meteor://💻app/packages/ostrio_cookies.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvb3N0cmlvOmNvb2tpZXMvY29va2llcy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJDb29raWVzIiwiTWV0ZW9yIiwibGluayIsInYiLCJmZXRjaCIsIldlYkFwcCIsImlzU2VydmVyIiwicmVxdWlyZSIsIk5vT3AiLCJ1cmxSRSIsInJvb3RVcmwiLCJwcm9jZXNzIiwiZW52IiwiUk9PVF9VUkwiLCJ3aW5kb3ciLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwibWV0ZW9yRW52IiwibW9iaWxlUm9vdFVybCIsIk1PQklMRV9ST09UX1VSTCIsImhlbHBlcnMiLCJpc1VuZGVmaW5lZCIsIm9iaiIsImlzQXJyYXkiLCJBcnJheSIsImNsb25lIiwiaXNPYmplY3QiLCJzbGljZSIsIk9iamVjdCIsImFzc2lnbiIsIl9oZWxwZXJzIiwiaSIsImxlbmd0aCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImRlY29kZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImVuY29kZSIsImVuY29kZVVSSUNvbXBvbmVudCIsInBhaXJTcGxpdFJlZ0V4cCIsImZpZWxkQ29udGVudFJlZ0V4cCIsInRyeURlY29kZSIsInN0ciIsImQiLCJlIiwicGFyc2UiLCJvcHRpb25zIiwiRXJyb3IiLCJvcHQiLCJ2YWwiLCJrZXkiLCJlcUluZHgiLCJzcGxpdCIsImZvckVhY2giLCJwYWlyIiwiaW5kZXhPZiIsInN1YnN0ciIsInRyaW0iLCJ1bmVzY2FwZSIsImFudGlDaXJjdWxhciIsIl9vYmoiLCJvYmplY3QiLCJjYWNoZSIsIk1hcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ2YWx1ZSIsImdldCIsInNldCIsInNlcmlhbGl6ZSIsIm5hbWUiLCJ0ZXN0IiwiZXNjYXBlIiwic2FuaXRpemVkVmFsdWUiLCJzdHJpbmdpZmllZCIsInBhaXJzIiwiaXNOdW1iZXIiLCJtYXhBZ2UiLCJwdXNoIiwiZG9tYWluIiwicGF0aCIsImV4cGlyZXMiLCJleHBpcmUiLCJJbmZpbml0eSIsIkRhdGUiLCJ0b1VUQ1N0cmluZyIsImh0dHBPbmx5Iiwic2VjdXJlIiwiZmlyc3RQYXJ0eU9ubHkiLCJzYW1lU2l0ZSIsImNvb2tpZVN0cmluZyIsImpvaW4iLCJpc1N0cmluZ2lmaWVkUmVnRXgiLCJpc1R5cGVkUmVnRXgiLCJkZXNlcmlhbGl6ZSIsInN0cmluZyIsIm1hdGNoIiwiY29uc29sZSIsImVycm9yIiwiX19jb29raWVzIiwiY29uc3RydWN0b3IiLCJvcHRzIiwiX19wZW5kaW5nQ29va2llcyIsIlRUTCIsInJlc3BvbnNlIiwicnVuT25TZXJ2ZXIiLCJhbGxvd1F1ZXJ5U3RyaW5nQ29va2llcyIsImFsbG93ZWRDb3Jkb3ZhT3JpZ2lucyIsIm9yaWdpblJFIiwiUmVnRXhwIiwiX2Nvb2tpZXMiLCJjb29raWVzIiwiX3RtcCIsImhhc093blByb3BlcnR5IiwidW5kZWZpbmVkIiwiaXNDbGllbnQiLCJkb2N1bWVudCIsImNvb2tpZSIsInNldEhlYWRlciIsInJlbW92ZSIsImtleXMiLCJoYXMiLCJzZW5kIiwiY2IiLCJST09UX1VSTF9QQVRIX1BSRUZJWCIsInF1ZXJ5IiwiaXNDb3Jkb3ZhIiwiY29va2llc0tleXMiLCJjb29raWVzQXJyYXkiLCJpbmNsdWRlcyIsImFic29sdXRlVXJsIiwiY3JlZGVudGlhbHMiLCJ0eXBlIiwidGhlbiIsImNhdGNoIiwiX19taWRkbGV3YXJlSGFuZGxlciIsInJlcXVlc3QiLCJoZWFkZXJzIiwiYXV0byIsImhhbmRsZXIiLCJpc0Z1bmN0aW9uIiwib25Db29raWVzIiwiaXNMb2FkZWRPblNlcnZlciIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJfcGFyc2VkVXJsIiwibWF0Y2hlZENvcmRvdmFPcmlnaW4iLCJvcmlnaW4iLCJtYXRjaGVkT3JpZ2luIiwiY29va2llc09iamVjdCIsIl9fX2Nvb2tpZXNfX18iLCJ3cml0ZUhlYWQiLCJlbmQiLCJtaWRkbGV3YXJlIl0sIm1hcHBp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QU0sSUFBSUwsTUFBTSxDQUFDOEMsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwyRUFBdEIsQ0FBTjtBQUNEOztBQUVELFdBQU8sQ0FBQ2tHLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEtBQW9CO0FBQ3pCaEksYUFBTyxDQUFDeUgsVUFBUixDQUFtQixLQUFLRCxPQUF4QixLQUFvQyxLQUFLQSxPQUFMLENBQWFKLG1CQUFtQixDQUFDVSxHQUFELEVBQU1DLEdBQU4sRUFBVyxLQUFLN0MsSUFBaEIsQ0FBaEMsQ0FBcEM7QUFDQThDLFVBQUk7QUFDTCxLQUhEO0FBSUQ7O0FBdEY2Qjs7QUF5RmhDLElBQUlsSixNQUFNLENBQUNLLFFBQVgsRUFBcUI7QUFDbkJOLFNBQU8sQ0FBQzhJLGdCQUFSLEdBQTJCLEtBQTNCO0FBQ0Q7QUFFRCw4QiIsImZpbGUiOiIvcGFja2FnZXMvb3N0cmlvX2Nvb2tpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxubGV0IGZldGNoO1xubGV0IFdlYkFwcDtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBXZWJBcHAgPSByZXF1aXJlKCdtZXRlb3Ivd2ViYXBwJykuV2ViQXBwO1xufSBlbHNlIHtcbiAgZmV0Y2ggPSByZXF1aXJlKCdtZXRlb3IvZmV0Y2gnKS5mZXRjaDtcbn1cblxuY29uc3QgTm9PcCAgPSAoKSA9PiB7fTtcbmNvbnN0IHVybFJFID0gL1xcL19fX2Nvb2tpZV9fX1xcL3NldC87XG5jb25zdCByb290VXJsID0gTWV0ZW9yLmlzU2VydmVyID8gcHJvY2Vzcy5lbnYuUk9PVF9VUkwgOiAod2luZG93Ll9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkwgfHwgd2luZG93Ll9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18ubWV0ZW9yRW52LlJPT1RfVVJMIHx8IGZhbHNlKTtcbmNvbnN0IG1vYmlsZVJvb3RVcmwgPSBNZXRlb3IuaXNTZXJ2ZXIgPyBwcm9jZXNzLmVudi5NT0JJTEVfUk9PVF9VUkwgOiAod2luZG93Ll9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uTU9CSUxFX1JPT1RfVVJMIHx8IHdpbmRvdy5fX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLm1ldGVvckVudi5NT0JJTEVfUk9PVF9VUkwgfHwgZmFsc2UpO1xuXG5jb25zdCBoZWxwZXJzID0ge1xuICBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH0sXG4gIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbiAgfSxcbiAgY2xvbmUob2JqKSB7XG4gICAgaWYgKCF0aGlzLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIHRoaXMuaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBPYmplY3QuYXNzaWduKHt9LCBvYmopO1xuICB9XG59O1xuY29uc3QgX2hlbHBlcnMgPSBbJ051bWJlcicsICdPYmplY3QnLCAnRnVuY3Rpb24nXTtcbmZvciAobGV0IGkgPSAwOyBpIDwgX2hlbHBlcnMubGVuZ3RoOyBpKyspIHtcbiAgaGVscGVyc1snaXMnICsgX2hlbHBlcnNbaV1dID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIF9oZWxwZXJzW2ldICsgJ10nO1xuICB9O1xufVxuXG4vKlxuICogQHVybCBodHRwczovL2dpdGh1Yi5jb20vanNodHRwL2Nvb2tpZS9ibG9iL21hc3Rlci9pbmRleC5qc1xuICogQG5hbWUgY29va2llXG4gKiBAYXV0aG9yIGpzaHR0cFxuICogQGxpY2Vuc2VcbiAqIChUaGUgTUlUIExpY2Vuc2UpXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDEyLTIwMTQgUm9tYW4gU2h0eWxtYW4gPHNodHlsbWFuQGdtYWlsLmNvbT5cbiAqIENvcHlyaWdodCAoYykgMjAxNSBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvbiA8ZG91Z0Bzb21ldGhpbmdkb3VnLmNvbT5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogJ1NvZnR3YXJlJyksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuICogd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuICogZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZXG4gKiBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULFxuICogVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEVcbiAqIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5jb25zdCBkZWNvZGUgPSBkZWNvZGVVUklDb21wb25lbnQ7XG5jb25zdCBlbmNvZGUgPSBlbmNvZGVVUklDb21wb25lbnQ7XG5jb25zdCBwYWlyU3BsaXRSZWdFeHAgPSAvOyAqLztcblxuLypcbiAqIFJlZ0V4cCB0byBtYXRjaCBmaWVsZC1jb250ZW50IGluIFJGQyA3MjMwIHNlYyAzLjJcbiAqXG4gKiBmaWVsZC1jb250ZW50ID0gZmllbGQtdmNoYXIgWyAxKiggU1AgLyBIVEFCICkgZmllbGQtdmNoYXIgXVxuICogZmllbGQtdmNoYXIgICA9IFZDSEFSIC8gb2JzLXRleHRcbiAqIG9icy10ZXh0ICAgICAgPSAleDgwLUZGXG4gKi9cbmNvbnN0IGZpZWxkQ29udGVudFJlZ0V4cCA9IC9eW1xcdTAwMDlcXHUwMDIwLVxcdTAwN2VcXHUwMDgwLVxcdTAwZmZdKyQvO1xuXG4vKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSB0cnlEZWNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRcbiAqIEBzdW1tYXJ5IFRyeSBkZWNvZGluZyBhIHN0cmluZyB1c2luZyBhIGRlY29kaW5nIGZ1bmN0aW9uLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgdHJ5RGVjb2RlID0gKHN0ciwgZCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBkKHN0cik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59O1xuXG4vKlxuICogQGZ1bmN0aW9uXG4gKiBAbmFtZSBwYXJzZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHJldHVybiB7T2JqZWN0fVxuICogQHN1bW1hcnlcbiAqIFBhcnNlIGEgY29va2llIGhlYWRlci5cbiAqIFBhcnNlIHRoZSBnaXZlbiBjb29raWUgaGVhZGVyIHN0cmluZyBpbnRvIGFuIG9iamVjdFxuICogVGhlIG9iamVjdCBoYXMgdGhlIHZhcmlvdXMgY29va2llcyBhcyBrZXlzKG5hbWVzKSA9PiB2YWx1ZXNcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IHBhcnNlID0gKHN0ciwgb3B0aW9ucykgPT4ge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ2FyZ3VtZW50IHN0ciBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gIH1cbiAgY29uc3Qgb2JqID0ge307XG4gIGNvbnN0IG9wdCA9IG9wdGlvbnMgfHwge307XG4gIGxldCB2YWw7XG4gIGxldCBrZXk7XG4gIGxldCBlcUluZHg7XG5cbiAgc3RyLnNwbGl0KHBhaXJTcGxpdFJlZ0V4cCkuZm9yRWFjaCgocGFpcikgPT4ge1xuICAgIGVxSW5keCA9IHBhaXIuaW5kZXhPZignPScpO1xuICAgIGlmIChlcUluZHggPCAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGtleSA9IHBhaXIuc3Vic3RyKDAsIGVxSW5keCkudHJpbSgpO1xuICAgIGtleSA9IHRyeURlY29kZSh1bmVzY2FwZShrZXkpLCAob3B0LmRlY29kZSB8fCBkZWNvZGUpKTtcbiAgICB2YWwgPSBwYWlyLnN1YnN0cigrK2VxSW5keCwgcGFpci5sZW5ndGgpLnRyaW0oKTtcbiAgICBpZiAodmFsWzBdID09PSAnXCInKSB7XG4gICAgICB2YWwgPSB2YWwuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICBpZiAodm9pZCAwID09PSBvYmpba2V5XSkge1xuICAgICAgb2JqW2tleV0gPSB0cnlEZWNvZGUodmFsLCAob3B0LmRlY29kZSB8fCBkZWNvZGUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcblxuLypcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgYW50aUNpcmN1bGFyXG4gKiBAcGFyYW0gZGF0YSB7T2JqZWN0fSAtIENpcmN1bGFyIG9yIGFueSBvdGhlciBvYmplY3Qgd2hpY2ggbmVlZHMgdG8gYmUgbm9uLWNpcmN1bGFyXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBhbnRpQ2lyY3VsYXIgPSAoX29iaikgPT4ge1xuICBjb25zdCBvYmplY3QgPSBoZWxwZXJzLmNsb25lKF9vYmopO1xuICBjb25zdCBjYWNoZSAgPSBuZXcgTWFwKCk7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIChrZXksIHZhbHVlKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGlmIChjYWNoZS5nZXQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBjYWNoZS5zZXQodmFsdWUsIHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0pO1xufTtcblxuLypcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgc2VyaWFsaXplXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHJldHVybiB7IGNvb2tpZVN0cmluZzogU3RyaW5nLCBzYW5pdGl6ZWRWYWx1ZTogTWl4ZWQgfVxuICogQHN1bW1hcnlcbiAqIFNlcmlhbGl6ZSBkYXRhIGludG8gYSBjb29raWUgaGVhZGVyLlxuICogU2VyaWFsaXplIHRoZSBhIG5hbWUgdmFsdWUgcGFpciBpbnRvIGEgY29va2llIHN0cmluZyBzdWl0YWJsZSBmb3JcbiAqIGh0dHAgaGVhZGVycy4gQW4gb3B0aW9uYWwgb3B0aW9ucyBvYmplY3Qgc3BlY2lmaWVkIGNvb2tpZSBwYXJhbWV0ZXJzLlxuICogc2VyaWFsaXplKCdmb28nLCAnYmFyJywgeyBodHRwT25seTogdHJ1ZSB9KSA9PiBcImZvbz1iYXI7IGh0dHBPbmx5XCJcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IHNlcmlhbGl6ZSA9IChrZXksIHZhbCwgb3B0ID0ge30pID0+IHtcbiAgbGV0IG5hbWU7XG5cbiAgaWYgKCFmaWVsZENvbnRlbnRSZWdFeHAudGVzdChrZXkpKSB7XG4gICAgbmFtZSA9IGVzY2FwZShrZXkpO1xuICB9IGVsc2Uge1xuICAgIG5hbWUgPSBrZXk7XG4gIH1cblxuICBsZXQgc2FuaXRpemVkVmFsdWUgPSB2YWw7XG4gIGxldCB2YWx1ZSA9IHZhbDtcbiAgaWYgKCFoZWxwZXJzLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgIGlmIChoZWxwZXJzLmlzT2JqZWN0KHZhbHVlKSB8fCBoZWxwZXJzLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBjb25zdCBzdHJpbmdpZmllZCA9IGFudGlDaXJjdWxhcih2YWx1ZSk7XG4gICAgICB2YWx1ZSA9IGVuY29kZShgSlNPTi5wYXJzZSgke3N0cmluZ2lmaWVkfSlgKTtcbiAgICAgIHNhbml0aXplZFZhbHVlID0gSlNPTi5wYXJzZShzdHJpbmdpZmllZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gZW5jb2RlKHZhbHVlKTtcbiAgICAgIGlmICh2YWx1ZSAmJiAhZmllbGRDb250ZW50UmVnRXhwLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHZhbHVlID0gZXNjYXBlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSAnJztcbiAgfVxuXG4gIGNvbnN0IHBhaXJzID0gW2Ake25hbWV9PSR7dmFsdWV9YF07XG5cbiAgaWYgKGhlbHBlcnMuaXNOdW1iZXIob3B0Lm1heEFnZSkpIHtcbiAgICBwYWlycy5wdXNoKGBNYXgtQWdlPSR7b3B0Lm1heEFnZX1gKTtcbiAgfVxuXG4gIGlmIChvcHQuZG9tYWluICYmIHR5cGVvZiBvcHQuZG9tYWluID09PSAnc3RyaW5nJykge1xuICAgIGlmICghZmllbGRDb250ZW50UmVnRXhwLnRlc3Qob3B0LmRvbWFpbikpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCAnb3B0aW9uIGRvbWFpbiBpcyBpbnZhbGlkJyk7XG4gICAgfVxuICAgIHBhaXJzLnB1c2goYERvbWFpbj0ke29wdC5kb21haW59YCk7XG4gIH1cblxuICBpZiAob3B0LnBhdGggJiYgdHlwZW9mIG9wdC5wYXRoID09PSAnc3RyaW5nJykge1xuICAgIGlmICghZmllbGRDb250ZW50UmVnRXhwLnRlc3Qob3B0LnBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgJ29wdGlvbiBwYXRoIGlzIGludmFsaWQnKTtcbiAgICB9XG4gICAgcGFpcnMucHVzaChgUGF0aD0ke29wdC5wYXRofWApO1xuICB9IGVsc2Uge1xuICAgIHBhaXJzLnB1c2goJ1BhdGg9LycpO1xuICB9XG5cbiAgb3B0LmV4cGlyZXMgPSBvcHQuZXhwaXJlcyB8fCBvcHQuZXhwaXJlIHx8IGZhbHNlO1xuICBpZiAob3B0LmV4cGlyZXMgPT09IEluZmluaXR5KSB7XG4gICAgcGFpcnMucHVzaCgnRXhwaXJlcz1GcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IEdNVCcpO1xuICB9IGVsc2UgaWYgKG9wdC5leHBpcmVzIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHBhaXJzLnB1c2goYEV4cGlyZXM9JHtvcHQuZXhwaXJlcy50b1VUQ1N0cmluZygpfWApO1xuICB9IGVsc2UgaWYgKG9wdC5leHBpcmVzID09PSAwKSB7XG4gICAgcGFpcnMucHVzaCgnRXhwaXJlcz0wJyk7XG4gIH0gZWxzZSBpZiAoaGVscGVycy5pc051bWJlcihvcHQuZXhwaXJlcykpIHtcbiAgICBwYWlycy5wdXNoKGBFeHBpcmVzPSR7KG5ldyBEYXRlKG9wdC5leHBpcmVzKSkudG9VVENTdHJpbmcoKX1gKTtcbiAgfVxuXG4gIGlmIChvcHQuaHR0cE9ubHkpIHtcbiAgICBwYWlycy5wdXNoKCdIdHRwT25seScpO1xuICB9XG5cbiAgaWYgKG9wdC5zZWN1cmUpIHtcbiAgICBwYWlycy5wdXNoKCdTZWN1cmUnKTtcbiAgfVxuXG4gIGlmIChvcHQuZmlyc3RQYXJ0eU9ubHkpIHtcbiAgICBwYWlycy5wdXNoKCdGaXJzdC1QYXJ0eS1Pbmx5Jyk7XG4gIH1cblxuICBpZiAob3B0LnNhbWVTaXRlKSB7XG4gICAgcGFpcnMucHVzaChvcHQuc2FtZVNpdGUgPT09IHRydWUgPyAnU2FtZVNpdGUnIDogYFNhbWVTaXRlPSR7b3B0LnNhbWVTaXRlfWApO1xuICB9XG5cbiAgcmV0dXJuIHsgY29va2llU3RyaW5nOiBwYWlycy5qb2luKCc7ICcpLCBzYW5pdGl6ZWRWYWx1ZSB9O1xufTtcblxuY29uc3QgaXNTdHJpbmdpZmllZFJlZ0V4ID0gL0pTT05cXC5wYXJzZVxcKCguKilcXCkvO1xuY29uc3QgaXNUeXBlZFJlZ0V4ID0gL2ZhbHNlfHRydWV8bnVsbHx1bmRlZmluZWQvO1xuY29uc3QgZGVzZXJpYWxpemUgPSAoc3RyaW5nKSA9PiB7XG4gIGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cblxuICBpZiAoaXNTdHJpbmdpZmllZFJlZ0V4LnRlc3Qoc3RyaW5nKSkge1xuICAgIGxldCBvYmogPSBzdHJpbmcubWF0Y2goaXNTdHJpbmdpZmllZFJlZ0V4KVsxXTtcbiAgICBpZiAob2JqKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvZGUob2JqKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tvc3RyaW86Y29va2llc10gWy5nZXQoKV0gW2Rlc2VyaWFsaXplKCldIEV4Y2VwdGlvbjonLCBlLCBzdHJpbmcsIG9iaik7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHJpbmc7XG4gIH0gZWxzZSBpZiAoaXNUeXBlZFJlZ0V4LnRlc3Qoc3RyaW5nKSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIHN0cmluZztcbn07XG5cbi8qXG4gKiBAbG9jdXMgQW55d2hlcmVcbiAqIEBjbGFzcyBfX2Nvb2tpZXNcbiAqIEBwYXJhbSBvcHRzIHtPYmplY3R9IC0gT3B0aW9ucyAoY29uZmlndXJhdGlvbikgb2JqZWN0XG4gKiBAcGFyYW0gb3B0cy5fY29va2llcyB7T2JqZWN0fFN0cmluZ30gLSBDdXJyZW50IGNvb2tpZXMgYXMgU3RyaW5nIG9yIE9iamVjdFxuICogQHBhcmFtIG9wdHMuVFRMIHtOdW1iZXJ8Qm9vbGVhbn0gLSBEZWZhdWx0IGNvb2tpZXMgZXhwaXJhdGlvbiB0aW1lIChtYXgtYWdlKSBpbiBtaWxsaXNlY29uZHMsIGJ5IGRlZmF1bHQgLSBzZXNzaW9uIChmYWxzZSlcbiAqIEBwYXJhbSBvcHRzLnJ1bk9uU2VydmVyIHtCb29sZWFufSAtIEV4cG9zZSBDb29raWVzIGNsYXNzIHRvIFNlcnZlclxuICogQHBhcmFtIG9wdHMucmVzcG9uc2Uge2h0dHAuU2VydmVyUmVzcG9uc2V8T2JqZWN0fSAtIFRoaXMgb2JqZWN0IGlzIGNyZWF0ZWQgaW50ZXJuYWxseSBieSBhIEhUVFAgc2VydmVyXG4gKiBAcGFyYW0gb3B0cy5hbGxvd1F1ZXJ5U3RyaW5nQ29va2llcyB7Qm9vbGVhbn0gLSBBbGxvdyBwYXNzaW5nIENvb2tpZXMgaW4gYSBxdWVyeSBzdHJpbmcgKGluIFVSTCkuIFByaW1hcnkgc2hvdWxkIGJlIHVzZWQgb25seSBpbiBDb3Jkb3ZhIGVudmlyb25tZW50XG4gKiBAcGFyYW0gb3B0cy5hbGxvd2VkQ29yZG92YU9yaWdpbnMge1JlZ2V4fEJvb2xlYW59IC0gW1NlcnZlcl0gQWxsb3cgc2V0dGluZyBDb29raWVzIGZyb20gdGhhdCBzcGVjaWZpYyBvcmlnaW4gd2hpY2ggaW4gTWV0ZW9yL0NvcmRvdmEgaXMgbG9jYWxob3N0OjEyWFhYICheaHR0cDovL2xvY2FsaG9zdDoxMlswLTldezN9JClcbiAqIEBzdW1tYXJ5IEludGVybmFsIENsYXNzXG4gKi9cbmNsYXNzIF9fY29va2llcyB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICB0aGlzLl9fcGVuZGluZ0Nvb2tpZXMgPSBbXTtcbiAgICB0aGlzLlRUTCA9IG9wdHMuVFRMIHx8IGZhbHNlO1xuICAgIHRoaXMucmVzcG9uc2UgPSBvcHRzLnJlc3BvbnNlIHx8IGZhbHNlO1xuICAgIHRoaXMucnVuT25TZXJ2ZXIgPSBvcHRzLnJ1bk9uU2VydmVyIHx8IGZhbHNlO1xuICAgIHRoaXMuYWxsb3dRdWVyeVN0cmluZ0Nvb2tpZXMgPSBvcHRzLmFsbG93UXVlcnlTdHJpbmdDb29raWVzIHx8IGZhbHNlO1xuICAgIHRoaXMuYWxsb3dlZENvcmRvdmFPcmlnaW5zID0gb3B0cy5hbGxvd2VkQ29yZG92YU9yaWdpbnMgfHwgZmFsc2U7XG5cbiAgICBpZiAodGhpcy5hbGxvd2VkQ29yZG92YU9yaWdpbnMgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYWxsb3dlZENvcmRvdmFPcmlnaW5zID0gL15odHRwOlxcL1xcL2xvY2FsaG9zdDoxMlswLTldezN9JC87XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5SRSA9IG5ldyBSZWdFeHAoYF5odHRwcz86XFwvXFwvKCR7cm9vdFVybCA/IHJvb3RVcmwgOiAnJ30ke21vYmlsZVJvb3RVcmwgPyAoJ3wnICsgbW9iaWxlUm9vdFVybCkgOiAnJ30pJGApO1xuXG4gICAgaWYgKGhlbHBlcnMuaXNPYmplY3Qob3B0cy5fY29va2llcykpIHtcbiAgICAgIHRoaXMuY29va2llcyA9IG9wdHMuX2Nvb2tpZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29va2llcyA9IHBhcnNlKG9wdHMuX2Nvb2tpZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIEBsb2N1cyBBbnl3aGVyZVxuICAgKiBAbWVtYmVyT2YgX19jb29raWVzXG4gICAqIEBuYW1lIGdldFxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5ICAtIFRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gcmVhZFxuICAgKiBAcGFyYW0ge1N0cmluZ30gX3RtcCAtIFVucGFyc2VkIHN0cmluZyBpbnN0ZWFkIG9mIHVzZXIncyBjb29raWVzXG4gICAqIEBzdW1tYXJ5IFJlYWQgYSBjb29raWUuIElmIHRoZSBjb29raWUgZG9lc24ndCBleGlzdCBhIG51bGwgdmFsdWUgd2lsbCBiZSByZXR1cm5lZC5cbiAgICogQHJldHVybnMge1N0cmluZ3x2b2lkfVxuICAgKi9cbiAgZ2V0KGtleSwgX3RtcCkge1xuICAgIGNvbnN0IGNvb2tpZVN0cmluZyA9IF90bXAgPyBwYXJzZShfdG1wKSA6IHRoaXMuY29va2llcztcbiAgICBpZiAoIWtleSB8fCAhY29va2llU3RyaW5nKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH1cblxuICAgIGlmIChjb29raWVTdHJpbmcuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgcmV0dXJuIGRlc2VyaWFsaXplKGNvb2tpZVN0cmluZ1trZXldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG5cbiAgLypcbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZW1iZXJPZiBfX2Nvb2tpZXNcbiAgICogQG5hbWUgc2V0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgICAtIFRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gY3JlYXRlL292ZXJ3cml0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgLSBUaGUgdmFsdWUgb2YgdGhlIGNvb2tpZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0cyAgLSBbT3B0aW9uYWxdIENvb2tpZSBvcHRpb25zIChzZWUgcmVhZG1lIGRvY3MpXG4gICAqIEBzdW1tYXJ5IENyZWF0ZS9vdmVyd3JpdGUgYSBjb29raWUuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgc2V0KGtleSwgdmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGlmIChrZXkgJiYgIWhlbHBlcnMuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgICBpZiAoaGVscGVycy5pc051bWJlcih0aGlzLlRUTCkgJiYgb3B0cy5leHBpcmVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0cy5leHBpcmVzID0gbmV3IERhdGUoK25ldyBEYXRlKCkgKyB0aGlzLlRUTCk7XG4gICAgICB9XG4gICAgICBjb25zdCB7IGNvb2tpZVN0cmluZywgc2FuaXRpemVkVmFsdWUgfSA9IHNlcmlhbGl6ZShrZXksIHZhbHVlLCBvcHRzKTtcblxuICAgICAgdGhpcy5jb29raWVzW2tleV0gPSBzYW5pdGl6ZWRWYWx1ZTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llU3RyaW5nO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMuX19wZW5kaW5nQ29va2llcy5wdXNoKGNvb2tpZVN0cmluZyk7XG4gICAgICAgIHRoaXMucmVzcG9uc2Uuc2V0SGVhZGVyKCdTZXQtQ29va2llJywgdGhpcy5fX3BlbmRpbmdDb29raWVzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAgKiBAbG9jdXMgQW55d2hlcmVcbiAgICogQG1lbWJlck9mIF9fY29va2llc1xuICAgKiBAbmFtZSByZW1vdmVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSAgICAtIFRoZSBuYW1lIG9mIHRoZSBjb29raWUgdG8gY3JlYXRlL292ZXJ3cml0ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAgIC0gW09wdGlvbmFsXSBUaGUgcGF0aCBmcm9tIHdoZXJlIHRoZSBjb29raWUgd2lsbCBiZVxuICAgKiByZWFkYWJsZS4gRS5nLiwgXCIvXCIsIFwiL215ZGlyXCI7IGlmIG5vdCBzcGVjaWZpZWQsIGRlZmF1bHRzIHRvIHRoZSBjdXJyZW50XG4gICAqIHBhdGggb2YgdGhlIGN1cnJlbnQgZG9jdW1lbnQgbG9jYXRpb24gKHN0cmluZyBvciBudWxsKS4gVGhlIHBhdGggbXVzdCBiZVxuICAgKiBhYnNvbHV0ZSAoc2VlIFJGQyAyOTY1KS4gRm9yIG1vcmUgaW5mb3JtYXRpb24gb24gaG93IHRvIHVzZSByZWxhdGl2ZSBwYXRoc1xuICAgKiBpbiB0aGlzIGFyZ3VtZW50LCBzZWU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9kb2N1bWVudC5jb29raWUjVXNpbmdfcmVsYXRpdmVfVVJMc19pbl90aGVfcGF0aF9wYXJhbWV0ZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRvbWFpbiAtIFtPcHRpb25hbF0gVGhlIGRvbWFpbiBmcm9tIHdoZXJlIHRoZSBjb29raWUgd2lsbFxuICAgKiBiZSByZWFkYWJsZS4gRS5nLiwgXCJleGFtcGxlLmNvbVwiLCBcIi5leGFtcGxlLmNvbVwiIChpbmNsdWRlcyBhbGwgc3ViZG9tYWlucylcbiAgICogb3IgXCJzdWJkb21haW4uZXhhbXBsZS5jb21cIjsgaWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gdGhlIGhvc3QgcG9ydGlvblxuICAgKiBvZiB0aGUgY3VycmVudCBkb2N1bWVudCBsb2NhdGlvbiAoc3RyaW5nIG9yIG51bGwpLlxuICAgKiBAc3VtbWFyeSBSZW1vdmUgYSBjb29raWUocykuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgcmVtb3ZlKGtleSwgcGF0aCA9ICcvJywgZG9tYWluID0gJycpIHtcbiAgICBpZiAoa2V5ICYmIHRoaXMuY29va2llcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb25zdCB7IGNvb2tpZVN0cmluZyB9ID0gc2VyaWFsaXplKGtleSwgJycsIHtcbiAgICAgICAgZG9tYWluLFxuICAgICAgICBwYXRoLFxuICAgICAgICBleHBpcmVzOiBuZXcgRGF0ZSgwKVxuICAgICAgfSk7XG5cbiAgICAgIGRlbGV0ZSB0aGlzLmNvb2tpZXNba2V5XTtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gY29va2llU3RyaW5nO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2Uuc2V0SGVhZGVyKCdTZXQtQ29va2llJywgY29va2llU3RyaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIWtleSAmJiB0aGlzLmtleXMoKS5sZW5ndGggPiAwICYmIHRoaXMua2V5cygpWzBdICE9PSAnJykge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29va2llcyk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZW1vdmUoa2V5c1tpXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLypcbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZW1iZXJPZiBfX2Nvb2tpZXNcbiAgICogQG5hbWUgaGFzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgIC0gVGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0byBjcmVhdGUvb3ZlcndyaXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBfdG1wIC0gVW5wYXJzZWQgc3RyaW5nIGluc3RlYWQgb2YgdXNlcidzIGNvb2tpZXNcbiAgICogQHN1bW1hcnkgQ2hlY2sgd2hldGhlciBhIGNvb2tpZSBleGlzdHMgaW4gdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaGFzKGtleSwgX3RtcCkge1xuICAgIGNvbnN0IGNvb2tpZVN0cmluZyA9IF90bXAgPyBwYXJzZShfdG1wKSA6IHRoaXMuY29va2llcztcbiAgICBpZiAoIWtleSB8fCAhY29va2llU3RyaW5nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvb2tpZVN0cmluZy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICB9XG5cbiAgLypcbiAgICogQGxvY3VzIEFueXdoZXJlXG4gICAqIEBtZW1iZXJPZiBfX2Nvb2tpZXNcbiAgICogQG5hbWUga2V5c1xuICAgKiBAc3VtbWFyeSBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCByZWFkYWJsZSBjb29raWVzIGZyb20gdGhpcyBsb2NhdGlvbi5cbiAgICogQHJldHVybnMge1tTdHJpbmddfVxuICAgKi9cbiAga2V5cygpIHtcbiAgICBpZiAodGhpcy5jb29raWVzKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb29raWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLypcbiAgICogQGxvY3VzIENsaWVudFxuICAgKiBAbWVtYmVyT2YgX19jb29raWVzXG4gICAqIEBuYW1lIHNlbmRcbiAgICogQHBhcmFtIGNiIHtGdW5jdGlvbn0gLSBDYWxsYmFja1xuICAgKiBAc3VtbWFyeSBTZW5kIGFsbCBjb29raWVzIG92ZXIgWEhSIHRvIHNlcnZlci5cbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBzZW5kKGNiID0gTm9PcCkge1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGNiKG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnQ2FuXFwndCBydW4gYC5zZW5kKClgIG9uIHNlcnZlciwgaXRcXCdzIENsaWVudCBvbmx5IG1ldGhvZCEnKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnVuT25TZXJ2ZXIpIHtcbiAgICAgIGxldCBwYXRoID0gYCR7d2luZG93Ll9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uUk9PVF9VUkxfUEFUSF9QUkVGSVggfHwgd2luZG93Ll9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18ubWV0ZW9yRW52LlJPT1RfVVJMX1BBVEhfUFJFRklYIHx8ICcnfS9fX19jb29raWVfX18vc2V0YDtcbiAgICAgIGxldCBxdWVyeSA9ICcnO1xuXG4gICAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSAmJiB0aGlzLmFsbG93UXVlcnlTdHJpbmdDb29raWVzKSB7XG4gICAgICAgIGNvbnN0IGNvb2tpZXNLZXlzID0gdGhpcy5rZXlzKCk7XG4gICAgICAgIGNvbnN0IGNvb2tpZXNBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb2tpZXNLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgeyBzYW5pdGl6ZWRWYWx1ZSB9ID0gc2VyaWFsaXplKGNvb2tpZXNLZXlzW2ldLCB0aGlzLmdldChjb29raWVzS2V5c1tpXSkpO1xuICAgICAgICAgIGNvbnN0IHBhaXIgPSBgJHtjb29raWVzS2V5c1tpXX09JHtzYW5pdGl6ZWRWYWx1ZX1gO1xuICAgICAgICAgIGlmICghY29va2llc0FycmF5LmluY2x1ZGVzKHBhaXIpKSB7XG4gICAgICAgICAgICBjb29raWVzQXJyYXkucHVzaChwYWlyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29va2llc0FycmF5Lmxlbmd0aCkge1xuICAgICAgICAgIHBhdGggPSBNZXRlb3IuYWJzb2x1dGVVcmwoJ19fX2Nvb2tpZV9fXy9zZXQnKTtcbiAgICAgICAgICBxdWVyeSA9IGA/X19fY29va2llc19fXz0ke2VuY29kZVVSSUNvbXBvbmVudChjb29raWVzQXJyYXkuam9pbignOyAnKSl9YDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmZXRjaChgJHtwYXRofSR7cXVlcnl9YCwge1xuICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICB0eXBlOiAnY29ycydcbiAgICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNiKHZvaWQgMCwgcmVzcG9uc2UpO1xuICAgICAgfSkuY2F0Y2goY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYihuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ0NhblxcJ3Qgc2VuZCBjb29raWVzIG9uIHNlcnZlciB3aGVuIGBydW5PblNlcnZlcmAgaXMgZmFsc2UuJykpO1xuICAgIH1cbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG59XG5cbi8qXG4gKiBAZnVuY3Rpb25cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBzdW1tYXJ5IE1pZGRsZXdhcmUgaGFuZGxlclxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX19taWRkbGV3YXJlSGFuZGxlciA9IChyZXF1ZXN0LCByZXNwb25zZSwgb3B0cykgPT4ge1xuICBsZXQgX2Nvb2tpZXMgPSB7fTtcbiAgaWYgKG9wdHMucnVuT25TZXJ2ZXIpIHtcbiAgICBpZiAocmVxdWVzdC5oZWFkZXJzICYmIHJlcXVlc3QuaGVhZGVycy5jb29raWUpIHtcbiAgICAgIF9jb29raWVzID0gcGFyc2UocmVxdWVzdC5oZWFkZXJzLmNvb2tpZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBfX2Nvb2tpZXMoe1xuICAgICAgX2Nvb2tpZXMsXG4gICAgICBUVEw6IG9wdHMuVFRMLFxuICAgICAgcnVuT25TZXJ2ZXI6IG9wdHMucnVuT25TZXJ2ZXIsXG4gICAgICByZXNwb25zZSxcbiAgICAgIGFsbG93UXVlcnlTdHJpbmdDb29raWVzOiBvcHRzLmFsbG93UXVlcnlTdHJpbmdDb29raWVzXG4gICAgfSk7XG4gIH1cblxuICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ0NhblxcJ3QgdXNlIG1pZGRsZXdhcmUgd2hlbiBgcnVuT25TZXJ2ZXJgIGlzIGZhbHNlLicpO1xufTtcblxuLypcbiAqIEBsb2N1cyBBbnl3aGVyZVxuICogQGNsYXNzIENvb2tpZXNcbiAqIEBwYXJhbSBvcHRzIHtPYmplY3R9XG4gKiBAcGFyYW0gb3B0cy5UVEwge051bWJlcn0gLSBEZWZhdWx0IGNvb2tpZXMgZXhwaXJhdGlvbiB0aW1lIChtYXgtYWdlKSBpbiBtaWxsaXNlY29uZHMsIGJ5IGRlZmF1bHQgLSBzZXNzaW9uIChmYWxzZSlcbiAqIEBwYXJhbSBvcHRzLmF1dG8ge0Jvb2xlYW59IC0gW1NlcnZlcl0gQXV0by1iaW5kIGluIG1pZGRsZXdhcmUgYXMgYHJlcS5Db29raWVzYCwgYnkgZGVmYXVsdCBgdHJ1ZWBcbiAqIEBwYXJhbSBvcHRzLmhhbmRsZXIge0Z1bmN0aW9ufSAtIFtTZXJ2ZXJdIE1pZGRsZXdhcmUgaGFuZGxlclxuICogQHBhcmFtIG9wdHMucnVuT25TZXJ2ZXIge0Jvb2xlYW59IC0gRXhwb3NlIENvb2tpZXMgY2xhc3MgdG8gU2VydmVyXG4gKiBAcGFyYW0gb3B0cy5hbGxvd1F1ZXJ5U3RyaW5nQ29va2llcyB7Qm9vbGVhbn0gLSBBbGxvdyBwYXNzaW5nIENvb2tpZXMgaW4gYSBxdWVyeSBzdHJpbmcgKGluIFVSTCkuIFByaW1hcnkgc2hvdWxkIGJlIHVzZWQgb25seSBpbiBDb3Jkb3ZhIGVudmlyb25tZW50XG4gKiBAcGFyYW0gb3B0cy5hbGxvd2VkQ29yZG92YU9yaWdpbnMge1JlZ2V4fEJvb2xlYW59IC0gW1NlcnZlcl0gQWxsb3cgc2V0dGluZyBDb29raWVzIGZyb20gdGhhdCBzcGVjaWZpYyBvcmlnaW4gd2hpY2ggaW4gTWV0ZW9yL0NvcmRvdmEgaXMgbG9jYWxob3N0OjEyWFhYICheaHR0cDovL2xvY2FsaG9zdDoxMlswLTldezN9JClcbiAqIEBzdW1tYXJ5IE1haW4gQ29va2llIGNsYXNzXG4gKi9cbmNsYXNzIENvb2tpZXMgZXh0ZW5kcyBfX2Nvb2tpZXMge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBvcHRzLlRUTCA9IGhlbHBlcnMuaXNOdW1iZXIob3B0cy5UVEwpID8gb3B0cy5UVEwgOiBmYWxzZTtcbiAgICBvcHRzLnJ1bk9uU2VydmVyID0gKG9wdHMucnVuT25TZXJ2ZXIgIT09IGZhbHNlKSA/IHRydWUgOiBmYWxzZTtcbiAgICBvcHRzLmFsbG93UXVlcnlTdHJpbmdDb29raWVzID0gKG9wdHMuYWxsb3dRdWVyeVN0cmluZ0Nvb2tpZXMgIT09IHRydWUpID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgb3B0cy5fY29va2llcyA9IGRvY3VtZW50LmNvb2tpZTtcbiAgICAgIHN1cGVyKG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRzLl9jb29raWVzID0ge307XG4gICAgICBzdXBlcihvcHRzKTtcbiAgICAgIG9wdHMuYXV0byA9IChvcHRzLmF1dG8gIT09IGZhbHNlKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgIHRoaXMub3B0cyA9IG9wdHM7XG4gICAgICB0aGlzLmhhbmRsZXIgPSBoZWxwZXJzLmlzRnVuY3Rpb24ob3B0cy5oYW5kbGVyKSA/IG9wdHMuaGFuZGxlciA6IGZhbHNlO1xuICAgICAgdGhpcy5vbkNvb2tpZXMgPSBoZWxwZXJzLmlzRnVuY3Rpb24ob3B0cy5vbkNvb2tpZXMpID8gb3B0cy5vbkNvb2tpZXMgOiBmYWxzZTtcblxuICAgICAgaWYgKG9wdHMucnVuT25TZXJ2ZXIgJiYgIUNvb2tpZXMuaXNMb2FkZWRPblNlcnZlcikge1xuICAgICAgICBDb29raWVzLmlzTG9hZGVkT25TZXJ2ZXIgPSB0cnVlO1xuICAgICAgICBpZiAob3B0cy5hdXRvKSB7XG4gICAgICAgICAgV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodXJsUkUudGVzdChyZXEuX3BhcnNlZFVybC5wYXRoKSkge1xuICAgICAgICAgICAgICBjb25zdCBtYXRjaGVkQ29yZG92YU9yaWdpbiA9ICEhcmVxLmhlYWRlcnMub3JpZ2luXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5hbGxvd2VkQ29yZG92YU9yaWdpbnNcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmFsbG93ZWRDb3Jkb3ZhT3JpZ2lucy50ZXN0KHJlcS5oZWFkZXJzLm9yaWdpbik7XG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoZWRPcmlnaW4gPSBtYXRjaGVkQ29yZG92YU9yaWdpblxuICAgICAgICAgICAgICAgIHx8ICghIXJlcS5oZWFkZXJzLm9yaWdpbiAmJiB0aGlzLm9yaWdpblJFLnRlc3QocmVxLmhlYWRlcnMub3JpZ2luKSk7XG5cbiAgICAgICAgICAgICAgaWYgKG1hdGNoZWRPcmlnaW4pIHtcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscycsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgcmVxLmhlYWRlcnMub3JpZ2luKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGNvb2tpZXNBcnJheSA9IFtdO1xuICAgICAgICAgICAgICBsZXQgY29va2llc09iamVjdCA9IHt9O1xuICAgICAgICAgICAgICBpZiAobWF0Y2hlZENvcmRvdmFPcmlnaW4gJiYgb3B0cy5hbGxvd1F1ZXJ5U3RyaW5nQ29va2llcyAmJiByZXEucXVlcnkuX19fY29va2llc19fXykge1xuICAgICAgICAgICAgICAgIGNvb2tpZXNPYmplY3QgPSBwYXJzZShkZWNvZGVVUklDb21wb25lbnQocmVxLnF1ZXJ5Ll9fX2Nvb2tpZXNfX18pKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXEuaGVhZGVycy5jb29raWUpIHtcbiAgICAgICAgICAgICAgICBjb29raWVzT2JqZWN0ID0gcGFyc2UocmVxLmhlYWRlcnMuY29va2llKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnN0IGNvb2tpZXNLZXlzID0gT2JqZWN0LmtleXMoY29va2llc09iamVjdCk7XG4gICAgICAgICAgICAgIGlmIChjb29raWVzS2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb2tpZXNLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB7IGNvb2tpZVN0cmluZyB9ID0gc2VyaWFsaXplKGNvb2tpZXNLZXlzW2ldLCBjb29raWVzT2JqZWN0W2Nvb2tpZXNLZXlzW2ldXSk7XG4gICAgICAgICAgICAgICAgICBpZiAoIWNvb2tpZXNBcnJheS5pbmNsdWRlcyhjb29raWVTdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZXNBcnJheS5wdXNoKGNvb2tpZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGNvb2tpZXNBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ1NldC1Db29raWUnLCBjb29raWVzQXJyYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGhlbHBlcnMuaXNGdW5jdGlvbih0aGlzLm9uQ29va2llcykgJiYgdGhpcy5vbkNvb2tpZXMoX19taWRkbGV3YXJlSGFuZGxlcihyZXEsIHJlcywgb3B0cykpO1xuXG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgICAgICAgICAgcmVzLmVuZCgnJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXEuQ29va2llcyA9IF9fbWlkZGxld2FyZUhhbmRsZXIocmVxLCByZXMsIG9wdHMpO1xuICAgICAgICAgICAgICBoZWxwZXJzLmlzRnVuY3Rpb24odGhpcy5oYW5kbGVyKSAmJiB0aGlzLmhhbmRsZXIocmVxLkNvb2tpZXMpO1xuICAgICAgICAgICAgICBuZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBAbG9jdXMgU2VydmVyXG4gICAqIEBtZW1iZXJPZiBDb29raWVzXG4gICAqIEBuYW1lIG1pZGRsZXdhcmVcbiAgICogQHN1bW1hcnkgR2V0IENvb2tpZXMgaW5zdGFuY2UgaW50byBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICovXG4gIG1pZGRsZXdhcmUoKSB7XG4gICAgaWYgKCFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCAnW29zdHJpbzpjb29raWVzXSBDYW5cXCd0IHVzZSBgLm1pZGRsZXdhcmUoKWAgb24gQ2xpZW50LCBpdFxcJ3MgU2VydmVyIG9ubHkhJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgaGVscGVycy5pc0Z1bmN0aW9uKHRoaXMuaGFuZGxlcikgJiYgdGhpcy5oYW5kbGVyKF9fbWlkZGxld2FyZUhhbmRsZXIocmVxLCByZXMsIHRoaXMub3B0cykpO1xuICAgICAgbmV4dCgpO1xuICAgIH07XG4gIH1cbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzLmlzTG9hZGVkT25TZXJ2ZXIgPSBmYWxzZTtcbn1cblxuLyogRXhwb3J0IHRoZSBDb29raWVzIGNsYXNzICovXG5leHBvcnQgeyBDb29raWVzIH07XG4iXX0=
