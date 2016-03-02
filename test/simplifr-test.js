var test = require('tape'),
  simplify = require('../').simplify;

test('simplifr tests', function(t){

  t.test('simplify object ', function(t){
    var json = {
      key1: 'val1',
      key2: 'val2',
    }
    var res = {
      root: ['root_key1', 'root_key2'],
      root_key1: 'val1',
      root_key2: 'val2',
    }
    t.deepEqual(simplify(json), res)
    t.end();
  });

  t.test('simplify object with array ', function(t){
    var json = {
      key1: 'val1',
      key2: [1,2,3]
    }
    var res = {
      root: ['root_key1', 'root_key2'],
      root_key1: 'val1',
      root_key2: ['root_key2_0', 'root_key2_1', 'root_key2_2'],
      root_key2_0: 1,
      root_key2_1: 2,
      root_key2_2: 3
    }
    t.deepEqual(simplify(json), res)
    t.end();
  });

  t.end();
});