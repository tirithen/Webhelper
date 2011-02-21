var	watch = require('./watcher').watch,
	exec = require('child_process').exec,
	fs = require('fs'),
	jslint = require('./jslint'),
	phplint = require('./phplint'),
	compass = require('./compass'),
	sys = require('sys'),
	growl,
	hasOwn = Object.prototype.hasOwnProperty,
	args = require('./arguments').get;

function notifyUbuntuNotifySend(title, message) {
	exec('notify-send "' + escapeQuote(title) + '" "' + escapeQuote(message) + '"');
}

function notifyGrowl(title, message) {
	if(!growl) {
		growl = require('growl');
	}

	growl.notify(message, {title: title});
}

function escapeQuote(message) {
	return message.replace('"', '\"');
}

function getLocalFilename(filename) {
	return filename.replace(__dirname + '/', '');
}

function notify(title, message) {
	if(args.verbose) {
		sys.puts(title + '\n' + message);
	}

	if(args.ubuntu) {
		notifyUbuntuNotifySend(title, message);
	}

	if(args.growl) {
		notifyGrowl(title, message);
	}
}

function jsCheck(filename) {
	fs.readFile(filename, 'utf8', function(err, content) {
		if(!err) {
			var	errors,
				error,
				message = [],
				title = 'JSLint, error in \'' + getLocalFilename(filename) + '\' on:',
				i;

			if(!jslint.check(content.replace(/^\#\!.*/, ''))) {
				errors = jslint.check.errors;
				if(errors) {
					for(i in errors) {
						if(hasOwn.call(errors, i) && errors[i]) {
							error = errors[i];
							message.push(error.line + ':' + error.character + ': ' + error.reason);
						}
					}

					notify(title, message.join('\n'));					
				}
			}
		}
	});
}

function phpCheck(filename) {
	var title;

	phplint.check(filename, function(error) {
		if(error) {
			title = 'PHP lint, error in \'' + getLocalFilename(filename) + '\' on:';
			notify(title, error.line + ': ' + error.reason);
		}
	});
}

function compassCompile(folder) {
	compass.compile(folder, function(files) {
		var	i,
			j,
			file,
			errors,
			error,
			title,
			message = [];

		for(i in files) {
			file = files[i];

			title = 'Compass compile, error in \'' + getLocalFilename(file.name) + '\' on:';

			errors = file.errors;
			for(j in errors) {
				error = errors[j];
				message.push(error.line + ': ' + error.reason);
			}

			notify(title, message.join('\n'));
		}
	});
}

if(!args.folder || args.folder === true) {
	args.folder = __dirname;
}

if(!args.folder.match(/\/$/)) {
	args.folder += '/';
}

if(args['check-js']) {
	watch({
		extensions: ['js'],
		folder: args.folder,
		noCheckOnAdd: args['no-check-on-add'],
		callback: function(filename) {
			jsCheck(filename);
		}
	});
}

if(args['check-php']) {
	watch({
		extensions: ['php'],
		folder: args.folder,
		noCheckOnAdd: args['no-check-on-add'],
		callback: function(filename) {
			phpCheck(filename);
		}
	});
}

if(args['compass']) {
	watch({
		extensions: ['scss', 'sass'],
		folder: args.folder,
		noCheckOnAdd: args['no-check-on-add'],
		callback: function() {
			compassCompile(args.folder);
		}
	});
}

console.log(args);
