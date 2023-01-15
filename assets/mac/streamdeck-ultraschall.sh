#!/bin/sh
chmod 755 ./mac/node
./mac/node ./plugin.js "$@" > ./log.txt 2>&1