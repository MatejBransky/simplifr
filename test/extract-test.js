var test = require('tape'),
  extract = require('../').extract;

test('-= extract tests =-', function(t){

  t.test('extract object ', function(t){
    var data = {
      'root': {
        type: 'object',
        childs: ['key1', 'key2']
      },
      'root.key1': 'val1',
      'root.key2': 'val2',
    };
    var res = {
      key1: 'val1',
      key2: 'val2',
    };
    t.deepEqual(extract(data), res);
    t.end();
  });

  t.test('extract object with array ', function(t){
    var data = {
      'root': {
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
    var res = {
      key1: 'val1',
      key2: [1,2,3]
    };
    t.deepEqual(extract(data), res)
    t.end();
  });

  t.test('extract object with dilimiter "_" ', function(t){
    var data = {
      'root': {
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
    };
    var res = {
      key1: 'val1',
      key2: [1,2,3]
    };
    t.deepEqual(extract(data, null, '_'), res)
    t.end();
  });

  t.test('extract complex data with nested arrays ', function(t){
    var data = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [3, 5, 12]},

      'root.foo.bar.3': { type: 'object', childs: ['buz']},
      'root.foo.bar.3.buz': { type: 'array', childs: [10, 20, 30]},
      'root.foo.bar.3.buz.10': 1,
      'root.foo.bar.3.buz.20': 2,
      'root.foo.bar.3.buz.30': 3,

      'root.foo.bar.5': { type: 'object', childs: ['tat']},
      'root.foo.bar.5.tat': { type: 'array', childs: [10, 20, 30]},
      'root.foo.bar.5.tat.10': { type: 'object', childs: ['a']},
      'root.foo.bar.5.tat.10.a': 1,
      'root.foo.bar.5.tat.20': { type: 'object', childs: ['b']},
      'root.foo.bar.5.tat.20.b': 2,
      'root.foo.bar.5.tat.30': { type: 'object', childs: ['c']},
      'root.foo.bar.5.tat.30.c': 3,

      'root.foo.bar.12': { type: 'object', childs: ['sat']},
      'root.foo.bar.12.sat': { type: 'array', childs: [10, 20, 30]},
      'root.foo.bar.12.sat.10': { type: 'array', childs: [0, 10, 20]},
      'root.foo.bar.12.sat.10.0': 1,
      'root.foo.bar.12.sat.10.10': 2,
      'root.foo.bar.12.sat.10.20': 3,
      'root.foo.bar.12.sat.20': { type: 'array', childs: [0, 10, 20]},
      'root.foo.bar.12.sat.20.0': 4,
      'root.foo.bar.12.sat.20.10': 5,
      'root.foo.bar.12.sat.20.20': 6,
      'root.foo.bar.12.sat.30': { type: 'array', childs: [0, 10, 20]},
      'root.foo.bar.12.sat.30.0': 7,
      'root.foo.bar.12.sat.30.10': 8,
      'root.foo.bar.12.sat.30.20': 9
    };
    var res = {
      foo: {
        bar: [
          { buz: [1, 2, 3] },
          { tat: [ { a: 1 }, { b: 2 }, { c: 3 } ] },
          { sat: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ] },
        ]
      }
    };

    t.deepEqual(extract(data), res);
    t.deepEqual(extract(data, 'root.foo.bar.3.buz'), [1, 2, 3]);

    t.deepEqual(extract(data, 'root.foo.bar.5.tat.30'), { c: 3 });
    t.deepEqual(extract(data, 'root.foo.bar.5.tat.30.c'), 3);

    t.deepEqual(extract(data, 'root.foo.bar.12.sat.20'), [4, 5, 6]);
    t.deepEqual(extract(data, 'root.foo.bar.12.sat.20.10'), 5);

    t.end();
  });
});