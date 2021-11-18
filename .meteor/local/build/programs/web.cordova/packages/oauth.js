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
var check = Package.check.check;
var Match = Package.check.Match;
var URL = Package.url.URL;
var URLSearchParams = Package.url.URLSearchParams;
var Reload = Package.reload.Reload;
var Base64 = Package.base64.Base64;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package.modules.meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var OAuth;

var require = meteorInstall({"node_modules":{"meteor":{"oauth":{"oauth_client.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/oauth/oauth_client.js                                                                          //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
// credentialToken -> credentialSecret. You must provide both the
// credentialToken and the credentialSecret to retrieve an access token from
// the _pendingCredentials collection.
var credentialSecrets = {};
OAuth = {};

OAuth.showPopup = function (url, callback, dimensions) {
  throw new Error("OAuth.showPopup must be implemented on this arch.");
}; // Determine the login style (popup or redirect) for this login flow.
//
//


OAuth._loginStyle = function (service, config, options) {
  if (Meteor.isCordova) {
    return "popup";
  }

  var loginStyle = options && options.loginStyle || config.loginStyle || 'popup';
  if (!["popup", "redirect"].includes(loginStyle)) throw new Error("Invalid login style: " + loginStyle); // If we don't have session storage (for example, Safari in private
  // mode), the redirect login flow won't work, so fallback to the
  // popup style.

  if (loginStyle === 'redirect') {
    try {
      sessionStorage.setItem('Meteor.oauth.test', 'test');
      sessionStorage.removeItem('Meteor.oauth.test');
    } catch (e) {
      loginStyle = 'popup';
    }
  }

  return loginStyle;
};

OAuth._stateParam = function (loginStyle, credentialToken, redirectUrl) {
  var _Meteor$settings, _Meteor$settings$publ, _Meteor$settings$publ2, _Meteor$settings$publ3;

  var state = {
    loginStyle: loginStyle,
    credentialToken: credentialToken,
    isCordova: Meteor.isCordova
  };

  if (loginStyle === 'redirect' || (_Meteor$settings = Meteor.settings) !== null && _Meteor$settings !== void 0 && (_Meteor$settings$publ = _Meteor$settings.public) !== null && _Meteor$settings$publ !== void 0 && (_Meteor$settings$publ2 = _Meteor$settings$publ.packages) !== null && _Meteor$settings$publ2 !== void 0 && (_Meteor$settings$publ3 = _Meteor$settings$publ2.oauth) !== null && _Meteor$settings$publ3 !== void 0 && _Meteor$settings$publ3.setRedirectUrlWhenLoginStyleIsPopup && loginStyle === 'popup') {
    state.redirectUrl = redirectUrl || '' + window.location;
  } // Encode base64 as not all login services URI-encode the state
  // parameter when they pass it back to us.
  // Use the 'base64' package here because 'btoa' isn't supported in IE8/9.


  return Base64.encode(JSON.stringify(state));
}; // At the beginning of the redirect login flow, before we redirect to
// the login service, save the credential token for this login attempt
// in the reload migration data.
//


OAuth.saveDataForRedirect = function (loginService, credentialToken) {
  Reload._onMigrate('oauth', function () {
    return [true, {
      loginService: loginService,
      credentialToken: credentialToken
    }];
  });

  Reload._migrate(null, {
    immediateMigration: true
  });
}; // At the end of the redirect login flow, when we've redirected back
// to the application, retrieve the credentialToken and (if the login
// was successful) the credentialSecret.
//
// Called at application startup.  Returns null if this is normal
// application startup and we weren't just redirected at the end of
// the login flow.
//


OAuth.getDataAfterRedirect = function () {
  var migrationData = Reload._migrationData('oauth');

  if (!(migrationData && migrationData.credentialToken)) return null;
  var credentialToken = migrationData.credentialToken;
  var key = OAuth._storageTokenPrefix + credentialToken;
  var credentialSecret;

  try {
    credentialSecret = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
  } catch (e) {
    Meteor._debug('error retrieving credentialSecret', e);
  }

  return {
    loginService: migrationData.loginService,
    credentialToken: credentialToken,
    credentialSecret: credentialSecret
  };
}; // Launch an OAuth login flow.  For the popup login style, show the
// popup.  For the redirect login style, save the credential token for
// this login attempt in the reload migration data, and redirect to
// the service for the login.
//
// options:
//  loginService: "facebook", "google", etc.
//  loginStyle: "popup" or "redirect"
//  loginUrl: The URL at the login service provider to start the OAuth flow.
//  credentialRequestCompleteCallback: for the popup flow, call when the popup
//    is closed and we have the credential from the login service.
//  credentialToken: our identifier for this login flow.
//


OAuth.launchLogin = function (options) {
  if (!options.loginService) throw new Error('loginService required');

  if (options.loginStyle === 'popup') {
    OAuth.showPopup(options.loginUrl, options.credentialRequestCompleteCallback.bind(null, options.credentialToken), options.popupOptions);
  } else if (options.loginStyle === 'redirect') {
    OAuth.saveDataForRedirect(options.loginService, options.credentialToken);
    window.location = options.loginUrl;
  } else {
    throw new Error('invalid login style');
  }
}; // Called by the popup when the OAuth flow is completed, right before
// the popup closes.


OAuth._handleCredentialSecret = function (credentialToken, secret) {
  check(credentialToken, String);
  check(secret, String);

  if (!Object.prototype.hasOwnProperty.call(credentialSecrets, credentialToken)) {
    credentialSecrets[credentialToken] = secret;
  } else {
    throw new Error("Duplicate credential token from OAuth login");
  }
}; // Used by accounts-oauth, which needs both a credentialToken and the
// corresponding to credential secret to call the `login` method over DDP.


OAuth._retrieveCredentialSecret = function (credentialToken) {
  // First check the secrets collected by OAuth._handleCredentialSecret,
  // then check localStorage. This matches what we do in
  // end_of_login_response.html.
  var secret = credentialSecrets[credentialToken];

  if (!secret) {
    var localStorageKey = OAuth._storageTokenPrefix + credentialToken;
    secret = Meteor._localStorage.getItem(localStorageKey);

    Meteor._localStorage.removeItem(localStorageKey);
  } else {
    delete credentialSecrets[credentialToken];
  }

  return secret;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oauth_cordova.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/oauth/oauth_cordova.js                                                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
// Cordova specific code for the OAuth package.
// Open a popup window, centered on the screen, and call a callback when it
// closes.
//
// @param url {String} url to show
// @param callback {Function} Callback function to call on completion. Takes no
//   arguments.
// @param dimensions {optional Object(width, height)} The dimensions of
//   the popup. If not passed defaults to something sane.
OAuth.showPopup = function (url, callback, dimensions) {
  var fail = function (err) {
    return Meteor._debug("Error from OAuth popup: " + JSON.stringify(err));
  }; // When running on an android device, we sometimes see the
  // `pageLoaded` callback fire twice for the final page in the OAuth
  // popup, even though the page only loads once. This is maybe an
  // Android bug or maybe something intentional about how onPageFinished
  // works that we don't understand and isn't well-documented.


  var oauthFinished = false;

  var pageLoaded = function (event) {
    if (oauthFinished) {
      return;
    }

    if (event.url.indexOf(Meteor.absoluteUrl('_oauth')) === 0) {
      var splitUrl = event.url.split("#");
      var hashFragment = splitUrl[1];

      if (!hashFragment) {
        throw new Error("No hash fragment in OAuth popup?");
      }

      var credentials = JSON.parse(decodeURIComponent(hashFragment));

      OAuth._handleCredentialSecret(credentials.credentialToken, credentials.credentialSecret);

      oauthFinished = true; // On iOS, this seems to prevent "Warning: Attempt to dismiss from
      // view controller <MainViewController: ...> while a presentation
      // or dismiss is in progress". My guess is that the last
      // navigation of the OAuth popup is still in progress while we try
      // to close the popup. See
      // https://issues.apache.org/jira/browse/CB-2285.
      //
      // XXX Can we make this timeout smaller?

      setTimeout(function () {
        popup.close();
        callback();
      }, 100);
    }
  };

  var onExit = function () {
    popup.removeEventListener('loadstop', pageLoaded);
    popup.removeEventListener('loaderror', fail);
    popup.removeEventListener('exit', onExit);
  };

  var popup = window.open(url, '_blank', 'location=yes,hidden=yes');
  popup.addEventListener('loadstop', pageLoaded);
  popup.addEventListener('loaderror', fail);
  popup.addEventListener('exit', onExit);
  popup.show();
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oauth_common.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/oauth/oauth_common.js                                                                          //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default: function (v) {
    _objectSpread = v;
  }
}, 0);
OAuth._storageTokenPrefix = "Meteor.oauth.credentialSecret-";

OAuth._redirectUri = function (serviceName, config, params, absoluteUrlOptions) {
  // Clone because we're going to mutate 'params'. The 'cordova' and
  // 'android' parameters are only used for picking the host of the
  // redirect URL, and not actually included in the redirect URL itself.
  var isCordova = false;
  var isAndroid = false;

  if (params) {
    params = _objectSpread({}, params);
    isCordova = params.cordova;
    isAndroid = params.android;
    delete params.cordova;
    delete params.android;

    if (Object.keys(params).length === 0) {
      params = undefined;
    }
  }

  if (Meteor.isServer && isCordova) {
    var url = Npm.require('url');

    var rootUrl = process.env.MOBILE_ROOT_URL || __meteor_runtime_config__.ROOT_URL;

    if (isAndroid) {
      // Match the replace that we do in cordova boilerplate
      // (boilerplate-generator package).
      // XXX Maybe we should put this in a separate package or something
      // that is used here and by boilerplate-generator? Or maybe
      // `Meteor.absoluteUrl` should know how to do this?
      var parsedRootUrl = url.parse(rootUrl);

      if (parsedRootUrl.hostname === "localhost") {
        parsedRootUrl.hostname = "10.0.2.2";
        delete parsedRootUrl.host;
      }

      rootUrl = url.format(parsedRootUrl);
    }

    absoluteUrlOptions = _objectSpread(_objectSpread({}, absoluteUrlOptions), {}, {
      // For Cordova clients, redirect to the special Cordova root url
      // (likely a local IP in development mode).
      rootUrl: rootUrl
    });
  }

  return URL._constructUrl(Meteor.absoluteUrl("_oauth/" + serviceName, absoluteUrlOptions), null, params);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/oauth/oauth_client.js");
require("/node_modules/meteor/oauth/oauth_cordova.js");
require("/node_modules/meteor/oauth/oauth_common.js");

/* Exports */
Package._define("oauth", {
  OAuth: OAuth
});

})();
