build-TransactionTraceSqsHandlerFunction:
	npm run build
	cp package.json $(ARTIFACTS_DIR) # required by hardhat
	cp -r dist/* $(ARTIFACTS_DIR)

build-TransactionTraceSqsDeadLetterHandlerFunction:
	npm run build
	cp -r dist/* $(ARTIFACTS_DIR)
