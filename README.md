# Webhelper tools for Linux and Mac OS X

Get debug help independent of which text editor you use.

Helper tools for web developers working with JavaScript, SASS/SCSS and PHP. More languages to come.

Webhelper watches your files in the selected folder and sub folders for changes and automatically checks them when they are changed and then pushes debug info to your favorite notification system (for now notify-send, growl or terminal).

## Installation
	Install node.js from [here](http://nodejs.org/#download)
	Clone the repository
		$ git clone https://github.com/tirithen/Webhelper.git $HOME/source/webhelper
	Compass for CSS SASS/SCSS files, if you have ruby installed
		$ gem install compass

### Ubuntu/Debian users
	Install libnotify-bin for notifications
		$ sudo apt-get install libnotify-bin
	For PHP lint support
		$ sudo apt-get install php5-cli
	Create a file with executable permissions in $HOME/bin/webhelper with your favorite parameters:
		#!/bin/bash
		#
		node $HOME/source/webhelper/webhelper.js --verbose --check-php --check-js --compass --notify-send --folder=./ --no-check-on-add

### Mac OS X users
	Install growl from [here](http://growl.info/).
	Install node-growl, if you have [npm](http://npmjs.org/) installed
		$ sudo npm install growl
	For PHP lint support
		TODO: add instructions for installing php5-cli
	Create a file with executable permissions in $HOME/bin/webhelper with your favorite parameters:
		#!/bin/bash
		#
		node $HOME/source/webhelper/webhelper.js --verbose --check-php --check-js --compass --growl --folder=./ --no-check-on-add

## Usage
	Open terminal in you project folder (compass will work if there are a config.rb in that directory).
	To start webhelper type (assuming that you have $HOME/bin in your $PATH variable):
		$ webhelper
	As soon as you save/add a file in that directory or a sub directory of that directory it will be linted and checked for errors if it is one of the filetypes selected for check.

## Parameters:
--check-js			Check .js files with Crockford's JSLint
--check-php			Check .php files for parse errors (requires php5-cli)
--compass			Check and compile .sass and .scss files with compass (requires that webhelper was started in the directory where config.rb resides)
--verbose			Print output to the terminal
--notify-send		Print output with notify-send (requires libnotify-bin)
--growl				Print output with growl (requires growl)
--no-check-on-add	Do not check files when they are added to the watch list
--folder			Folder to check, defaults to current working directory

## External dependencies:
	- [node.js](http://nodejs.org/) - To run the application (required)
	- [php5-cli](http://php.net/manual/en/features.commandline.php) - Command line PHP (optional)
	- [compass](http://compass-style.org/) - CSS framework (optional)
	- [libnotify-bin](https://launchpad.net/ubuntu/+source/libnotify) - Notification system for Ubuntu/Debian users (optional)
	- [growl](http://growl.info/) - Notification system for Mac OS X users (optional)
	- [node-growl](https://github.com/visionmedia/node-growl) - Growl for node.js (optional)

## License
All files except for Crockford's jslint.js are released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
