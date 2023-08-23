# Infra deployments

AWS cloudformation templates for project resources. 

Lambda source code is managed by github actions.

Resources configuration, IAM permissions etc. must be handled by manual operation - github is provided with minimal permissions and
can not make that type of change.

## Commands

For production change `stage` keyword to `prod`

### Deployment

```
make deploy-stage
```

### Logs

```
make logs-stage
make logs-stage-sqs
```

## Local development

Enter `local` directory and execute `make start`. It will create sample stack with endpoint that can be used to work with.
Stack will be in `sync` state so all changes to code or stack will be executed after file save
operation.

Remember to clean your work at the end of with `make clean` command.

## Troubleshoting

### Z_DATA_ERROR
During `sam build` on localhost in `TransactionTraceProviderFunctionDepLayer` resource, sam will try to install dependencies from `packages/transaction-trace-provider/dependencies/nodejs` file.

If you will get error like this:
```
zlib Z_DATA_ERROR "invalid distance too far back"
```

You have to install npm dependencies manually in `packages/transaction-trace-provider/dependencies/nodejs` directory.

```
cd packages/transaction-trace-provider/dependencies/nodejs
npm install
```

Automation for this is set in `postinstall` script in `packages/transaction-trace-provider/package.json` file.
