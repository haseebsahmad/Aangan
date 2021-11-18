(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Accounts = Package['accounts-base'].Accounts;
var ECMAScript = Package.ecmascript.ECMAScript;
var OAuth = Package.oauth.OAuth;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-oauth":{"oauth_common.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-oauth/oauth_common.js                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Accounts.oauth = {};
const services = {};
const hasOwn = Object.prototype.hasOwnProperty; // Helper for registering OAuth based accounts packages.
// On the server, adds an index to the user collection.

Accounts.oauth.registerService = name => {
  if (hasOwn.call(services, name)) throw new Error("Duplicate service: ".concat(name));
  services[name] = true;

  if (Meteor.server) {
    // Accounts.updateOrCreateUserFromExternalService does a lookup by this id,
    // so this should be a unique index. You might want to add indexes for other
    // fields returned by your service (eg services.github.login) but you can do
    // that in your app.
    Meteor.users._ensureIndex("services.".concat(name, ".id"), {
      unique: true,
      sparse: true
    });
  }
}; // Removes a previously registered service.
// This will disable logging in with this service, and serviceNames() will not
// contain it.
// It's worth noting that already logged in users will remain logged in unless
// you manually expire their sessions.


Accounts.oauth.unregisterService = name => {
  if (!hasOwn.call(services, name)) throw new Error("Service not found: ".concat(name));
  delete services[name];
};

Accounts.oauth.serviceNames = () => Object.keys(services);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oauth_server.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/accounts-oauth/oauth_server.js                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// Listen to calls to `login` with an oauth option set. This is where
// users actually get logged in to meteor via oauth.
Accounts.registerLoginHandler(options => {
  if (!options.oauth) return undefined; // don't handle

  check(options.oauth, {
    credentialToken: String,
    // When an error occurs while retrieving the access token, we store
    // the error in the pending credentials table, with a secret of
    // null. The client can call the login method with a secret of null
    // to retrieve the error.
    credentialSecret: Match.OneOf(null, String)
  });
  const result = OAuth.retrieveCredential(options.oauth.credentialToken, options.oauth.credentialSecret);

  if (!result) {
    // OAuth credentialToken is not recognized, which could be either
    // because the popup was closed by the user before completion, or
    // some sort of error where the oauth provider didn't talk to our
    // server correctly and closed the popup somehow.
    //
    // We assume it was user canceled and report it as such, using a
    // numeric code that the client recognizes (XXX this will get
    // replaced by a symbolic error code at some point
    // https://trello.com/c/kMkw800Z/53-official-ddp-specification). This
    // will mask failures where things are misconfigured such that the
    // server doesn't see the request but does close the window. This
    // seems unlikely.
    //
    // XXX we want `type` to be the service name such as "facebook"
    return {
      type: "oauth",
      error: new Meteor.Error(Accounts.LoginCancelledError.numericError, "No matching login attempt found")
    };
  }

  if (result instanceof Error) // We tried to login, but there was a fatal error. Report it back
    // to the user.
    throw result;else {
    if (!Accounts.oauth.serviceNames().includes(result.serviceName)) {
      // serviceName was not found in the registered services list.
      // This could happen because the service never registered itself or
      // unregisterService was called on it.
      return {
        type: "oauth",
        error: new Meteor.Error(Accounts.LoginCancelledError.numericError, "No registered oauth service found for: ".concat(result.serviceName))
      };
    }

    return Accounts.updateOrCreateUserFromExternalService(result.serviceName, result.serviceData, result.options);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/accounts-oauth/oauth_common.js");
require("/node_modules/meteor/accounts-oauth/oauth_server.js");

/* Exports */
Package._define("accounts-oauth");

})();

//# sourceURL=meteor://💻app/packages/accounts-oauth.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWNjb3VudHMtb2F1dGgvb2F1dGhfY29tbW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9hY2NvdW50cy1vYXV0aC9vYXV0aF9zZXJ2ZXIuanMiXSwibmFtZXMiOlsiQWNjb3VudHMiLCJvYXV0aCIsInNlcnZpY2VzIiwiaGFzT3duIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJyZWdpc3RlclNlcnZpY2UiLCJuYW1lIiwiY2FsbCIsIkVycm9yIiwiTWV0ZW9yIiwic2VydmVyIiwidXNlcnMiLCJfZW5zdXJlSW5kZXgiLCJ1bmlxdWUiLCJzcGFyc2UiLCJ1bnJlZ2lzdGVyU2VydmljZSIsInNlcnZpY2VOYW1lcyIsImtleXMiLCJyZWdpc3RlckxvZ2luSGFuZGxlciIsIm9wdGlvbnMiLCJ1bmRlZmluZWQiLCJjaGVjayIsImNyZWRlbnRpYWxUb2tlbiIsIlN0cmluZyIsImNyZWRlbnRpYWxTZWNyZXQiLCJNYXRjaCIsIk9uZU9mIiwicmVzdWx0IiwiT0F1dGgiLCJyZXRyaWV2ZUNyZWRlbnRpYWwiLCJ0eXBlIiwiZXJyb3IiLCJMb2dpbkNhbmNlbGxlZEVycm9yIiwibnVtZXJpY0Vycm9yIiwiaW5jbHVkZXMiLCJzZXJ2aWNlTmFtZSIsInVwZGF0ZU9yQ3JlYXRlVXNlckZyb21FeHRlcm5hbFNlcnZpY2UiLCJzZXJ2aWNlRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxRQUFRLENBQUNDLEtBQVQsR0FBaUIsRUFBakI7QUFFQSxNQUFNQyxRQUFRLEdBQUcsRUFBakI7QUFDQSxNQUFNQyxNQUFNLEdBQUdDLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkMsY0FBaEMsQyxDQUVBO0FBQ0E7O0FBQ0FOLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlTSxlQUFmLEdBQWlDQyxJQUFJLElBQUk7QUFDdkMsTUFBSUwsTUFBTSxDQUFDTSxJQUFQLENBQVlQLFFBQVosRUFBc0JNLElBQXRCLENBQUosRUFDRSxNQUFNLElBQUlFLEtBQUosOEJBQWdDRixJQUFoQyxFQUFOO0FBQ0ZOLFVBQVEsQ0FBQ00sSUFBRCxDQUFSLEdBQWlCLElBQWpCOztBQUVBLE1BQUlHLE1BQU0sQ0FBQ0MsTUFBWCxFQUFtQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBRCxVQUFNLENBQUNFLEtBQVAsQ0FBYUMsWUFBYixvQkFBc0NOLElBQXRDLFVBQWlEO0FBQUNPLFlBQU0sRUFBRSxJQUFUO0FBQWVDLFlBQU0sRUFBRTtBQUF2QixLQUFqRDtBQUNEO0FBQ0YsQ0FaRCxDLENBY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FoQixRQUFRLENBQUNDLEtBQVQsQ0FBZWdCLGlCQUFmLEdBQW1DVCxJQUFJLElBQUk7QUFDekMsTUFBSSxDQUFDTCxNQUFNLENBQUNNLElBQVAsQ0FBWVAsUUFBWixFQUFzQk0sSUFBdEIsQ0FBTCxFQUNFLE1BQU0sSUFBSUUsS0FBSiw4QkFBZ0NGLElBQWhDLEVBQU47QUFDRixTQUFPTixRQUFRLENBQUNNLElBQUQsQ0FBZjtBQUNELENBSkQ7O0FBTUFSLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlaUIsWUFBZixHQUE4QixNQUFNZCxNQUFNLENBQUNlLElBQVAsQ0FBWWpCLFFBQVosQ0FBcEMsQzs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBRixRQUFRLENBQUNvQixvQkFBVCxDQUE4QkMsT0FBTyxJQUFJO0FBQ3ZDLE1BQUksQ0FBQ0EsT0FBTyxDQUFDcEIsS0FBYixFQUNFLE9BQU9xQixTQUFQLENBRnFDLENBRW5COztBQUVwQkMsT0FBSyxDQUFDRixPQUFPLENBQUNwQixLQUFULEVBQWdCO0FBQ25CdUIsbUJBQWUsRUFBRUMsTUFERTtBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxvQkFBZ0IsRUFBRUMsS0FBSyxDQUFDQyxLQUFOLENBQVksSUFBWixFQUFrQkgsTUFBbEI7QUFOQyxHQUFoQixDQUFMO0FBU0EsUUFBTUksTUFBTSxHQUFHQyxLQUFLLENBQUNDLGtCQUFOLENBQXlCVixPQUFPLENBQUNwQixLQUFSLENBQWN1QixlQUF2QyxFQUN1QkgsT0FBTyxDQUFDcEIsS0FBUixDQUFjeUIsZ0JBRHJDLENBQWY7O0FBR0EsTUFBSSxDQUFDRyxNQUFMLEVBQWE7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTztBQUFFRyxVQUFJLEVBQUUsT0FBUjtBQUNFQyxXQUFLLEVBQUUsSUFBSXRCLE1BQU0sQ0FBQ0QsS0FBWCxDQUNMVixRQUFRLENBQUNrQyxtQkFBVCxDQUE2QkMsWUFEeEIsRUFFTCxpQ0FGSztBQURULEtBQVA7QUFJRDs7QUFFRCxNQUFJTixNQUFNLFlBQVluQixLQUF0QixFQUNFO0FBQ0E7QUFDQSxVQUFNbUIsTUFBTixDQUhGLEtBSUs7QUFDSCxRQUFJLENBQUU3QixRQUFRLENBQUNDLEtBQVQsQ0FBZWlCLFlBQWYsR0FBOEJrQixRQUE5QixDQUF1Q1AsTUFBTSxDQUFDUSxXQUE5QyxDQUFOLEVBQWtFO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBLGFBQU87QUFBRUwsWUFBSSxFQUFFLE9BQVI7QUFDRUMsYUFBSyxFQUFFLElBQUl0QixNQUFNLENBQUNELEtBQVgsQ0FDTFYsUUFBUSxDQUFDa0MsbUJBQVQsQ0FBNkJDLFlBRHhCLG1EQUVxQ04sTUFBTSxDQUFDUSxXQUY1QztBQURULE9BQVA7QUFLRDs7QUFDRCxXQUFPckMsUUFBUSxDQUFDc0MscUNBQVQsQ0FBK0NULE1BQU0sQ0FBQ1EsV0FBdEQsRUFBbUVSLE1BQU0sQ0FBQ1UsV0FBMUUsRUFBdUZWLE1BQU0sQ0FBQ1IsT0FBOUYsQ0FBUDtBQUNEO0FBQ0YsQ0F0REQsRSIsImZpbGUiOiIvcGFja2FnZXMvYWNjb3VudHMtb2F1dGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJBY2NvdW50cy5vYXV0aCA9IHt9O1xuXG5jb25zdCBzZXJ2aWNlcyA9IHt9O1xuY29uc3QgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gSGVscGVyIGZvciByZWdpc3RlcmluZyBPQXV0aCBiYXNlZCBhY2NvdW50cyBwYWNrYWdlcy5cbi8vIE9uIHRoZSBzZXJ2ZXIsIGFkZHMgYW4gaW5kZXggdG8gdGhlIHVzZXIgY29sbGVjdGlvbi5cbkFjY291bnRzLm9hdXRoLnJlZ2lzdGVyU2VydmljZSA9IG5hbWUgPT4ge1xuICBpZiAoaGFzT3duLmNhbGwoc2VydmljZXMsIG5hbWUpKVxuICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIHNlcnZpY2U6ICR7bmFtZX1gKTtcbiAgc2VydmljZXNbbmFtZV0gPSB0cnVlO1xuXG4gIGlmIChNZXRlb3Iuc2VydmVyKSB7XG4gICAgLy8gQWNjb3VudHMudXBkYXRlT3JDcmVhdGVVc2VyRnJvbUV4dGVybmFsU2VydmljZSBkb2VzIGEgbG9va3VwIGJ5IHRoaXMgaWQsXG4gICAgLy8gc28gdGhpcyBzaG91bGQgYmUgYSB1bmlxdWUgaW5kZXguIFlvdSBtaWdodCB3YW50IHRvIGFkZCBpbmRleGVzIGZvciBvdGhlclxuICAgIC8vIGZpZWxkcyByZXR1cm5lZCBieSB5b3VyIHNlcnZpY2UgKGVnIHNlcnZpY2VzLmdpdGh1Yi5sb2dpbikgYnV0IHlvdSBjYW4gZG9cbiAgICAvLyB0aGF0IGluIHlvdXIgYXBwLlxuICAgIE1ldGVvci51c2Vycy5fZW5zdXJlSW5kZXgoYHNlcnZpY2VzLiR7bmFtZX0uaWRgLCB7dW5pcXVlOiB0cnVlLCBzcGFyc2U6IHRydWV9KTtcbiAgfVxufTtcblxuLy8gUmVtb3ZlcyBhIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBzZXJ2aWNlLlxuLy8gVGhpcyB3aWxsIGRpc2FibGUgbG9nZ2luZyBpbiB3aXRoIHRoaXMgc2VydmljZSwgYW5kIHNlcnZpY2VOYW1lcygpIHdpbGwgbm90XG4vLyBjb250YWluIGl0LlxuLy8gSXQncyB3b3J0aCBub3RpbmcgdGhhdCBhbHJlYWR5IGxvZ2dlZCBpbiB1c2VycyB3aWxsIHJlbWFpbiBsb2dnZWQgaW4gdW5sZXNzXG4vLyB5b3UgbWFudWFsbHkgZXhwaXJlIHRoZWlyIHNlc3Npb25zLlxuQWNjb3VudHMub2F1dGgudW5yZWdpc3RlclNlcnZpY2UgPSBuYW1lID0+IHtcbiAgaWYgKCFoYXNPd24uY2FsbChzZXJ2aWNlcywgbmFtZSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2aWNlIG5vdCBmb3VuZDogJHtuYW1lfWApO1xuICBkZWxldGUgc2VydmljZXNbbmFtZV07XG59O1xuXG5BY2NvdW50cy5vYXV0aC5zZXJ2aWNlTmFtZXMgPSAoKSA9PiBPYmplY3Qua2V5cyhzZXJ2aWNlcyk7XG4iLCIvLyBMaXN0ZW4gdG8gY2FsbHMgdG8gYGxvZ2luYCB3aXRoIGFuIG9hdXRoIG9wdGlvbiBzZXQuIFRoaXMgaXMgd2hlcmVcbi8vIHVzZXJzIGFjdHVhbGx5IGdldCBsb2dnZWQgaW4gdG8gbWV0ZW9yIHZpYSBvYXV0aC5cbkFjY291bnRzLnJlZ2lzdGVyTG9naW5IYW5kbGVyKG9wdGlvbnMgPT4ge1xuICBpZiAoIW9wdGlvbnMub2F1dGgpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZG9uJ3QgaGFuZGxlXG5cbiAgY2hlY2sob3B0aW9ucy5vYXV0aCwge1xuICAgIGNyZWRlbnRpYWxUb2tlbjogU3RyaW5nLFxuICAgIC8vIFdoZW4gYW4gZXJyb3Igb2NjdXJzIHdoaWxlIHJldHJpZXZpbmcgdGhlIGFjY2VzcyB0b2tlbiwgd2Ugc3RvcmVcbiAgICAvLyB0aGUgZXJyb3IgaW4gdGhlIHBlbmRpbmcgY3JlZGVudGlhbHMgdGFibGUsIHdpdGggYSBzZWNyZXQgb2ZcbiAgICAvLyBudWxsLiBUaGUgY2xpZW50IGNhbiBjYWxsIHRoZSBsb2dpbiBtZXRob2Qgd2l0aCBhIHNlY3JldCBvZiBudWxsXG4gICAgLy8gdG8gcmV0cmlldmUgdGhlIGVycm9yLlxuICAgIGNyZWRlbnRpYWxTZWNyZXQ6IE1hdGNoLk9uZU9mKG51bGwsIFN0cmluZylcbiAgfSk7XG5cbiAgY29uc3QgcmVzdWx0ID0gT0F1dGgucmV0cmlldmVDcmVkZW50aWFsKG9wdGlvbnMub2F1dGguY3JlZGVudGlhbFRva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub2F1dGguY3JlZGVudGlhbFNlY3JldCk7XG5cbiAgaWYgKCFyZXN1bHQpIHtcbiAgICAvLyBPQXV0aCBjcmVkZW50aWFsVG9rZW4gaXMgbm90IHJlY29nbml6ZWQsIHdoaWNoIGNvdWxkIGJlIGVpdGhlclxuICAgIC8vIGJlY2F1c2UgdGhlIHBvcHVwIHdhcyBjbG9zZWQgYnkgdGhlIHVzZXIgYmVmb3JlIGNvbXBsZXRpb24sIG9yXG4gICAgLy8gc29tZSBzb3J0IG9mIGVycm9yIHdoZXJlIHRoZSBvYXV0aCBwcm92aWRlciBkaWRuJ3QgdGFsayB0byBvdXJcbiAgICAvLyBzZXJ2ZXIgY29ycmVjdGx5IGFuZCBjbG9zZWQgdGhlIHBvcHVwIHNvbWVob3cuXG4gICAgLy9cbiAgICAvLyBXZSBhc3N1bWUgaXQgd2FzIHVzZXIgY2FuY2VsZWQgYW5kIHJlcG9ydCBpdCBhcyBzdWNoLCB1c2luZyBhXG4gICAgLy8gbnVtZXJpYyBjb2RlIHRoYXQgdGhlIGNsaWVudCByZWNvZ25pemVzIChYWFggdGhpcyB3aWxsIGdldFxuICAgIC8vIHJlcGxhY2VkIGJ5IGEgc3ltYm9saWMgZXJyb3IgY29kZSBhdCBzb21lIHBvaW50XG4gICAgLy8gaHR0cHM6Ly90cmVsbG8uY29tL2Mva01rdzgwMFovNTMtb2ZmaWNpYWwtZGRwLXNwZWNpZmljYXRpb24pLiBUaGlzXG4gICAgLy8gd2lsbCBtYXNrIGZhaWx1cmVzIHdoZXJlIHRoaW5ncyBhcmUgbWlzY29uZmlndXJlZCBzdWNoIHRoYXQgdGhlXG4gICAgLy8gc2VydmVyIGRvZXNuJ3Qgc2VlIHRoZSByZXF1ZXN0IGJ1dCBkb2VzIGNsb3NlIHRoZSB3aW5kb3cuIFRoaXNcbiAgICAvLyBzZWVtcyB1bmxpa2VseS5cbiAgICAvL1xuICAgIC8vIFhYWCB3ZSB3YW50IGB0eXBlYCB0byBiZSB0aGUgc2VydmljZSBuYW1lIHN1Y2ggYXMgXCJmYWNlYm9va1wiXG4gICAgcmV0dXJuIHsgdHlwZTogXCJvYXV0aFwiLFxuICAgICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgQWNjb3VudHMuTG9naW5DYW5jZWxsZWRFcnJvci5udW1lcmljRXJyb3IsXG4gICAgICAgICAgICAgICBcIk5vIG1hdGNoaW5nIGxvZ2luIGF0dGVtcHQgZm91bmRcIikgfTtcbiAgfVxuXG4gIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBFcnJvcilcbiAgICAvLyBXZSB0cmllZCB0byBsb2dpbiwgYnV0IHRoZXJlIHdhcyBhIGZhdGFsIGVycm9yLiBSZXBvcnQgaXQgYmFja1xuICAgIC8vIHRvIHRoZSB1c2VyLlxuICAgIHRocm93IHJlc3VsdDtcbiAgZWxzZSB7XG4gICAgaWYgKCEgQWNjb3VudHMub2F1dGguc2VydmljZU5hbWVzKCkuaW5jbHVkZXMocmVzdWx0LnNlcnZpY2VOYW1lKSkge1xuICAgICAgLy8gc2VydmljZU5hbWUgd2FzIG5vdCBmb3VuZCBpbiB0aGUgcmVnaXN0ZXJlZCBzZXJ2aWNlcyBsaXN0LlxuICAgICAgLy8gVGhpcyBjb3VsZCBoYXBwZW4gYmVjYXVzZSB0aGUgc2VydmljZSBuZXZlciByZWdpc3RlcmVkIGl0c2VsZiBvclxuICAgICAgLy8gdW5yZWdpc3RlclNlcnZpY2Ugd2FzIGNhbGxlZCBvbiBpdC5cbiAgICAgIHJldHVybiB7IHR5cGU6IFwib2F1dGhcIixcbiAgICAgICAgICAgICAgIGVycm9yOiBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICBBY2NvdW50cy5Mb2dpbkNhbmNlbGxlZEVycm9yLm51bWVyaWNFcnJvcixcbiAgICAgICAgICAgICAgICAgYE5vIHJlZ2lzdGVyZWQgb2F1dGggc2VydmljZSBmb3VuZCBmb3I6ICR7cmVzdWx0LnNlcnZpY2VOYW1lfWApIH07XG5cbiAgICB9XG4gICAgcmV0dXJuIEFjY291bnRzLnVwZGF0ZU9yQ3JlYXRlVXNlckZyb21FeHRlcm5hbFNlcnZpY2UocmVzdWx0LnNlcnZpY2VOYW1lLCByZXN1bHQuc2VydmljZURhdGEsIHJlc3VsdC5vcHRpb25zKTtcbiAgfVxufSk7XG4iXX0=
