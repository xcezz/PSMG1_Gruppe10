/* global request */

var request = request || (function() {
  "use strict";

  const READY_STATE_UNITIALIZED = 0,
    READY_STATE_CONNECTED = 1,
    READY_STATE_SERVER_RECEIVED_REQUEST = 2,
    READY_STATE_SERVER_PROCESSING_REQUEST = 3,
    READY_STATE_RESPONSE_READY = 4,
    HTTP_CODE_OK = 200,
    HTTP_CODE_FORBIDDEN = 403,
    HTTP_CODE_NOT_FOUND = 404;
  var that = {};

  function foo() {
    return false;
  }

  function onReadyStateChanged(context, success, error) {
    if (context.readyState === READY_STATE_UNITIALIZED) {
      return;
    }
    if (context.readyState === READY_STATE_CONNECTED) {
      return;
    }
    if (context.readyState === READY_STATE_SERVER_RECEIVED_REQUEST) {
      return;
    }
    if (context.readyState === READY_STATE_SERVER_PROCESSING_REQUEST) {
      return;
    }
    if (context.readyState === READY_STATE_RESPONSE_READY) {
      switch (context.status) {
        case HTTP_CODE_OK:
          success(context.responseText);
          return;
        case HTTP_CODE_FORBIDDEN:
          error("HTTP Error 403: Access forbidden.");
          return;
        case HTTP_CODE_NOT_FOUND:
          error("HTTP Error 404: Document not found.");
          return;
        default:
          error("Unknown Error");
          return;
      }
    }
  }

  function createAsyncXMLHttpRequest(url, method, onSuccess, onError) {
    var requestMethod = method || "GET",
      success = onSuccess || foo,
      error = onError || foo,
      xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      onReadyStateChanged(this, onSuccess, onError);
    };
    xmlhttp.open(requestMethod, url, true);
    return xmlhttp;
  }

  function requestDocument(method, options) {
    var request = createAsyncXMLHttpRequest(options.url, method, options.success,
      options.error);
    request.send();
  }

  that.get = requestDocument.bind(this, "GET");
  return that;
}());
