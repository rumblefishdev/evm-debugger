build-TransactionTraceSqsDeadLetterHandlerFunction:
	npm run build
	cp -r dist/* $(ARTIFACTS_DIR)

build-TransactionTraceSqsHandlerFunctionMainnet:
	npm run build
	cp package.json $(ARTIFACTS_DIR) # required by hardhat
	cp -r dist/* $(ARTIFACTS_DIR)

build-TransactionTraceSqsHandlerFunctionPolygon:
	npm run build
	cp package.json $(ARTIFACTS_DIR) # required by hardhat
	cp -r dist/* $(ARTIFACTS_DIR)

build-TransactionTraceSqsHandlerFunctionAmoy:
	npm run build
	cp package.json $(ARTIFACTS_DIR) # required by hardhat
	cp -r dist/* $(ARTIFACTS_DIR)

build-TransactionTraceSqsHandlerFunctionSepolia:
	npm run build
	cp package.json $(ARTIFACTS_DIR) # required by hardhat
	cp -r dist/* $(ARTIFACTS_DIR)