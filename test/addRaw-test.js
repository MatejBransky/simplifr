var test = require('tape'),
  addRaw = require('../').addRaw
  ;

test('-= addRaw tests =-', function(t){

  // Add simple nodes
  t.test('addRaw simple single node to the object ', function(t){
    var data = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };
    var path = 'root.foo.bar';
    var obj =  { tat: 5 };
    var res = {
      foo: {
        bar: {
          buz: 3,
          tat: 5
        }
      }
    };

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('addRaw simple nodes to the object ', function(t){
    var data = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };
    var path = 'root.foo.bar';
    var obj =  { tat: 5, sat: 'om', cit: 'nam' };
    var res = {
      foo: {
        bar: {
          buz: 3,
          tat: 5,
          sat: 'om',
          cit: 'nam'
        }
      }
    };

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('addRaw simple single node to the array ', function(t){
    var data = {
      foo: {
        bar: [
          'buz', 'tat'
        ]
      }
    };
    var path = 'root.foo.bar';
    var obj =  'sat';
    var res = {
      foo: {
        bar: [
          'buz', 'tat', 'sat'
        ]
      }
    };

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('addRaw array of simple nodes to the array ', function(t){
    var data = {
      foo: {
        bar: [
          'buz', 'tat'
        ]
      }
    };
    var path = 'root.foo.bar';
    var obj =  ['sat', 'cit'];
    var res = {
      foo: {
        bar: [
          'buz', 'tat', 'sat', 'cit'
        ]
      }
    };

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  // Add complex nodes
  t.test('addRaw complex single node to the object ', function(t){
    var data = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };
    var path = 'root.foo.bar';
    var obj =  {
      tat: {
        sat: {
          nam: 8
        },
        cit: ['om', 'mani']
      }
    };
    var res = {
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

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('addRaw complex nodes to the object ', function(t){
    var data = {
      foo: {
        bar: {
          buz: 3
        }
      }
    };
    var path = 'root.foo.bar';
    var obj =  {
      tat: {
        sat: {
          nam: 8
        },
        cit: ['om', 'mani']
      },
      tapa: {
        sat: {
          nam: 8
        },
        cit: ['om', 'mani']
      }
    };
    var res = {
      foo: {
        bar: {
          buz: 3,
          tat: {
            sat: {
              nam: 8
            },
            cit: ['om', 'mani']
          },
          tapa: {
            sat: {
              nam: 8
            },
            cit: ['om', 'mani']
          }
        }
      }
    };

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('addRaw complex single node to the array ', function(t){
    var data = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' }
        ]
      }
    };
    var path = 'root.foo.bar';
    var obj = {
      sat: {
        nam: 8
      },
      cit: ['om', 'mani']
    };
    var res = {
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

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.test('addRaw array of complex nodes to the array ', function(t){
    var data = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' }
        ]
      }
    };
    var path = 'root.foo.bar';
    var obj = [
      {
        sat: {
          nam: 8
        },
        cit: ['om', 'mani']
      }, {
        sat: {
          nam: 8
        },
        cit: ['om', 'mani']
      }
    ];

    var res = {
      foo: {
        bar: [
          { buz: 'qux' },
          { tat: 'sat' },
          {
            sat: {
              nam: 8
            },
            cit: ['om', 'mani']
          },
          {
            sat: {
              nam: 8
            },
            cit: ['om', 'mani']
          }
        ]
      }
    };

    t.deepEqual(addRaw(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

  t.end();
});