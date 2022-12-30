import * as AWS from 'aws-sdk'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'

const s3BucketName = process.env.TRANSACTION_TRACE_BUCKET
const txHash = process.env.TX_HASH
const chainId = process.env.CHAIN_ID

const uploadJson = async (json: string, url: string) => {
  return await new AWS.S3()
    .upload({
      Key: `${url}.json`,
      ContentType: 'application/json',
      Bucket: s3BucketName,
      Body: json,
    })
    .promise()
}

const main = async () => {
  try {
    const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER)
    const traceResult = await hardhatProvider.send('debug_traceTransaction', [
      txHash,
    ])
    await uploadJson(
      JSON.stringify(traceResult),
      `trace/${chainId}/${txHash}`,
    )
  } catch (error) {
    console.log('err:', error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  } finally {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit()
  }
}
void main()
