import type { TSrcMapAddres } from '@evm-debuger/types'
import type { APIGatewayProxyEvent } from 'aws-lambda'

export const createLambdaEvent = (bodyParameters: {
  addresses: TSrcMapAddres[]
}): APIGatewayProxyEvent => {
  return {
    stageVariables: {},
    resource: '',
    requestContext: {
      stage: 'dev',
      resourcePath: '/hello',
      resourceId: '123456',
      requestTimeEpoch: 1_428_582_896_000,
      requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
      protocol: 'HTTP/1.1',
      path: '/hello',
      identity: {
        userArn: '',
        userAgent: '',
        user: '',
        sourceIp: '',
        principalOrgId: '',
        cognitoIdentityPoolId: '',
        cognitoIdentityId: '',
        cognitoAuthenticationType: '',
        cognitoAuthenticationProvider: '',
        clientCert: {
          validity: { notBefore: '', notAfter: '' },
          subjectDN: '',
          serialNumber: '',
          issuerDN: '',
          clientCertPem: '',
        },
        caller: '',
        apiKeyId: '',
        apiKey: '',
        accountId: '',
        accessKey: '',
      },
      httpMethod: 'get',
      authorizer: {},
      apiId: '1234',
      accountId: '123456789012',
    },
    queryStringParameters: {},
    pathParameters: null,
    path: '/hello',
    multiValueQueryStringParameters: {},
    multiValueHeaders: {},
    isBase64Encoded: false,
    httpMethod: 'get',
    headers: {},
    body: JSON.stringify(bodyParameters),
  }
}
