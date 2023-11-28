import type {
  SendMessageCommandInput,
  SendMessageCommandOutput,
} from '@aws-sdk/client-sqs'
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import type { ChainId } from '@evm-debuger/types'

const sqsClient = new SQSClient({ region: process.env.AWS_REGION })

export const putContractToDownloadSqs = async (
  address: string,
  chainId: ChainId,
): Promise<SendMessageCommandOutput> => {
  const params: SendMessageCommandInput = {
    QueueUrl: process.env.SQS_FILES_FETCHER_URL,
    MessageBody: `Contract ${chainId}/${address}`,
    MessageAttributes: {
      chainId: {
        StringValue: String(chainId),
        DataType: 'String',
      },
      address: {
        StringValue: address,
        DataType: 'String',
      },
    },
    DelaySeconds: 0,
  }
  const command = new SendMessageCommand(params)
  return sqsClient.send(command)
}
