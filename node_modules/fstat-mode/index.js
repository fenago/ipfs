// see more on http://man7.org/linux/man-pages/man7/inode.7.html

const S_IFMT   = 0170000;    // bit mask for file type bit
const S_IFSOCK = 0140000;    // socket
const S_IFLNK  = 0120000;    // symbolic link
const S_IFREG  = 0100000;    // regular file
const S_IFBLK  = 0060000;    // block device
const S_IFDIR  = 0040000;    // directory
const S_IFCHR  = 0020000;    // character device
const S_IFIFO  = 0010000;    // FIFO
const S_ISUID  = 04000;      // set-user-ID bit
const S_ISGID  = 02000;      // set-group-ID bit
const S_ISVTX  = 01000;      // sticky bit
const S_IRWXU  = 00700;      // owner has rwx permission
const S_IRUSR  = 00400;      // owner has r permission
const S_IWUSR  = 00200;      // owner has w permission
const S_IXUSR  = 00100;      // owner has x permission
const S_IRWXG  = 00070;      // group has rwx permission
const S_IRGRP  = 00040;      // group has r permission
const S_IWGRP  = 00020;      // group has w permission
const S_IXGRP  = 00010;      // group has x permission
const S_IRWXO  = 00007;      // others has rwx permission
const S_IROTH  = 00004;      // others has r permission
const S_IWOTH  = 00002;      // others has w permission
const S_IXOTH  = 00001;      // others has x permission

class FStatMode {
	constructor(mode) {
		this.mode         = mode.mode ? mode.mode : mode;

		this.is_socket    = this._is_set(S_IFSOCK);
		this.is_symbolic  = this._is_set(S_IFLNK);
		this.is_regular   = this._is_set(S_IFREG);
		this.is_block     = this._is_set(S_IFBLK);
		this.is_directory = this._is_set(S_IFDIR);
		this.is_character = this._is_set(S_IFCHR);
		this.is_fifo      = this._is_set(S_IFIFO);
		this.is_setuid    = this._is_set(S_ISUID);
		this.is_setgid    = this._is_set(S_ISGID);
		this.is_sticky    = this._is_set(S_ISVTX);

		this.owner = {
			read:    this._is_set(S_IRUSR),
			write:   this._is_set(S_IWUSR),
			execute: this._is_set(S_IXUSR)
		};
		this.owner.permission = (() => {
			let rwx = "";
			rwx += this.owner.read  ? "r" : "-";
			rwx += this.owner.write ? "w" : "-";
			rwx += this.owner.execute ? "x" : (this.is_setuid ? "S" : "-");
			return rwx;
		})();

		this.group = {
			read:    this._is_set(S_IRGRP),
			write:   this._is_set(S_IWGRP),
			execute: this._is_set(S_IXGRP)
		};
		this.group.permission = (() => {
			let rwx = "";
			rwx += this.group.read  ? "r" : "-";
			rwx += this.group.write ? "w" : "-";
			rwx += this.group.execute ? "x" : (this.is_setgid ? "s" : "-");
			return rwx;
		})();

		this.others = {
			read:    this._is_set(S_IROTH),
			write:   this._is_set(S_IWOTH),
			execute: this._is_set(S_IXOTH)
		};
		this.others.permission = (() => {
			let rwx = "";
			rwx += this.others.read  ? "r" : "-";
			rwx += this.others.write ? "w" : "-";
			rwx += (() => {
				if (!this.sticky) return this.others.execute ? "x" : "-";
				return this.others.execute ? "t" : "T";
			})();
			return rwx;
		})();

		this.file_type = (() => {
			if (this.is_regular)   return "-";
			if (this.is_block)     return "b";
			if (this.is_character) return "c";
			if (this.is_directory) return "d";
			if (this.is_symbolic)  return "l";
			if (this.is_fifo)      return "p";
			if (this.is_socket)    return "s";
		})();

		this.ll = this.file_type + this.owner.permission
								 + this.group.permission
								 + this.others.permission;
	}
	
	_is_set(flag) {
		return flag == (this.mode & flag);
	}
}

module.exports = FStatMode;
