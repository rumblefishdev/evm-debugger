#!/bin/bash

set -e

mv build build2
mkdir build 
mv build2 build/evm-debugger 
cp build/evm-debugger/index.html build/index.html
react-spa-prerender
mv build/evm-debugger.html build/evm-debugger/index.html
mv build/index.html build/evm-debugger/non-static.html
mv build build2
mv build2/evm-debugger build/
rm -rf build2

