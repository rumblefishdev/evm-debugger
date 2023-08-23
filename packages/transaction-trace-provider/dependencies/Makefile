.DEFAULT_GOAL := build-TransactionTraceProviderFunctionDepLayer

build-TransactionTraceProviderFunctionDepLayer:
	cd nodejs && npm install && npm run patch
	cp -r nodejs $(ARTIFACTS_DIR)

.PHONY : dump-patch
dump-patch:
	cd nodejs && npm install && npm run dump
