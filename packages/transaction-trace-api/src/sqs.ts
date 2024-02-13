import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { forkingUrlMap } from '@evm-debuger/types'

const sqsClient = new SQSClient({ region: process.env.AWS_REGION })

export const putTxDetailsToSqs = async (
  txHash: string,
  chainId: string,
  gasLimit: string,
) => {
  const params = {
    QueueUrl: process.env.SQS_ANALYZER_URL,
    MessageBody: `Transaction ${txHash}`,
    MessageAttributes: {
      txHash: {
        StringValue: txHash,
        DataType: 'String',
      },
      hardhatForkingUrl: {
        StringValue:
          forkingUrlMap[Number(chainId) as keyof typeof forkingUrlMap],
        DataType: 'String',
      },
      gasLimit: {
        StringValue: gasLimit,
        DataType: 'String',
      },
      chainId: {
        StringValue: chainId,
        DataType: 'String',
      },
    },
    DelaySeconds: 0,
  }
  const command = new SendMessageCommand(params)
  await sqsClient.send(command)
}
