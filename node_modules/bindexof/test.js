var tape      = require('tape');
var bindexOf  = require('./');

var buffer = new Buffer('Node.js is a platform built on Chrome.');

tape('searches the index for a buffer in a buffer', function(assert) {
  var index = bindexOf(buffer, new Buffer('on'));
  assert.deepEqual(index, 28, 'should find `on` and return position 28.');

  index = bindexOf(buffer, new Buffer('HELLO'));
  assert.deepEqual(index, -1, 'shouldn\'t find anything and return -1.');

  index = bindexOf(new Buffer('a'), new Buffer('abc'));
  assert.deepEqual(index, -1, 'search buffer bigger than the buffer');

  index = bindexOf(new Buffer('aaa'), new Buffer('aa'), 2);
  assert.deepEqual(index, -1,
    'offset plus the search buffer bigger than the buffer');

  assert.end();
});
