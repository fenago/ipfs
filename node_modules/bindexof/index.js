'use strict';

module.exports = bindexOf;

function bindexOf(buffer, search, offset) {
  offset = offset || 0;

  if (search.length + offset > buffer.length) {
    return -1;
  }

  var x = 0;
  var f = -1;

  for (; offset < buffer.length; offset++) {
    if (buffer[offset] === search[x]) {
      if (!~f) {
        f = offset;
      }
      if (++x === search.length) {
        break;
      }
    } else {
      f = -1;
      x = 0;
    }
  }

  return f;
}
