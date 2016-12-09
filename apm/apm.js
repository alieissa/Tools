#!/bin/node
'use strict';

let fs = require('fs');
let path = require('path');
let minimist = require('minimist');
let shelljs = require('shelljs');

let install = require('./install.js');
let uninstall = require('./uninstall.js');

let parseArgv = require('./parse.js').parseArgv;
let parsePackageJson = require('./parse.js').parsePackageJson;
let parseSaveFlags = require('./parse').parseSaveFlags;

let packageJsonPath = path.join(process.cwd(), 'package.json');
let packJson = require(packageJsonPath);

function updatePackJson(updates,content, path) {

    Object.keys(updates).forEach(key => content[key] = updates[key]);

    fs.writeFile(path, JSON.stringify(content, null, 4), (err) => {
        if(err) {
            throw err;
        }
    });
}

function main() {

    let _argv = minimist(process.argv.slice(2));
    let [command, args, options, flags] = parseArgv(_argv);
    let [depInfo, projInfo] = parsePackageJson(packJson);

    // installation groups defined in flags as --save-group
    let destGroups = parseSaveFlags(flags);
    let srcGroup = `${options['only']}Dependencies`;

    if(typeof options['only'] === 'undefined'  && destGroups.length === 0) {
        shelljs.exec(_argv);
        return;
    }

    switch(command) {

        case'install':
            if(destGroups.length > 0) {
                install.packs(args, destGroups, depInfo)
                updatePackJson(depInfo, projInfo, packageJsonPath);
            }
            else if(typeof options['only'] !== 'undefined') {
                install.group(srcGroup, depInfo)
            }
            break;

        case 'uninstall':
            if(destGroups.length > 0) {
                depInfo = uninstall.packs(args, destGroups, depInfo)
                updatePackJson(depInfo, projInfo, packageJsonPath);
            }
            else if(typeof options['only'] !== 'undefined') {
                depInfo = uninstall.group(srcGroup, depInfo);
                updatePackJson(depInfo, projInfo, packageJsonPath);
            }
            break;

        default:
            shelljs.exec(['npm'], command);
    }

}

main();
