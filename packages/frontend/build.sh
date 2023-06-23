#!/bin/bash

set -e

ENV=${2:-"local"}

function build() {
  local prerender=${1:-"false"}

  if [[ "$ENV" != "" ]]; then
    REACT_APP_IS_PRERENDER=$prerender PUBLIC_URL=/evm-debugger dotenv -e ".env.$ENV" react-scripts build
  else
    REACT_APP_IS_PRERENDER=$prerender PUBLIC_URL=/evm-debugger EXTEND_ESLINT=true react-scripts build
  fi
}

function swap_to_evm_debugger_dir() {
  mv "$1" tmp_dir
  mkdir $1
  mv tmp_dir "$1/evm-debugger"
}

function prerender() {
  mv build original_build

  build "true"

  swap_to_evm_debugger_dir build
  cp build/evm-debugger/index.html build/index.html
  react-spa-prerender
  mv build prerendered_build
  ls -lh prerendered_build

  swap_to_evm_debugger_dir original_build
  mv original_build/evm-debugger/index.html original_build/evm-debugger/non-static.html
  mv prerendered_build/evm-debugger.html original_build/evm-debugger/index.html
  rm -rf prerendered_build
  mv original_build build/
}

if [[ "$1" == "build" ]]; then
  build
elif [[ "$1" == "prerender" ]]; then
  prerender
fi
