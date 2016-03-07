/* Simplifr, v0.0.7 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.simplifr = global.simplifr || {})));
}(this, function (exports) { 'use strict';

  function defaults(){
    return {
      dilimiter: '.'
    }
  }

  /**
   * Simplified Data Api
   */

  function simplify(json, dilimiter, root, data){
    data = data || {};
    root = root || 'root';
    dilimiter = dilimiter || defaults().dilimiter;

    dive(json, root);

    return data;

    function dive(json, path){
      data[path] = {
        type: 'object',
        childs: []
      };

      if (isArray(json)) {
        data[path].type = 'array';
        for (var i = -1, l = json.length; ++i < l;) {
          data[path].childs.push(i);
          dive(json[i], path + dilimiter + i);
        }
      }

      else if (isObject(json)) {
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

  function add(data, path, obj, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var node = data[path];

    if (node.type === 'array') {
      var max = Math.max.apply(null, node.childs);
      if (!isArray(obj)) obj = [obj];
      obj.forEach(function(d){
        node.childs.push(++max);
        simplify(d, dilimiter, path + dilimiter + max, data);
      });
    }

    else if (node.type === 'object') {
      var keys = Object.keys(obj);
      keys.forEach(function(key){
        node.childs.push(key);
        simplify(obj[key], dilimiter, path + dilimiter + key, data);
      });
    }

    return data;
  }

  function update(data, path, obj, dilimiter){
    reset(data, path, dilimiter);
    simplify(obj, dilimiter, path, data);
    return data;
  }

  function remove(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter);
    var key = pathSeq.pop();
    var parentNode = pathSeq.length ? data[pathSeq.join(dilimiter)] : data;

    if (parentNode.type === 'array') key = +key;

    var idx = parentNode.childs.indexOf(key);
    if (idx > -1) parentNode.childs.splice(idx, 1);

    removeChildNode(data, path, dilimiter);

    return data;
  }

  function reset(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;

    removeChildNode(data, path, dilimiter);
    data[path] = null;

    return data;
  }

  function truePath(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter);

    // the first element is a `root`
    var subPath = pathSeq.shift();
    var truePathSeq = [subPath];
    var idx, node, key;

    while (key = pathSeq.shift()) {
      node = data[subPath];
      if (node.type === 'array'){
        idx = node.childs.indexOf(+key);
        truePathSeq.push(idx);
      } else {
        truePathSeq.push(key);
      }
      subPath += dilimiter + key;
    }

    return truePathSeq.join(dilimiter);
  }

  function removeChildNode(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var node = data[path];

    if (node.type === 'array' || node.type === 'object') {
      node.childs.forEach(function(key){
        removeChildNode(data, path + dilimiter + key);
      });
    }

    delete data[path];

    return data;
  }

  /**
   * Raw Data Api
   */

  function addRaw(data, path, obj, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter).slice(1);

    diveRaw(data, pathSeq, function(_node, _key){
      var node = _node[_key];
      if (isArray(node)) {
        if (!isArray(obj)) obj = [obj];
        node.push.apply(node, obj);
      }
      else if (isObject(obj)) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            node[key] = obj[key];
          }
        }
      }
      return node;
    });

    return data;
  }

  function resetRaw(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter).slice(1);

    diveRaw(data, pathSeq, function(node, key){
      return node[key] = null;
    });

    return data;
  }

  function removeRaw(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter).slice(1);

    diveRaw(data, pathSeq, function(node, key){
      return isArray(node) ? (node.splice(+key, 1), node) : delete node[key];
    });

    return data;
  }

  function updateRaw(data, path, obj, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter).slice(1);

    diveRaw(data, pathSeq, function(node, key){
      return node[key] = obj;
    });

    return data;
  }

  function diveRaw(node, pathSeq, action){
    return (pathSeq.length > 1)
      ? diveRaw(node[pathSeq.shift()], pathSeq, action)
      : action(node, pathSeq.shift());
  }

  /**
   * Utils
   */
  function isArray(_) {
    return Object.prototype.toString.call(_) === '[object Array]';
  }

  function isObject(_) {
    return Object.prototype.toString.call(_) === '[object Object]';
  }

  exports.simplify = simplify;
  exports.add = add;
  exports.update = update;
  exports.remove = remove;
  exports.reset = reset;
  exports.truePath = truePath;
  exports.addRaw = addRaw;
  exports.resetRaw = resetRaw;
  exports.removeRaw = removeRaw;
  exports.updateRaw = updateRaw;

}));