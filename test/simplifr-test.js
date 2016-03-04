var test = require('tape'),
  simplify = require('../').simplify,
  add = require('../').add;

test('simplifr tests', function(t){

  // Simplify
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

  // Add
  t.test('add simple single node to the object ', function(t){
    var json = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };
    var path = 'root.foo.bar';
    var obj =  { tat: 5 };

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: 5
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': 5
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('add simple nodes to the object ', function(t){
    var json = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };
    var path = 'root.foo.bar';
    var obj =  { tat: 5, sat: 'om', cit: 'namo' };

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: 5,
    //      sat: 'om',
    //      cit: 'namo'
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat', 'sat', 'cit']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': 5,
      'root.foo.bar.sat': 'om',
      'root.foo.bar.cit': 'namo'
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('add simple single node to the array ', function(t){
    var json = {
      foo: {
        bar: [
          'buz', 'tat'
        ]
      }
    };
    var path = 'root.foo.bar';
    var obj =  'sat';

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      'buz', 'tat', 'sat'
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.0': 'buz',
      'root.foo.bar.1': 'tat',
      'root.foo.bar.2': 'sat'
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('add array of simple nodes to the array ', function(t){
    var json = {
      foo: {
        bar: [
          'buz', 'tat'
        ]
      }
    };
    var path = 'root.foo.bar';
    var obj =  ['sat', 'cit'];

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      'buz', 'tat', 'sat', 'cit'
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2, 3]},
      'root.foo.bar.0': 'buz',
      'root.foo.bar.1': 'tat',
      'root.foo.bar.2': 'sat',
      'root.foo.bar.3': 'cit'
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });


  t.end();
});