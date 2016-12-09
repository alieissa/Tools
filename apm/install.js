'use strict';

let shelljs = require('shelljs');

let parseNPMOutput = require('./parse.js').parseNPMOutput;
let parseSaveFlags = require('./parse.js').parseSaveFlags;

let sortObject = require('./util.js').sortObject;

// After installation adds packs to group list
// if no group, creates new one
function installPack(pack) {

    let _output = shelljs.exec(`npm install ${pack}`);
    let _packInfo = parseNPMOutput(_output.stdout);

    return {code: _output.code, name: _packInfo.name, version: _packInfo.version};
}

function installPacks(packs, groupNames, groupPacks) {

    let _verify = installResult => installResult.code === 0;
    let _update = (output, group) => {
        try {
            groupPacks[group][output.name] = output.version;
        }
        catch(TypeError) {
            groupPacks[group] = {[output.name]: output.version};
        }

    };

    groupNames.forEach(group => {

        // Install package, verify installation, update group packs if install good
        packs.map(installPack).filter(_verify).forEach(output => _update(output, group));
        groupPacks[group] = sortObject(groupPacks[group]);
    });

    return sortObject(groupPacks);
}

function installGroup(groupName, groups) {

    let _deps = groups[groupName];
    Object.keys(_deps).forEach(installPack);
}

module.exports = {packs: installPacks, group: installGroup};
