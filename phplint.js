var exec = require('child_process').exec;

exports.check = function(filename, callback) {
	var errors = [],
		status,
		message;

	exec('php -l ' + filename, function(error, stdoutput, stderror) {
		status = stdoutput.split(' ');
		if(status[0] === 'Errors' && status[1] === 'parsing' && callback) {
			message = stderror.split(' in ' + filename + ' on line ');
			callback({
				reason: message[0].replace('PHP Parse error:  ', ''),
				line: message[1].match(/[0-9]+/)
			});
		}
	});
};
