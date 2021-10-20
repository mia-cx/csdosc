#!/bin/bash

# create missing directories
#   -p                          only create if missing
mkdir -p public/lib/js
mkdir -p public/lib/css

# copy js libraries
#   -u                          update if newer or nonexistent
#   -r                          recursive
##   --remove-destination       remove existing dest file before opening
cp -ur node_modules/bootstrap/dist/js/bootstrap.min.js* public/lib/js/
cp -ur node_modules/jquery/dist/jquery.min.js* public/lib/js/
cp -ur node_modules/p5/lib/p5.min.js public/lib/js/
cp -ur node_modules/p5/lib/addons/p5.sound.min.js public/lib/js/
cp -ur node_modules/socket.io/client-dist/socket.io.min.js* public/lib/js/

# copy css libraries
cp ./node_modules/bootstrap/dist/css/bootstrap.min.css* ./public/lib/css/