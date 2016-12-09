function parseArgv(argv) {

    let options = {};
    let flags = [];

    // All options have a true val in argv object
    Object.keys(argv).filter(arg => arg !== '_').forEach(arg => {
        if(argv[arg] === true) {
            flags.push(arg);
        }
        else {
            options[arg] = argv[arg];
        }
    });

    let commandName = argv['_'][0];
    let commandArgs = argv['_'].slice(1);

    return [commandName, commandArgs, options, flags];
}

// Separates the non dependecy related info from dep related info
function parsePackageJson(packageJson) {

    let projInfo_ = {};
    let depInfo_ = {};

    Object.keys(packageJson).forEach(key => {
        if(key.indexOf('Dependencies') === -1) {
            projInfo_[key] = packageJson[key]
        }
        else {
            depInfo_[key] = packageJson[key]
        }
    });
    return [depInfo_, projInfo_];
}

// Get the installed pack name and version from NPM output
function parseNPMOutput(npmOutput) {

    if(npmOutput === '') {
        return {};
    }
    // filter always returns an array
    let [_pack] = npmOutput.split(' ').slice(1)
        .filter(substr => substr.indexOf('@') !== -1);

    let name = _pack.split('@')[0];
    let version = '^' + _pack.split('@')[1];
    return {name, version};
}

//Returns sorted group array from flags that are in format --save-group
function parseSaveFlags(flags) {

    return flags.filter(flag => flag.indexOf('save-') === 0)

        // get group from save-group
        .map(flag => flag.split('save-')[1])

        // Change group to groupDependencies
        .map(group => `${group}Dependencies`)
        .sort();
}

module.exports = {parseSaveFlags, parseNPMOutput, parsePackageJson, parseArgv};
