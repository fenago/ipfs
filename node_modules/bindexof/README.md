# bindexOf

<a href="https://nodei.co/npm/bindexof/"><img src="https://nodei.co/npm/bindexOf.png?downloads=true"></a>

[![Build Status](https://travis-ci.org/joaquimserafim/bindexOf.png?branch=master)](https://travis-ci.org/joaquimserafim/bindexOf)


####summary
Find the index of a buffer inside another Buffer, runs pretty well for small buffers or searches that the searchValue is found near the beginning, returns the first occurrence of the specified value, starting the search at fromIndex, returns -1 if the value is not found.

**Case-sensitivity:** The `bindexOf` is case sensitive.

**Benchmark:** run `npm run bench1 && npm run bench2` to see some results.

node v0.10.\*


####app

	bindexOf(buffer, searchBuffer[, fromIndex]])
	
 **fromIndex**
*The location to start the search from. It can be any integer between 0 and the length of the buffer. The default value is 0.*

####example

	var bindexOf = require('bindexof');
	
	
	var buffer = new Buffer('Node.js is a platform built on Chrome\'s JavaScript ' +
                   'runtime for easily building fast, scalable network ' + 
                   'applications.platform');
                
                
    var buffer_to_find = new Buffer('easily');
    
    
    var find = bindexOf(buffer, buffer_to_find);
    
    console.log(find); // index 63
