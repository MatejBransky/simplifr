function defaults(){
  return {
    dilimiter: '.'
  }
}

export function simplify(json, dilimiter, root, data){
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

export function add(data, path, obj, dilimiter){
  dilimiter = dilimiter || defaults().dilimiter;
  var node = data[path];

  if (node.type === 'array') {
    var max = Math.max.apply(null, node.childs);
    node.childs.push(++max);
    simplify(obj, dilimiter, path + dilimiter + max, data);
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

function isArray(_) {
  return Object.prototype.toString.call(_) === '[object Array]';
}

function isObject(_) {
  return Object.prototype.toString.call(_) === '[object Object]';
}