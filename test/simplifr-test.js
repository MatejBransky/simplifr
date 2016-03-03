var test = require('tape'),
  simplify = require('../').simplify;

test('simplifr tests', function(t){

  t.test('simplify object ', function(t){
    var json = {
      key1: 'val1',
      key2: 'val2',
    };
    var res = {
      root: {
        type: 'object',
        childs: ['key1', 'key2']
      },
      'root.key1': 'val1',
      'root.key2': 'val2',
    };
    t.deepEqual(simplify(json), res);
    t.end();
  });

  t.test('simplify object with array ', function(t){
    var json = {
      key1: 'val1',
      key2: [1,2,3]
    };
    var res = {
      root: {
        type: 'object',
        childs: ['key1', 'key2']
      },
      'root.key1': 'val1',
      'root.key2': {
        type: 'array',
        childs: [0, 1, 2]
      },
      'root.key2.0': 1,
      'root.key2.1': 2,
      'root.key2.2': 3
    };
    t.deepEqual(simplify(json), res)
    t.end();
  });

  t.test('simplify object with dilimiter "_" ', function(t){
    var json = {
      key1: 'val1',
      key2: [1,2,3]
    }
    var res = {
      root: {
        type: 'object',
        childs: ['key1', 'key2']
      },
      root_key1: 'val1',
      root_key2: {
        type: 'array',
        childs: [0, 1, 2]
      },
      root_key2_0: 1,
      root_key2_1: 2,
      root_key2_2: 3
    }
    t.deepEqual(simplify(json, '_'), res)
    t.end();
  });

  t.end();
});