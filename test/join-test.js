var test = require('tape'),
  join = require('../').join
  ;

test('-= join tests =-', function(t){

  t.test('simple join ', function(t){
    t.equal(join('root'), 'root');
    t.equal(join('','root',''), 'root');
    t.equal(join('','root',''), 'root');
    t.equal(join('root','path','to','component'), 'root.path.to.component');
    t.equal(join('root','path.to', '', null, undefined, 'component', ''), 'root.path.to.component');
    t.end();
  });

});