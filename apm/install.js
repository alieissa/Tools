let shelljs = require('shelljs');
let sortObject = require('./util.js').sortObject;

// After installation adds packs to group list
// if no group, creates new one
function addToGroup(packs, groupDeps = {}) {

    let groupDeps_ = JSON.parse(JSON.stringify(groupDeps));
    packs.map(pack => installPack(pack))
        .filter(result => result !== 1)
        .map(npmOutput => parseNPMOutput(npmOutput))
        .forEach(pack => {
            groupDeps_[pack.name] = pack.version;
        });
    return sortObject(groupDeps_);
}

// Install NPM package.
function installPack(pack) {
    let output = shelljs.exec(`npm install ${pack}`, {silent:true})
    return output.code === 0 ? output.stdout : output.code;
}


// Get the installed pack name and version from NPM output
function parseNPMOutput(npmOutput) {

    let [_pack] = npmOutput.split(' ').slice(1)
        .filter(substr => substr.indexOf('@') !== -1);

    let name = _pack.split('@')[0];
    let version = '^' + _pack.split('@')[1];
    return {name, version};
}

// Separates the non dependecy related info from dep related info
function parsePackageJson(packJson) {

    let  packageJson_ = {};
    let installedDeps_ = {};
    
    Object.keys(packJson).forEach(key => {
        if(key.indexOf('Dependencies') === -1) {
            packageJson_[key] = packJson[key]
        }
        else {
            installedDeps_[key] = packJson[key]
        }
    });
    return [installedDeps_, packageJson_];
}

//Returns sorted group array from flags that are in format --save-group
function parseSaveFlags(flags) {

    return flags.filter(flag => flag.indexOf('save-') === 0)
        .map(flag => flag.split('save-')[1])
        .map(group => `${group}Dependencies`)
        .sort();
}

function install(packs, options, flags,  packJson) {

    let depGroup = options['only'];
    let installationGroups = parseSaveFlags(flags);
    let [_installedDeps, _packageJson_] = parsePackageJson(packJson);

    if(packs.length > 0 && installationGroups.length > 0) {

        installationGroups.forEach(group => {
            _installedDeps[group] = addToGroup(packs, _installedDeps[group]);
        });
        _installedDeps = sortObject(_installedDeps);
        return [sortObject(_installedDeps), _packageJson_];
    }
}

module.exports = install;
