#!/bin/bash
pwd > ~/source/streamdeck/streamdeck-ultraschall/log.txt
/opt/homebrew/bin/node --inspect ~/source/streamdeck/streamdeck-ultraschall/dist/de.sven-wiegand.ultraschall.sdPlugin/plugin.js "$@" >> ~/source/streamdeck/streamdeck-ultraschall/log.txt