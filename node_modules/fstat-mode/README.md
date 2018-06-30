## fstat-mode

A helper for [fs.Stats.mode](https://nodejs.org/api/fs.html#fs_class_fs_stats).


## install

    $ npm install fstat-mode


## usage

	const FStatMode = require("fstat-mode");
	let mode = new FStatMode(stats_from_elsewhere); // fs.Stats or mode number

	mode.is_socket;
	mode.is_symbolic;
	mode.is_regular; 
	mode.is_block;    
	mode.is_directory;
	mode.is_character;
	mode.is_fifo;      
	mode.is_setuid;
	mode.is_setgid;
	mode.is_sticky;

	// rwx
	mode.owner.permission
	mode.owner.read
	mode.owner.write
	mode.owner.execute

	// mode.group*
	// mode.others*

	// regular      -
	// block        b
	// character    c
	// directory    d
	// symbolic     l
	// fifo         p
	// socket       s
	mode.file_type

	// ls -l first column
	// /dev/zero    crw-rw-rw-
	mode.ll

## license

MIT


## contribute

Feel free to file an issue or make a pr.
