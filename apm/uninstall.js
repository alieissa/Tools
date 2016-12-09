'use strict';

let shelljs = require('shelljs');

let parseNPMOutput = require('./parse.js').parseNPMOutput;
let parseSaveFlags = require('./parse.js').parseSaveFlags;

let util = require('./util.js');

// Uninstalls package AND removes it from package.json
function purgePacks(packs, group) {

    packs.forEach(pack => {
        
        let _output = shelljs.exec(`npm uninstall ${pack}`);
        if(_output.code === 0) {
            group = util.exclude(group, pack);
        }
    });

    return group;
}

function uninstallPacks(packs, groupNames, groupPacks) {

    let _groups;

    try {
        // Disregard groups that are not in package.json
        _groups = groupNames.filter(group => {
            return Object.keys(groupPacks).indexOf(group) !== -1
        });
    }
    catch(TypeError) {

        if(typeof groupNames === 'string') {
            _groups = [groupNames];
        }
    }

    _groups.forEach(group => {

        // Remove package and group if empty
        groupPacks[group] = purgePacks(packs, groupPacks[group]);
        if(util.isEmpty(groupPacks[group])) {
            groupPacks = util.exclude(groupPacks, group);
        }
    });

    return util.sort(groupPacks);
}

function uninstallGroup(groupName, groups) {

    let _deps = groups[groupName];
    let _packs = Object.keys(groups[groupName]);

    return uninstallPacks(_packs, groupName, groups);
}

module.exports = {packs: uninstallPacks, group: uninstallGroup};
