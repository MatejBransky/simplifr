/* Simplifr, v0.1.2 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.simplifr = global.simplifr || {})));
}(this, function (exports) { 'use strict';

  function defaults(){
    return {
      root: 'root',
      dilimiter: '.'
    }
  }

  /**
   * Simplified Data Api
   */

  function simplify(obj, dilimiter, root){
    dilimiter = dilimiter || defaults().dilimiter;
    root = root || defaults().root;

    return simplifyNode({}, root, obj, dilimiter);
  }

  function add(data, path, obj, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var node = data[path];

    if (node.type === 'array') {
      var max = Math.max.apply(null, node.childs);
      if (!isArray(obj)) obj = [obj];
      obj.forEach(function(d){
        node.childs.push(++max);
        simplifyNode(data, path + dilimiter + max, d, dilimiter);
      });
    }

    else if (node.type === 'object') {
      var keys = Object.keys(obj);
      keys.forEach(function(key){
        node.childs.push(key);
        simplifyNode(data, path + dilimiter + key, obj[key], dilimiter);
      });
    }

    return data;
  }

  function update(data, path, obj, dilimiter){
    reset(data, path, dilimiter);
    simplifyNode(data, path, obj, dilimiter);
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

  function desimplify(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    path = path || defaults().root;

    return dive(path);

    function dive(path){
      var obj;
      var node = data[path];

      if (node.type === 'array') {
        obj = [];
        node.childs.forEach(function(key){
          obj.push(dive(path + dilimiter + key));
        });
      }

      else if (node.type === 'object') {
        obj = {};
        node.childs.forEach(function(key){
          obj[key] = dive(path + dilimiter + key);
        });
      }

      else obj = node;

      return obj;
    }
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

  function simplifyNode(data, path, obj, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;

    dive(obj, path);

    return data;

    function dive(obj, path){
      data[path] = {
        type: 'object',
        childs: []
      };

      if (isArray(obj)) {
        data[path].type = 'array';
        for (var i = -1, l = obj.length; ++i < l;) {
          data[path].childs.push(i);
          dive(obj[i], path + dilimiter + i);
        }
      }

      else if (isObject(obj)) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            data[path].childs.push(key);
            dive(obj[key], path + dilimiter + key);
          }
        }
      }

      else data[path] = obj;

      return data;
    }
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

  function getRaw(data, path, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter).slice(1);

    return diveRaw(data, pathSeq, function(node, key){
      return key ? node[key] : node;
    });
  }

  function addRaw(data, path, obj, dilimiter){
    dilimiter = dilimiter || defaults().dilimiter;
    var pathSeq = path.split(dilimiter).slice(1);

    diveRaw(data, pathSeq, function(_node, _key){
      var node = _node[_key];
      if (isFunction(obj)) obj = obj(node);

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
      return isFunction(obj) ? node[key] = obj(node[key]) : node[key] = obj;
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

  function isFunction(_) {
    return Object.prototype.toString.call(_) === '[object Function]';
  }

  exports.simplify = simplify;
  exports.add = add;
  exports.update = update;
  exports.remove = remove;
  exports.reset = reset;
  exports.desimplify = desimplify;
  exports.truePath = truePath;
  exports.getRaw = getRaw;
  exports.addRaw = addRaw;
  exports.resetRaw = resetRaw;
  exports.removeRaw = removeRaw;
  exports.updateRaw = updateRaw;

}));