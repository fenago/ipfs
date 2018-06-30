var assert    = require('assert');
var bench     = require('bench');
var bindexOf  = require('./');
var indexof   = require('buffer-indexof');

var smallString   = 'hi\nho\nsilver';
var smallBuffer   = new Buffer(smallString);
var toFind        = '\n';
var toFindBuffer  = new Buffer(toFind);

function useIndexOf(buffer, find, pos) {
  var res = indexof(buffer, find);
  assert.equal(res, pos);
  return res;
}

function useBindexOf(buffer, find, pos) {
  var res = bindexOf(buffer, find);
  assert.equal(res, pos);
  return res;
}

function stringSearch(string, find, pos) {
  var res = string.indexOf(find);
  assert.equal(res, pos);
  return res;
}

function convertBufferToString(buffer, find) {
  var res = buffer.toString().indexOf(find.toString());
  assert.equal(res, 2);
  return res;
}

//
//
//
exports.compare = {
  'use buffer-indexof in a small buffer': function() {
    useIndexOf(smallBuffer, toFindBuffer, 2);
  },
  'use bindexOf in a small buffer': function() {
    useBindexOf(smallBuffer, toFindBuffer, 2);
  },
  'search inside a small string': function() {
    stringSearch(smallString, toFind, 2);
  },

  'buffer to string and make the search': function() {
    convertBufferToString(smallBuffer, toFindBuffer);
  },

};

bench.runMain();
