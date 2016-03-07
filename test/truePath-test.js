var test = require('tape'),
  truePath = require('../').truePath
  ;

test('-= truePath tests =-', function(t){

  t.test('truePath for simple object ', function(t){
    // raw json equivalent
    //{
    //  foo: {
    //    bar: {
    //      buz: 3,
    //      tat: 5
    //    }
    //  }
    //}
    var data = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'object', childs: ['buz', 'tat']},
      'root.foo.bar.buz': 3,
      'root.foo.bar.tat': 5
    };
    var path = 'root.foo.bar.buz';
    var res =  'root.foo.bar.buz';

    t.equal(truePath(data, path), res);
    t.end();
  });

  t.test('truePath for simple array ', function(t){
    // raw json equivalent to
    //{
    //  foo: {
    //    bar: [
    //      'buz', 'tat', 'sat', 'cit', 'nam'
    //    ]
    //  }
    //}
    var data = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [0, 4, 3, 20, 10]},
      'root.foo.bar.0': 'buz',
      'root.foo.bar.4': 'tat',
      'root.foo.bar.3': 'sat',
      'root.foo.bar.20': 'cit',
      'root.foo.bar.10': 'nam'
    };
    // path - for simplified data
    // truePath - for raw data
    //      path        -     truePath
    // 'root.foo.bar.0' - 'root.foo.bar.0'
    // 'root.foo.bar.4' - 'root.foo.bar.1'
    // 'root.foo.bar.3' - 'root.foo.bar.2'
    // 'root.foo.bar.20' - 'root.foo.bar.3'
    // 'root.foo.bar.10' - 'root.foo.bar.4'

    t.equal(truePath(data, 'root.foo.bar.0'), 'root.foo.bar.0');
    t.equal(truePath(data, 'root.foo.bar.4'), 'root.foo.bar.1');
    t.equal(truePath(data, 'root.foo.bar.3'), 'root.foo.bar.2');
    t.equal(truePath(data, 'root.foo.bar.20'), 'root.foo.bar.3');
    t.equal(truePath(data, 'root.foo.bar.10'), 'root.foo.bar.4');
    t.end();
  });

  t.test('truePath for complex array ', function(t){
    // raw json equivalent
    //{
    //  foo: {
    //    bar: [
    //      { buz: 'qux' },
    //      { tat: 'sat' },
    //      { sat: 3 },
    //      { cit: 8 }
    //    ]
    //  }
    //}
    var data = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [3, 5, 12, 15]},
      'root.foo.bar.3': { type: 'object', childs: ['buz']},
      'root.foo.bar.3.buz': 'qux',
      'root.foo.bar.5': { type: 'object', childs: ['tat']},
      'root.foo.bar.5.tat': 'sat',
      'root.foo.bar.12': { type: 'object', childs: ['sat']},
      'root.foo.bar.12.sat': 3,
      'root.foo.bar.15': { type: 'object', childs: ['cit']},
      'root.foo.bar.15.cit': 8
    };
    // path - for simplified data
    // truePath - for raw data
    //        path            -       truePath
    // 'root.foo.bar.3'       - 'root.foo.bar.0'
    // 'root.foo.bar.3.buz'   - 'root.foo.bar.0.buz'
    // 'root.foo.bar.5'       - 'root.foo.bar.1'
    // 'root.foo.bar.5.tat'   - 'root.foo.bar.1.tat'
    // 'root.foo.bar.12'      - 'root.foo.bar.2'
    // 'root.foo.bar.12.sat'  - 'root.foo.bar.2.sat'
    // 'root.foo.bar.15'      - 'root.foo.bar.3'
    // 'root.foo.bar.15.cit'  - 'root.foo.bar.3.cit'

    t.equal(truePath(data, 'root.foo.bar.3'), 'root.foo.bar.0');
    t.equal(truePath(data, 'root.foo.bar.3.buz'), 'root.foo.bar.0.buz');
    t.equal(truePath(data, 'root.foo.bar.5'), 'root.foo.bar.1');
    t.equal(truePath(data, 'root.foo.bar.5.tat'), 'root.foo.bar.1.tat');
    t.equal(truePath(data, 'root.foo.bar.12'), 'root.foo.bar.2');
    t.equal(truePath(data, 'root.foo.bar.12.sat'), 'root.foo.bar.2.sat');
    t.equal(truePath(data, 'root.foo.bar.15'), 'root.foo.bar.3');
    t.equal(truePath(data, 'root.foo.bar.15.cit'), 'root.foo.bar.3.cit');
    t.end();
  });

  t.test('truePath for complex data with nested arrays ', function(t){
    // raw json equivalent
    //{
    //  foo: {
    //    bar: [
    //      { buz: [1, 2, 3] },
    //      { tat: [ { a: 1 }, { b: 2 }, { c: 3 } ] },
    //      { sat: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ] },
    //    ]
    //  }
    //}
    var data = {
      'root': { type: 'object', childs: ['foo']},
      'root.foo': { type: 'object', childs: ['bar']},
      'root.foo.bar': { type: 'array', childs: [3, 5, 12]},

      'root.foo.bar.3': { type: 'object', childs: ['buz']},
      'root.foo.bar.3.buz': { type: 'array', childs: [10, 20, 30]},
      'root.foo.bar.3.buz.10': 1,
      'root.foo.bar.3.buz.20': 2,
      'root.foo.bar.3.buz.30': 3,

      'root.foo.bar.5': { type: 'object', childs: ['tat']},
      'root.foo.bar.5.tat': { type: 'array', childs: [10, 20, 30]},
      'root.foo.bar.5.tat.10': { type: 'object', childs: ['a']},
      'root.foo.bar.5.tat.10.a': 1,
      'root.foo.bar.5.tat.20': { type: 'object', childs: ['b']},
      'root.foo.bar.5.tat.20.b': 2,
      'root.foo.bar.5.tat.30': { type: 'object', childs: ['c']},
      'root.foo.bar.5.tat.30.c': 3,

      'root.foo.bar.12': { type: 'object', childs: ['sat']},
      'root.foo.bar.12.sat': { type: 'array', childs: [10, 20, 30]},
      'root.foo.bar.12.sat.10': { type: 'array', childs: [0, 10, 20]},
      'root.foo.bar.12.sat.10.0': 1,
      'root.foo.bar.12.sat.10.10': 2,
      'root.foo.bar.12.sat.10.20': 3,
      'root.foo.bar.12.sat.20': { type: 'array', childs: [0, 10, 20]},
      'root.foo.bar.12.sat.20.0': 4,
      'root.foo.bar.12.sat.20.10': 5,
      'root.foo.bar.12.sat.20.20': 6,
      'root.foo.bar.12.sat.30': { type: 'array', childs: [0, 10, 20]},
      'root.foo.bar.12.sat.30.0': 7,
      'root.foo.bar.12.sat.30.10': 8,
      'root.foo.bar.12.sat.30.20': 8,

    };

    t.equal(truePath(data, 'root.foo.bar.3'), 'root.foo.bar.0');
    t.equal(truePath(data, 'root.foo.bar.3.buz'), 'root.foo.bar.0.buz');
    t.equal(truePath(data, 'root.foo.bar.3.buz.10'), 'root.foo.bar.0.buz.0');
    t.equal(truePath(data, 'root.foo.bar.3.buz.20'), 'root.foo.bar.0.buz.1');
    t.equal(truePath(data, 'root.foo.bar.3.buz.30'), 'root.foo.bar.0.buz.2');

    t.equal(truePath(data, 'root.foo.bar.5'), 'root.foo.bar.1');
    t.equal(truePath(data, 'root.foo.bar.5.tat'), 'root.foo.bar.1.tat');
    t.equal(truePath(data, 'root.foo.bar.5.tat.10'), 'root.foo.bar.1.tat.0');
    t.equal(truePath(data, 'root.foo.bar.5.tat.10.a'), 'root.foo.bar.1.tat.0.a');
    t.equal(truePath(data, 'root.foo.bar.5.tat.20'), 'root.foo.bar.1.tat.1');
    t.equal(truePath(data, 'root.foo.bar.5.tat.20.b'), 'root.foo.bar.1.tat.1.b');
    t.equal(truePath(data, 'root.foo.bar.5.tat.30'), 'root.foo.bar.1.tat.2');
    t.equal(truePath(data, 'root.foo.bar.5.tat.30.c'), 'root.foo.bar.1.tat.2.c');

    t.equal(truePath(data, 'root.foo.bar.12'), 'root.foo.bar.2');
    t.equal(truePath(data, 'root.foo.bar.12.sat'), 'root.foo.bar.2.sat');
    t.equal(truePath(data, 'root.foo.bar.12.sat.10'), 'root.foo.bar.2.sat.0');
    t.equal(truePath(data, 'root.foo.bar.12.sat.10.0'), 'root.foo.bar.2.sat.0.0');
    t.equal(truePath(data, 'root.foo.bar.12.sat.10.10'), 'root.foo.bar.2.sat.0.1');
    t.equal(truePath(data, 'root.foo.bar.12.sat.10.20'), 'root.foo.bar.2.sat.0.2');
    t.equal(truePath(data, 'root.foo.bar.12.sat.20'), 'root.foo.bar.2.sat.1');
    t.equal(truePath(data, 'root.foo.bar.12.sat.20.0'), 'root.foo.bar.2.sat.1.0');
    t.equal(truePath(data, 'root.foo.bar.12.sat.20.10'), 'root.foo.bar.2.sat.1.1');
    t.equal(truePath(data, 'root.foo.bar.12.sat.20.20'), 'root.foo.bar.2.sat.1.2');
    t.equal(truePath(data, 'root.foo.bar.12.sat.30'), 'root.foo.bar.2.sat.2');
    t.equal(truePath(data, 'root.foo.bar.12.sat.30.0'), 'root.foo.bar.2.sat.2.0');
    t.equal(truePath(data, 'root.foo.bar.12.sat.30.10'), 'root.foo.bar.2.sat.2.1');
    t.equal(truePath(data, 'root.foo.bar.12.sat.30.20'), 'root.foo.bar.2.sat.2.2');

    t.end();
  });

});