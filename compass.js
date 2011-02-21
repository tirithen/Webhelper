var exec = require('child_process').exec,
	path = require('path');

// TODO: wrong scss filename is used in the title, probobly in webhelper.js...
// TODO: seemes like message is duplicated sometimes

exports.compile = function(folder, callback) {
	path.exists(folder + 'config.rb', function(exists) {
		var	files = {},
			i,
			row,
			matches,
			key;

		if(exists) {
			exec('compass compile --quiet --boring --force ' + folder, function(error, stdoutput, stderror) {
				rows = stdoutput.split('\n');
				for(var i = 0; i < rows.length; i++) {
					row = rows[i];
					if(row.match(/^\s+(error)\s/)) {
						matches = row.match(/^\s+error\s(.+)\s\(Line\s([0-9]+)\:\s(.+)\)$/);
						key = matches[1] + ':' + matches[2];
						if(!files[key]) {
							files[key] = {name: matches[1], errors: []};
						}

						files[key].errors.push({
							line: matches[2],
							reason: matches[3]
						});
					}
				}

				if(callback) {
					callback(files);
				}
			});
		}
	});
};
