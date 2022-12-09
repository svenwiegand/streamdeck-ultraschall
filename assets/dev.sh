#!/bin/bash
echo "##########" > ~/source/streamdeck/streamdeck-ultraschall/log.txt
/opt/homebrew/bin/node --inspect ~/source/streamdeck/streamdeck-ultraschall/dist/com.sven-wiegand.ultraschall.sdPlugin/plugin.js "$@" >> ~/source/streamdeck/streamdeck-ultraschall/log.txt