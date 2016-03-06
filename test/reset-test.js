var test = require('tape'),
  simplify = require('../').simplify,
  reset = require('../').reset
  ;

test('-= reset tests =-', function(t){

  // Reset simple nodes
  t.test('reset simple node in the object ', function(t){
    var json = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';

    // reset `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: null,
    //    buz: 3
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar', 'buz']},
      'root.foo.bar': null,
      'root.foo.buz': 3
    }
    var data = simplify(json);
    t.deepEqual(reset(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('reset simple node in the array ', function(t){
    var json = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };
    var path = 'root.foo.bar.1';

    // reset the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      'buz', null, 'sat'
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.0': 'buz',
      'root.foo.bar.1': null,
      'root.foo.bar.2': 'sat'
    }
    var data = simplify(json);
    t.deepEqual(reset(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Reset complex nodes
  t.test('reset complex node in the object ', function(t){
    var json = {
      foo: {
        bar: {
          buz: 3,
          tat: {
            sat: {
              nam: 8
            },
            cit: ['om', 'mani']
          }
        }
      }
    };
    var path = 'root.foo.bar.tat';

    // reset the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: null
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': null
    }
    var data = simplify(json);

    t.deepEqual(reset(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('reset complex node in the array ', function(t){
    var json = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' },
          {
            sat: {
              nam: 8
            },
            cit: ['om', 'mani']
          }
        ]
      }
    };
    var path = 'root.foo.bar.2';

    // reset the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      { buz: 'qux' },
    //      { tat: 'sat' },
    //      null
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.0': { type: 'object', childs: ['buz']},
      'root.foo.bar.0.buz': 'qux',
      'root.foo.bar.1': { type: 'object', childs: ['tat']},
      'root.foo.bar.1.tat': 'sat',
      'root.foo.bar.2': null
    }
    var data = simplify(json);
    t.deepEqual(reset(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

});