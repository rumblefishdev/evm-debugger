# Description

Directory contain responsible for AWS stacks. 

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

Enter `local` directory and use `make start`. It will create sample stack and generate sample endpoint in output that
can be used to work with.
