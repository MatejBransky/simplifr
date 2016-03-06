var test = require('tape'),
  simplify = require('../').simplify,
  remove = require('../').remove
  ;

test('-= remove tests =-', function(t){

  // Remove simple nodes
  t.test('remove simple node from the object ', function(t){
    var json = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';

    // remove `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    buz: 3
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['buz']},
      'root.foo.buz': 3
    }
    var data = simplify(json);
    t.deepEqual(remove(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('remove simple node from the array ', function(t){
    var json = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };
    var path = 'root.foo.bar.1';

    // remove the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      'buz', 'sat'
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 2]},
      'root.foo.bar.0': 'buz',
      'root.foo.bar.2': 'sat'
    }
    var data = simplify(json);
    t.deepEqual(remove(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Remove complex nodes
  t.test('remove complex node from the object ', function(t){
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

    // remove the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz']},
      'root.foo.bar.buz': 3
    }
    var data = simplify(json);

    t.deepEqual(remove(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('remove complex node from the array ', function(t){
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

    // remove the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      { buz: 'qux' },
    //      { tat: 'sat' }
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1]},
      'root.foo.bar.0': { type: 'object', childs: ['buz']},
      'root.foo.bar.0.buz': 'qux',
      'root.foo.bar.1': { type: 'object', childs: ['tat']},
      'root.foo.bar.1.tat': 'sat'
    }
    var data = simplify(json);
    t.deepEqual(remove(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

});