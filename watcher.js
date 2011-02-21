var	fs = require('fs'),
	path = require('path');

exports.watch = function(node) {
	var	folder = node.folder,
		extensions = node.extensions,
		watchCallback = node.callback,
		noCheckOnAdd = node.noCheckOnAdd,
		filesWatched = [],
		fileEndings = new RegExp('(.' + extensions.join('|.') + ')$'),
		reloadDelay = 10000,
		reloadTimer;

	updateFilesWatched(folder);

	function watch(filename) {
		if(!noCheckOnAdd) {
			watchCallback(filename);
		}

		fs.watchFile(filename, function(curr, prev) {
			if(curr.mtime.getTime() !== prev.mtime.getTime()) {
				watchCallback(filename);
			}
		});
	}

	function updateFilesWatched(filename) {
		filename = filename.replace('//', '/');
		cleanFilesWatched();
		fs.stat(filename, function(error, stats) {
			if(stats) {
				if(stats.isFile() && filename.match(fileEndings)) {
					if(!inArray(filename, filesWatched)) {
						filesWatched.push(filename);
						watch(filename);
					}
				}
				else if(stats.isDirectory()) {
					fs.readdir(filename, function(error, files) {
						for(var i in files) {
							updateFilesWatched(filename + '/' + files[i]);
						}
					});
				}
			}

			clearTimeout(reloadTimer);
			reloadTimer = setTimeout(function() {
				updateFilesWatched(folder);
			}, reloadDelay);
		});
	}

	function cleanFilesWatched() { // TODO: this sometimes triggers an eternal loop of notifications
		for(var i in filesWatched) {
			path.exists(filesWatched[i], function(exists) {
				if(!exists) {
					fs.unwatchFile(filesWatched[i]);
					delete filesWatched[i];
				}
			});
		}
	}

	function inArray(needle, haystack) {
		for(var i in haystack) {
			if(haystack[i]  === needle) {
				return true;
			}
		}

		return false;
	}
};
