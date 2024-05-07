# Hardhat Local Development  
  
  To prevent constant deployment of our infrastructure and 
  publishin hardhat package to npm, its good practice to test our lambda locally.

## Required setup

Before we can test our lambda locally, we need to setup few things

### Required utilities

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
3. [Cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html)
4. [jq.node](https://www.npmjs.com/package/jq.node)

### AWS

TODO : Add instructions to setup AWS account

Setup profile for evm debugger interactions

### Folders structure

  To test our lambda with hardhat package, we need both evm-debuger and hardhat packages locally. 
eg:
```
some-directory
    ├── hardhat
    ├── evm-debugger
```
### Hardhat Setup

After cloning the @rumblefish/hardhat package

1. Go to packages/hardhat-core/package.json   
    a. ensure that name is hardhat   
    b. ensure that version is 2.22.2   
    <b>This steps are added because for publishig reasons we have to change it to @rumblefish/hardhat and other version which breaks building and setuping repo</b>   
2. Run `pnpm install` to install all dependencies and have clean setup   
3. In order to succesfully use this package with our lambda we need to use install `node_modules` from `hardhat-core` with `npm install` and to use it we have to make few adjustments   
4. Go to `packages/hardhat-network-helpers/package.json` and remove `"hardhat": "workspace:^2.9.5"` from peer dependencies   
5. Go to `packages/hardhat-core/package.json` and change
    a. `"@nomicfoundation/eslint-plugin-hardhat-internal-rules": "workspace:^",` to `"@nomicfoundation/eslint-plugin-hardhat-internal-rules": "file:../eslint-plugin-hardhat-internal-rules"`
    b.  `"@nomicfoundation/eslint-plugin-slow-imports": "workspace:^"` to `"@nomicfoundation/eslint-plugin-slow-imports": "file:../eslint-plugin-slow-imports"`
6. Run `npm install` in `hardhat-core` to install dependencies
7. Run `npm run build` in `hardhat-core` to build the package
   
### EVM Debugger Setup

Before doing setup from readmy in root folder of `evm-debugger`
