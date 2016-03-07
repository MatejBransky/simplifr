var test = require('tape'),
  resetRaw = require('../').resetRaw
  ;

test('-= resetRaw tests =-', function(t){

  // Reset simple nodes
  t.test('resetRaw simple node in the object ', function(t){
    var data = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';
    var res = {
      foo: {
        bar: null,
        buz: 3
      }
    }

    t.deepEqual(resetRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('resetRaw simple node in the array ', function(t){
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
          'buz', null, 'sat'
        ]
      }
    };

    t.deepEqual(resetRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Reset complex nodes
  t.test('resetRaw complex node in the object ', function(t){
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
          buz: 3,
          tat: null
        }
      }
    };

    t.deepEqual(resetRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('resetRaw complex node in the array ', function(t){
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
          { tat: 'sat' },
          null
        ]
      }
    };

    t.deepEqual(resetRaw(data, path), res);
    t.deepEqual(data, res);
    t.end();
  });

});