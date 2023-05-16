# Description

AWS cloudformation templates for project resources. 

Lambda source code is managed by github actions.

Resources configuration, IAM permissions etc. must be handled by manual operation - github is provided with minimal permissions and
can not make that type of change.

# Commands

For production change `stage` keyword to `prod`

## Deployment

```
make deploy-stage
```

## Logs

```
make logs-stage
make logs-stage-sqs
```

# Local development

Enter `local` directory and execute `make start`. It will create sample stack with endpoint that can be used to work with.
Stack will be in `sync` state so all changes to code or stack will be executed after file save
operation.

Remember to clean your work at the end of with `make clean` command.
