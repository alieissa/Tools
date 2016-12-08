#!/bin/node
'use strict';

let fs = require('fs');
let path = require('path');
let minimist = require('minimist');
let sortObject = require('./util.js').sortObject;

let install = require('./install.js');
let packJson = require('./package.json');

function updatePackJson(updates,content, path) {
    Object.keys(updates).forEach(key => content[key] = updates[key]);

    fs.writeFile(path, JSON.stringify(content, null, 4));
}

function main() {

    let argv = minimist(process.argv.slice(2));

    let command = argv['_'];
    let commandName = command[0];
    let commandArgs = command.slice(1);

    // All options have a true val in argv object
    let flags = Object.keys(argv).filter(arg => argv[arg] === true);
    let options = Object.keys(argv)
        .filter(arg => arg !== '_' && argv[arg] !== true)
        .map(arg => ({[arg]: argv[arg]}))
    //
    // console.log(argv)
    switch(commandName) {
        case'install':
            let [installedDeps, packInfo] = install(commandArgs, options, flags, packJson);
            updatePackJson(installedDeps, packInfo, path.join(__dirname, 'test.json'));
            break;

        case 'uninstall':
            uninstall(commandArgs, options,  packJson);
            break;

        default:
            shelljs.exec(['npm'], command);
    }

}

main();
