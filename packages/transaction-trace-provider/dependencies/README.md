# Dependencies layer

Due to `hardhat` internal tricks it is impossible to keep it as bundled package.
Due to it, is attached to infrastructure as a dependency lambda layer with source in the `dependecies` directory.

Node version of host machine and version of node on which those dependencies was built have to be the same, because in other hand error `zlib Z_DATA_ERROR "invalid distance too far back"` will occur during `sam build`

You can check patched dependencies current Node version in [nodejs/patches/patches-node-version](nodejs/patches/patches-node-version) file

## Dumping dependencies

Use following code to dump dependencies from `node_modules` to `dependencies/nodejs/node_modules` directory using your current Node version. Use it when you want to update Node version of whole project.

```bash
make dump-patch
```