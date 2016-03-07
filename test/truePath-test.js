var test = require('tape'),
  truePath = require('../').truePath
  ;

test('-= truePath tests =-', function(t){

  // truePath for simple nodes
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
});