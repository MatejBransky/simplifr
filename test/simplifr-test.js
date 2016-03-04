var test = require('tape'),
  simplify = require('../').simplify,
  add = require('../').add,
  remove = require('../').remove,
  reset = require('../').reset
  ;

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

  // Add simple nodes
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
    var obj =  { tat: 5, sat: 'om', cit: 'nam' };

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: 5,
    //      sat: 'om',
    //      cit: 'nam'
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
      'root.foo.bar.cit': 'nam'
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

  // Add complex nodes
  t.test('add complex single node to the object ', function(t){
    var json = {
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

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: {
    //        sat: {
    //          nam: 8
    //        },
    //        cit: ['om', 'mani']
    //      }
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': { type: 'object', childs: ['sat', 'cit']},
      'root.foo.bar.tat.sat': { type: 'object', childs: ['nam']},
      'root.foo.bar.tat.sat.nam': 8,
      'root.foo.bar.tat.cit': { type: 'array', childs: [0, 1]},
      'root.foo.bar.tat.cit.0': 'om',
      'root.foo.bar.tat.cit.1': 'mani',
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });
  t.test('add complex nodes to the object ', function(t){
    var json = {
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

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: {
    //        sat: {
    //          nam: 8
    //        },
    //        cit: ['om', 'mani']
    //      },
    //      tapa: {
    //        sat: {
    //          nam: 8
    //        },
    //        cit: ['om', 'mani']
    //      }
    //    }
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat', 'tapa']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': { type: 'object', childs: ['sat', 'cit']},
      'root.foo.bar.tat.sat': { type: 'object', childs: ['nam']},
      'root.foo.bar.tat.sat.nam': 8,
      'root.foo.bar.tat.cit': { type: 'array', childs: [0, 1]},
      'root.foo.bar.tat.cit.0': 'om',
      'root.foo.bar.tat.cit.1': 'mani',
      'root.foo.bar.tapa': { type: 'object', childs: ['sat', 'cit']},
      'root.foo.bar.tapa.sat': { type: 'object', childs: ['nam']},
      'root.foo.bar.tapa.sat.nam': 8,
      'root.foo.bar.tapa.cit': { type: 'array', childs: [0, 1]},
      'root.foo.bar.tapa.cit.0': 'om',
      'root.foo.bar.tapa.cit.1': 'mani',
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });
  t.test('add complex single node to the array ', function(t){
    var json = {
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

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      { buz: 'qux' },
    //      { tat: 'sat' },
    //      {
    //        sat: {
    //          nam: 8
    //        },
    //        cit: ['om', 'mani']
    //      }
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
      'root.foo.bar.2': { type: 'object', childs: ['sat', 'cit']},
      'root.foo.bar.2.sat': { type: 'object', childs: ['nam']},
      'root.foo.bar.2.sat.nam': 8,
      'root.foo.bar.2.cit': { type: 'array', childs: [0, 1]},
      'root.foo.bar.2.cit.0': 'om',
      'root.foo.bar.2.cit.1': 'mani'
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });
  t.test('add array of complex nodes to the array ', function(t){
    var json = {
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

    // add `obj` to the `path` node
    // the result is equivalent to
    //{
    //  foo: {
    //    bar: [
    //      { buz: 'qux' },
    //      { tat: 'sat' },
    //      {
    //        sat: {
    //          nam: 8
    //        },
    //        cit: ['om', 'mani']
    //      },
    //      {
    //        sat: {
    //          nam: 8
    //        },
    //        cit: ['om', 'mani']
    //      }
    //    ]
    //  }
    //}
    var res = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 1, 2, 3]},
      'root.foo.bar.0': { type: 'object', childs: ['buz']},
      'root.foo.bar.0.buz': 'qux',
      'root.foo.bar.1': { type: 'object', childs: ['tat']},
      'root.foo.bar.1.tat': 'sat',
      'root.foo.bar.2': { type: 'object', childs: ['sat', 'cit']},
      'root.foo.bar.2.sat': { type: 'object', childs: ['nam']},
      'root.foo.bar.2.sat.nam': 8,
      'root.foo.bar.2.cit': { type: 'array', childs: [0, 1]},
      'root.foo.bar.2.cit.0': 'om',
      'root.foo.bar.2.cit.1': 'mani',
      'root.foo.bar.3': { type: 'object', childs: ['sat', 'cit']},
      'root.foo.bar.3.sat': { type: 'object', childs: ['nam']},
      'root.foo.bar.3.sat.nam': 8,
      'root.foo.bar.3.cit': { type: 'array', childs: [0, 1]},
      'root.foo.bar.3.cit.0': 'om',
      'root.foo.bar.3.cit.1': 'mani'
    }
    var data = simplify(json);
    t.deepEqual(add(data, path, obj), res);
    t.deepEqual(data, res);
    t.end();
  });

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

  t.end();
});