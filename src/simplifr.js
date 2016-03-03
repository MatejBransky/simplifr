export default simplify;

function simplify(json, dilimiter){
  var data = {};
  dilimiter = dilimiter || '.';

  dive(json, 'root');

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

function isArray(_) {
  return Object.prototype.toString.call(_) === '[object Array]';
}

function isObject(_) {
  return Object.prototype.toString.call(_) === '[object Object]';
}