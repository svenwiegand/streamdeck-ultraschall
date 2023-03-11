#!/bin/sh
if [[ $(uname -m) == "arm64" ]]; then
  plugin="plugin-macos-arm64"
else
  plugin="plugin-macos-x64"
fi
echo "$plugin" > ./log.txt
if [ -e "$plugin" ]; then
  echo "Running binary $plugin" >> ./log.txt
  chmod 755 "$plugin"
  ./"$plugin" "$@" >> ./log.txt 2>&1
else
  echo "Running node ./plugin.js" >> ./log.txt
  /opt/homebrew/bin/node ./plugin.js "$@" >> ./log.txt 2>&1
fi