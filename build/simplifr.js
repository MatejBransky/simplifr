(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.simplifr = global.simplifr || {})));
}(this, function (exports) { 'use strict';

  function simplify(json, dilimiter){
    var data = {};

    dilimiter = dilimiter || '_';

    dive(json, 'root');

    return data;

    function dive(json, path){

      if (isArray(json)) {
        var l = json.length;
        data[path] = {
          type: 'array',
          length: l
        };
        for (var i = -1; ++i < l;) {
          dive(json[i], path + dilimiter + i);
        }
      }
      else if (isObject(json)) {
        data[path] = {
          type: 'object',
          childs: []
        };
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            data[path].childs.push(key);
            dive(json[key], path + dilimiter + key);
          }
        }
      }
      else data[path] = json;

      return data;
    }
  }

  function isArray(_) {
    return Object.prototype.toString.call(_) === '[object Array]';
  }

  function isObject(_) {
    return Object.prototype.toString.call(_) === '[object Object]';
  }

  exports.simplify = simplify;

}));