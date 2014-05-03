#!/bin/sh

read -p "Are you sure you want to reset OOcharts Server? (y for yes)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "{ \"state\" : \"installed\", \"port\" : 4004 }" > config/env/config.json
    echo "Config updated to installed defaults"
fi