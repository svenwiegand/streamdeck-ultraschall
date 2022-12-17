#!/bin/sh
#./mac/node --inspect-brk ./plugin.js "$@" > ./log.txt
./mac/node --inspect ./plugin.js "$@" > ./log.txt 2>&1