#!/bin/sh

mkdir config/env
echo "{ \"state\" : \"installed\", \"port\" : 4004 }" > config/env/config.json
echo "OOcharts server is now configured"