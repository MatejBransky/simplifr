var test = require('tape'),
  updateRaw = require('../').updateRaw
  ;

test('-= updateRaw tests =-', function(t){

  // Update simple nodes
  t.test('updateRaw simple node in the object ', function(t){
    var data = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';
    var obj = 'new value';
    var res = {
      foo: {
        bar: 'new value',
        buz: 3
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('updateRaw simple node in the object with function ', function(t){
    var data = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };
    var path = 'root.foo.bar';
    var obj = function(prev){ return 'new ' + prev; };
    var res = {
      foo: {
        bar: 'new str',
        buz: 3
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('updateRaw simple node in the array ', function(t){
    var data = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };
    var path = 'root.foo.bar.1';
    var obj = 'cit';
    var res = {
      foo: {
        bar: [
          'buz', 'cit', 'sat'
        ]
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('updateRaw simple node in the array with function ', function(t){
    var data = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };
    var path = 'root.foo.bar.1';
    var obj = function(prev){return prev + '-cit'; };
    var res = {
      foo: {
        bar: [
          'buz', 'tat-cit', 'sat'
        ]
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Update complex nodes
  t.test('updateRaw complex node in the object ', function(t){
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
    var obj = [1, 2, 3];
    var res = {
      foo: {
        bar: {
          buz: 3,
          tat: [1, 2, 3]
        }
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('updateRaw complex node in the object with function ', function(t){
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
    var obj = function(prev){
      return [prev.sat.nam, prev.cit[0], prev.cit[1]]};
    var res = {
      foo: {
        bar: {
          buz: 3,
          tat: [8, 'om', 'mani']
        }
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('updateRaw complex node in the array ', function(t){
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
    var obj = { cit: 'nam' };
    var res = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' },
          { cit: 'nam' }
        ]
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('updateRaw complex node in the array with function', function(t){
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
    var obj = function(prev){
      return { [Object.keys(prev)[1]]: 'nam' + prev.sat.nam };
    }
    var res = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' },
          { cit: 'nam8' }
        ]
      }
    };

    t.deepEqual(updateRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });
});