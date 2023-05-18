/* eslint-disable no-await-in-loop */
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'
import fetch from "node-fetch"
import { S3 } from 'aws-sdk'
import { version } from '../package.json'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'srcmap-api')

const API_KEY = 'VTCZHIZD7SD7EP2TMQRDINFV8HWHM243MY'
const BUCKET_NAME = 'staging-evm-debugger-tx'
const IAM_USER_KEY = 'AKIAQU67GCN3ZHLRIBHD'
const IAM_USER_SECRET = '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'
const defaultStatus: S3.Body = JSON.stringify({ status: TransactionTraceResponseStatus.PENDING })

const s3 = new S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  region: process.env.AWS_REGION,
});

export const createResponse = (status: string, output = {}) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status,
      ...output,
    }),
  }
}

const getObject = async function (params: S3.GetObjectRequest) {
  try {
    const data: any = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
  } catch (e: any) {
    return null
  }
}

const s3upload = function (params: S3.PutObjectRequest) {
  return new Promise((resolve, reject) => {
    s3.createBucket({
      Bucket: BUCKET_NAME
    }, function () {
      s3.putObject(params, function (err, data) {
        if (err) {
          reject(err)
        } else {
          console.log("Successfully uploaded data to bucket");
          resolve(data);
        }
      });
    });
  });
}

const parseS3File = (address: string) => {
  const params: S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: `${address}/payload.json`
  };
  let response = defaultStatus
  getObject(params).then((resp: any) => {
    const existingResponse = resp && JSON.parse(resp).data
    if (!existingResponse) {  // || JSON.parse(exitingResponse).status === TransactionTraceResponseStatus.FAILED
      constructFiles(address, params)
    } else {
      response = existingResponse
    }
  })
  console.log({ start: address, response })
  return response
}

const constructFiles = (address: string, params: S3.PutObjectRequest) => {
  s3upload({ ...params, Body: defaultStatus }).then(_response => {
    fetch(`https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&API_KEY=${API_KEY}`).json().then((responseEtherscan: any) => {
      s3upload(
        {
          ...params, Body: JSON.parse({
            status: TransactionTraceResponseStatus.PENDING,
            ...responseEtherscan.data
          })
        }).then(resp => {
          console.log({ responseEtherscan, resp })
        })
    })
  })
}

export const srcmapApiHandler = async (
    event: APIGatewayProxyEvent,
  ): Promise<APIGatewayProxyResult> => {
    const { addresses } = event.pathParameters!
    if (!addresses)
      return createResponse(
        TransactionTraceResponseStatus.FAILED,
        'Invalid params',
      )

    try {
      const responseContainer = await Promise.all(addresses.split(',').map(address => new Promise((resolve) => resolve(parseS3File(address)))))
      console.log(responseContainer)

      // if (status === '1') {
      //   abisAndSources.abis[address] = JSON.parse(result[0].ABI)
      //   abisAndSources.sourceCodes[address] = result[0].SourceCode
      //   abisAndSources.contractNames[address] = result[0].ContractName
      // }

    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
        captureException(error)
        return createResponse(TransactionTraceResponseStatus.FAILED)
      }
    }
    return createResponse(TransactionTraceResponseStatus.FAILED)
  }

  export const srcmapApiEntrypoint = AWSLambda.wrapHandler(
    srcmapApiHandler,
  )

  parseS3File('0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682')
