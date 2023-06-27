#!/bin/bash

set -e

ENV=${2:-"local"}

function print_msg() {
  echo "#############################"
  echo "##"
  echo "##  $1 "
  echo "##"
  echo "#############################"
}

function fix_scripts() {
  local filename="$1"
  local new_script_name=$(ls build/static/js | grep -E '^main\..*.js$')

  sed "s|/evm-debugger/static/js/main\.[0-9A-Za-z]*\.js|/evm-debugger/static/js/$new_script_name|g" "$filename" > "$filename.new"
  mv "$filename.new" "$filename"
}

function build() {
  local prerender=${1:-"false"}

  if [[ "$prerender" != "true" ]]; then
    print_msg "Building"
  fi

  export PUBLIC_URL=/evm-debugger
  export REACT_APP_IS_PRERENDER=$prerender

  if [[ "$ENV" != "" ]]; then
     dotenv -e ".env.$ENV" react-scripts build
  else
     react-scripts build
  fi

  unset PUBLIC_URL
  unset REACT_APP_IS_PRERENDER
}

function swap_to_evm_debugger_dir() {
  mv "$1" tmp_dir
  mkdir $1
  mv tmp_dir "$1/evm-debugger"
}

function prerender() {
  print_msg "Building prerender page"
  mv build original_build

  build "true"

  swap_to_evm_debugger_dir build
  mv original_build/index.html original_build/non-static.html
  react-spa-prerender
  mv build prerendered_build

  swap_to_evm_debugger_dir original_build
  mv prerendered_build/evm-debugger.html original_build/evm-debugger/index.html
  mv original_build/evm-debugger build/
  rm -rf prerendered_build original_build

  fix_scripts build/index.html
  fix_scripts build/non-static.html
}

function serve_prerender() {
  build
  prerender

  print_msg "Serving application"

  swap_to_evm_debugger_dir build
  cd build && http-server -o /evm-debugger --proxy http://localhost:8080/evm-debugger/non-static.html?
}

if [[ "$1" == "build" ]]; then
  build
elif [[ "$1" == "prerender" ]]; then
  prerender
elif [[ "$1" == "serve-prerender" ]]; then
  serve_prerender
fi
