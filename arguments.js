exports.get = function() {
	var	pair,
		i,
		argTest = /^\-{1,2}/,
		argv = process.argv,
		args = {};

	for(i = 0; i < argv.length; i++) {
		pair = argv[i].split('=');

		if(argTest.test(pair[0])) {
			pair[0] = pair[0].replace(argTest, '');

			if(pair[1]) {
				args[pair[0]] = pair[1];
			}
			else {
				args[pair[0]] = true;
			}
		}
	}

	return args;
}();
