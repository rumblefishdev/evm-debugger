import type { AwsStub } from 'aws-sdk-client-mock'

export const getMockCalledInput = (mock: AwsStub<any, any, any>, callNumber: number) => {
  return mock.call(callNumber).args[0].input
}

export const getMockCalledInputItem = (mock: AwsStub<any, any, any>, callNumber: number) => {
  return getMockCalledInput(mock, callNumber).Item
}
