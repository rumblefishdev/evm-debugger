
transaction-trace-provider.zip:
	lerna run build --scope @evm-debuger/types
	lerna run build --scope @evm-debuger/transaction-trace-provider
	rf-lerna zipbundle @evm-debuger/transaction-trace-provider --target transaction-trace-provider.zip

.build: transaction-trace-provider.zip
	docker build -t $(ECR_ARN) . --build-arg bundle=transaction-trace-provider.zip

.deploy: .build
	docker push $(ECR_ARN)


build-dev: ECR_ARN=045028348791.dkr.ecr.us-east-1.amazonaws.com/transaction-trace-provider
build-dev: .build

deploy-dev: ECR_ARN=045028348791.dkr.ecr.us-east-1.amazonaws.com/transaction-trace-provider
deploy-dev: .deploy


login-ecr: REGION=us-east-1
login-ecr: ECR_ARN=045028348791.dkr.ecr.us-east-1.amazonaws.com
login-ecr:
	aws ecr get-login-password --region $(REGION) \
	| docker login \
	    --username AWS \
	    --password-stdin $(ECR_ARN)
