var test = require('tape'),
  simplify = require('../').simplify
  ;

test('-= simplify tests =-', function(t){

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

  t.test('simplify complex data with nested arrays ', function(t){
    var json = {
      foo: {
        bar: [
          { buz: [1, 2, 3] },
          { tat: [ { a: 1 }, { b: 2 }, { c: 3 } ] },
          { sat: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ] },
        ]
      }
    };
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2]},

      'root.foo.bar.0': { type: 'object', childs: ['buz']},
      'root.foo.bar.0.buz': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.0.buz.0': 1,
      'root.foo.bar.0.buz.1': 2,
      'root.foo.bar.0.buz.2': 3,

      'root.foo.bar.1': { type: 'object', childs: ['tat']},
      'root.foo.bar.1.tat': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.1.tat.0': { type: 'object', childs: ['a']},
      'root.foo.bar.1.tat.0.a': 1,
      'root.foo.bar.1.tat.1': { type: 'object', childs: ['b']},
      'root.foo.bar.1.tat.1.b': 2,
      'root.foo.bar.1.tat.2': { type: 'object', childs: ['c']},
      'root.foo.bar.1.tat.2.c': 3,

      'root.foo.bar.2': { type: 'object', childs: ['sat']},
      'root.foo.bar.2.sat': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.2.sat.0': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.2.sat.0.0': 1,
      'root.foo.bar.2.sat.0.1': 2,
      'root.foo.bar.2.sat.0.2': 3,
      'root.foo.bar.2.sat.1': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.2.sat.1.0': 4,
      'root.foo.bar.2.sat.1.1': 5,
      'root.foo.bar.2.sat.1.2': 6,
      'root.foo.bar.2.sat.2': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.2.sat.2.0': 7,
      'root.foo.bar.2.sat.2.1': 8,
      'root.foo.bar.2.sat.2.2': 9
    };
    t.deepEqual(simplify(json), res);
    t.end();
  });

});