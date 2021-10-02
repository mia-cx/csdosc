#!/bin/bash
set -e

if [ -n "$(ls -A /data 2>/dev/null)" ]
then
    echo "Data directory contains files, not downloading csdosc."
    cd /data
else
    echo "Data directory is empty, downloading csdosc..."
    set -x
    cd /tmp
    wget -O "csdosc.tar.gz" "https://github.com/mia-cx/csdosc/archive/refs/heads/master.tar.gz"
    tar -xf "csdosc.tar.gz"
    mv  /tmp/csdosc-master/{,.[^.]}* "/data/"
    rm -rf /tmp/*
    cd /data
    rm -rf \
        docker/
    # fix permissions
    find . -type d -exec chmod 750 {} \;
    find . -type f -exec chmod 640 {} \;
    set +x
    echo "Downloading complete..."
fi

echo "Updating/downloading csdosc dependencies..."
npm install

exec npm start