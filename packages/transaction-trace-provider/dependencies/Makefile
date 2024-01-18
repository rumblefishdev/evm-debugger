build-TransactionTraceProviderFunctionDepLayer:
	cd nodejs && npm install
	cp -r nodejs/node_modules/@rumblefishdev/hardhat nodejs/node_modules/hardhat
	mkdir -p nodejs/node_modules/@nomicfoundation
	cp -r nodejs/node_modules/@rumblefishdev/hardhat-network-helpers nodejs/node_modules/@nomicfoundation/hardhat-network-helpers
	cp -r nodejs $(ARTIFACTS_DIR)
