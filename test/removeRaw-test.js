var test = require('tape'),
  simplify = require('../').simplify,
  removeRaw = require('../').removeRaw,
  remove = require('../').remove
  ;

test('-= removeRaw tests =-', function(t){

  // Remove simple nodes
  t.test('removeRaw simple node from the object ', function(t){
    var data = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';
    var res = {
      foo: {
        buz: 3
      }
    };

    t.deepEqual(removeRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('removeRaw simple node from the array ', function(t){
    var data = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };
    var path = 'root.foo.bar.1';
    var res = {
      foo: {
        bar: [
          'buz', 'sat'
        ]
      }
    };

    t.deepEqual(removeRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Remove complex nodes
  t.test('removeRaw complex node from the object ', function(t){
    var data = {
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
    var res = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };

    t.deepEqual(removeRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('removeRaw complex node from the array ', function(t){
    var data = {
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
    var res = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' }
        ]
      }
    };

    t.deepEqual(removeRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

});