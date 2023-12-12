import type { CreateInvalidationCommandInput, CreateCachePolicyCommandOutput } from '@aws-sdk/client-cloudfront'
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront'

const cfClient = new CloudFrontClient({
  region: process.env.AWS_REGION,
})

export const invalidateCloudFrontCache = async (distributionId: string, paths: string[]): Promise<CreateCachePolicyCommandOutput> => {
  const params: CreateInvalidationCommandInput = {
    InvalidationBatch: {
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
      CallerReference: Date.now().toString(),
    },
    DistributionId: distributionId,
  }
  const command = new CreateInvalidationCommand(params)
  return cfClient.send(command)
}
