(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.simplifr = global.simplifr || {})));
}(this, function (exports) { 'use strict';

  var data = {};

  function simplify(json, path, dilimiter){
    path = path || 'root';
    dilimiter = dilimiter || '_';
    data[path] = [];

    if (isArray(json)) {
      for (var i = -1, l = json.length; ++i < l;) {
        var next = path + dilimiter + i;
        data[path].push(next);
        simplify(json[i], next);
      }
    }
    else if (isObject(json)) {
      for (var key in json) {
        if (json.hasOwnProperty(key)) {
          var next = path + dilimiter + key;
          data[path].push(next);
          simplify(json[key], next);
        }
      }
    }
    else data[path] = json;

    return data;
  }

  function isArray(_) {
    return Object.prototype.toString.call(_) === '[object Array]';
  }

  function isObject(_) {
    return Object.prototype.toString.call(_) === '[object Object]';
  }

  exports.simplify = simplify;

}));