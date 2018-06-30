var assert    = require('assert');
var bench     = require('bench');
var bindexOf  = require('./');
var indexof   = require('buffer-indexof');

var bigString         = 'Node.js is a platform built on Chrome\'s JavaScript' +
  ' runtime for easily building fast, scalable network applications.' +
  ' Node.js uses an event-driven, non-blocking I/O model that makes it ' +
  'lightweight and efficient, perfect for data-intensive real-time ' +
  'applications that run across distributed devices.';

var bigBuffer         = new Buffer(bigString);
var toFindInBig       = 'an';
var toFindInBigBuffer = new Buffer(toFindInBig);


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

exports.compare = {
  'use buffer-indexof in a big buffer': function() {
    useIndexOf(bigBuffer, toFindInBigBuffer, 129);
  },
  'use bindexOf in a big buffer': function() {
    useBindexOf(bigBuffer, toFindInBigBuffer, 129);
  },
  'search inside a big string': function() {
    stringSearch(bigString, toFindInBig, 129);
  }
};

bench.runMain();
