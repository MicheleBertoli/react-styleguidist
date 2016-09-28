#!/usr/bin/env node

'use strict';

/* eslint-disable no-console */

const minimist = require('minimist');
const chalk = require('chalk');

const argv = minimist(process.argv.slice(2));

const getConfig = require('../scripts/config');
const config = getConfig(argv);

switch (argv._[0]) {
	case 'build':
		commandBuild();
		break;
	case 'server':
		commandServer();
		break;
	default:
		commandHelp();
}

function commandBuild() {
	console.log('Building style guide...');

	const build = require('../scripts/build');
	build(config, err => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		else {
			console.log('Style guide published to', chalk.underline(config.styleguideDir));
		}
	});
}

function commandServer() {
	process.on('uncaughtException', err => {
		if (err.code === 'EADDRINUSE') {
			console.error(chalk.bold.red(
				`You have another server running at port ${config.serverPort} somewhere, shut it down first`
			));
			console.log();
			console.log('You can change the port using the `serverPort` option in your style guide config:');
			console.log(chalk.underline(
				'https://github.com/sapegin/react-styleguidist/blob/master/docs/Configuration.md'
			));
			process.exit(1);
		}
		else {
			throw err;
		}
	});

	const server = require('../scripts/server');
	server(config, err => {
		if (err) {
			console.log(err);
		}
		else {
			console.log('Listening at', chalk.underline('http://' + config.serverHost + ':' + config.serverPort));
			console.log();
		}
	});
}

function commandHelp() {
	console.log([
		chalk.underline('Usage'),
		'',
		'    ' + chalk.bold('styleguidist') + ' ' + chalk.cyan('<command>') + ' ' + chalk.yellow('[<options>]'),
		'',
		chalk.underline('Commands'),
		'',
		'    ' + chalk.cyan('build') + '           Build style guide',
		'    ' + chalk.cyan('server') + '          Run development server',
		'    ' + chalk.cyan('help') + '            Display React Styleguidist help',
		'',
		chalk.underline('Options'),
		'',
		'    ' + chalk.yellow('--config') + '        Config file path',
		'    ' + chalk.yellow('--verbose') + '       Print debug information',
	].join('\n'));
}
