var test = require('tape'),
  simplify = require('../').simplify,
  update = require('../').update
  ;

test('-= update tests =-', function(t){

  // Update simple nodes
  t.test('update simple node in the object ', function(t){
    var json = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';
    var obj = 'new value';

    // update `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: 'new value',
    //    buz: 3
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar', 'buz']},
      'root.foo.bar': 'new value',
      'root.foo.buz': 3
    }
    var data = simplify(json);
    t.deepEqual(update(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('update simple node in the array ', function(t){
    var json = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };
    var path = 'root.foo.bar.1';
    var obj = 'cit';

    // update the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      'buz', 'cit', 'sat'
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.0': 'buz',
      'root.foo.bar.1': 'cit',
      'root.foo.bar.2': 'sat'
    }
    var data = simplify(json);
    t.deepEqual(update(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Update complex nodes
  t.test('update complex node in the object ', function(t){
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
    var obj = [1, 2, 3];

    // update the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: [1, 2, 3]
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': { type: 'array', childs: [0, 1, 2]},
      'root.foo.bar.tat.0': 1,
      'root.foo.bar.tat.1': 2,
      'root.foo.bar.tat.2': 3
    }
    var data = simplify(json);

    t.deepEqual(update(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('update complex node in the array ', function(t){
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
    var obj = { cit: 'nam' };

    // update the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      { buz: 'qux' },
    //      { tat: 'sat' },
    //      { cit: 'nam' }
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
      'root.foo.bar.2': { type: 'object', childs: ['cit']},
      'root.foo.bar.2.cit': 'nam',
    }
    var data = simplify(json);
    t.deepEqual(update(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

});