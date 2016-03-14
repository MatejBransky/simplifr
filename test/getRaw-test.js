var test = require('tape'),
  getRaw = require('../').getRaw
  ;

test('-= getRaw tests =-', function(t){

  // get simple node
  t.test('getRaw simple node in the object ', function(t){
    var data = {
      foo: {
        bar: 'str',
        buz: 3
      }
    };

    t.deepEqual(getRaw(data, 'root'), data);
    t.deepEqual(getRaw(data, 'root.foo'), { bar: 'str', buz: 3 });
    t.deepEqual(getRaw(data, 'root.foo.bar'), 'str');
    t.deepEqual(getRaw(data, 'root.foo.buz'), 3);
    t.end();
  });

  t.test('getRaw simple node in the array ', function(t){
    var data = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };

    t.deepEqual(getRaw(data, 'root'), data);
    t.deepEqual(getRaw(data, 'root.foo'), { bar: ['buz', 'tat', 'sat'] });
    t.deepEqual(getRaw(data, 'root.foo.bar'), ['buz', 'tat', 'sat']);
    t.deepEqual(getRaw(data, 'root.foo.bar.1'), 'tat');
    t.end();
  });

  // getRaw complex nodes
  t.test('getRaw complex node in the object ', function(t){
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

    t.deepEqual(getRaw(data, 'root'), data);
    t.deepEqual(getRaw(data, 'root.foo.bar.tat'), { sat: { nam: 8 }, cit: ['om', 'mani'] });
    t.deepEqual(getRaw(data, 'root.foo.bar.tat.sat.nam'), 8);
    t.deepEqual(getRaw(data, 'root.foo.bar.tat.cit.0'), 'om');
    t.end();
  });

  t.test('getRaw complex node in the array ', function(t){
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

    t.deepEqual(getRaw(data, 'root'), data);
    t.deepEqual(getRaw(data, 'root.foo.bar.1'), { tat: 'sat' });
    t.deepEqual(getRaw(data, 'root.foo.bar.2.cit'), ['om', 'mani']);
    t.deepEqual(getRaw(data, 'root.foo.bar.2.cit.1'), 'mani');
    t.end();
  });

});