# Description

AWS cloudformation stack resources. Lambda source code is managed by github actions.


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
