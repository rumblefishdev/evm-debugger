export const createSQSRecordEvent = (txHash: string, chainId: string, hardhatForkingUrl: string) => {
  return {
    Records: [
      {
        messageId: 'bd760d4b-d164-4b81-8726-b756d063b14e',
        messageAttributes: {
          txHash: {
            stringValue: txHash,
            dataType: 'String',
          },
          hardhatForkingUrl: {
            stringValue: hardhatForkingUrl,
            dataType: 'String',
          },
          chainId: {
            stringValue: chainId,
            dataType: 'String',
          },
        },
        body: 'Transaction 0xf2a56c4a9edc31fd3a8ed3c3e256d500f548035e84e55df6e1c6b631d91c04f9',
      },
    ],
  }
}
