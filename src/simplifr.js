export default simplify;

function simplify(json, dilimiter){
  var data = {};

  dilimiter = dilimiter || '_';

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
        var next = path + dilimiter + i;
        data[path].childs.push(next);
        dive(json[i], next);
      }
    }
    else if (isObject(json)) {
      for (var key in json) {
        if (json.hasOwnProperty(key)) {
          var next = path + dilimiter + key;
          data[path].childs.push(next);
          dive(json[key], next);
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