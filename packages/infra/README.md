# Description

AWS cloudformation templates for project resources. Lambda source code is managed by github actions.

Resources configuration, IAM permissions must be handled by manual operation - github is provided with minimal permissions

# Commands

For production change `stage` keyword to `prod`

## Deployment

```
make deploy-stage
```

## Logs

```
make logs-stage
make logs-stage
make logs-stage-sqs
```

# Local

Enter `local` directory and use `make start`. It will create sample stack and generate endpoint that
can be used to work with.

Remember to clean your work at the end of the work with `make clean`
