#!/bin/sh
{
    OOCHARTS_SERVER_URL="https://github.com/OOcharts/oocharts-server/archive/v0.1-alpha.2.tar.gz"

    wget -qO- $OOCHARTS_SERVER_URL | tar xz

    rm -r oocharts-server
    mkdir oocharts-server

    mv oocharts-server-0.1-alpha.2/* oocharts-server/

    rm -r oocharts-server-0.1-alpha.2

    cd oocharts-server

    sh configure.sh

    cd ../

    echo "OOcharts server installed!"
}