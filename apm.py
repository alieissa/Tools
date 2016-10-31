#!/bin/python

import argparse
import json
import os
import subprocess as sb
import sys
import argparse
import re

#--------------------------------------------------
# Update package.json with the newly installed
# packages. Packages list under groupDependencies
#---------------------------------------------------

def update_package_json(package_name, version, group, file="package.json"):

    with open(file, 'r+') as pjson:
        jdata = json.load(pjson)

        if not group in data.keys():
            data[group] = {}

        data[group][package_name] = "^" + version
        json.dump(data, pjson)
        pjson.close()


#--------------------------------------------------
# Parses NPM output to find package version
#---------------------------------------------------

def get_version(npm_output):
    try:
        # Find string between @ and space
        version = re.search(r"@(.*) ", npm_output).group(1)
        return version
    except Exception, e:
        print e


#--------------------------------------------------
# Return the where the denedencies are to saved
# in the package.json file.
#---------------------------------------------------

def get_parsed_args(args):

    packages = []
    depenedency_group = ""

    for arg in args:
        if "--save-" in arg and (arg != "--save-dev"):
            depenedency_group = arg.split("--save-")[1]
        else:
            packages.append(arg)
    return depenedency_group, packages


#--------------------------------------------------
# Install packages and return a list of tuples
# with each tuple containing installed package
# and its version
#---------------------------------------------------

def install_packages(group, packs):
    installed = []

    for pack in packs:

        # Don't install package called insall
        if pack == "install": continue

        try:
            output = sb.check_output("npm install %s" % pack, shell=True)
            version = get_version(output)

            installed.append((pack, version))

            print "-------------------------------------------"
            print "Package ", pack
            print "version ", version
            print "-------------------------------------------"

        except sb.CalledProcessError, e:
            # NPM output on console already. Get pass it on
            pass

    return installed

def main():
    args = sys.argv[1:]
    cwd = os.getcwd();
    package_file_path = os.path.join(cwd, 'package.json')

    group, packages = get_parsed_args(args)

    # if nothing special about arguments pass them on to NPM as is
    if(group != ""):
        install_packages(group, packages)
    else:
        try:
            print ["npm"] + args
            sb.call(["npm"] + args)

        except sb.CalledProcessError, e:
            # No need to handle it. NPM prints info to screen
            pass

if __name__ == "__main__":
    main()
