export const txInfoSchema = {
  type: 'object',
  required: ['from', 'hash', 'input', 'nonce', 'to', 'value', 'chainId'],
  properties: {
    value: { type: 'string' },
    to: { type: 'string' },
    nonce: { type: 'string' },
    input: { type: 'string' },
    hash: { type: 'string' },
    from: { type: 'string' },
    chainId: { type: 'string' },
  },
  additionalProperties: true,
}

export const structLogSchema = {
  type: 'object',
  required: ['pc', 'op', 'gas', 'gasCost', 'depth', 'stack', 'memory'],
  properties: {
    stack: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    pc: { type: 'number' },
    op: { type: 'string' },
    memory: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    gasCost: { type: 'number' },
    gas: { type: 'number' },
    depth: { type: 'number' },
  },
}

export const traceTransactionSchema = {
  type: 'object',
  required: ['structLogs'],
  properties: {
    structLogs: {
      type: 'array',
      items: structLogSchema,
    },
  },
  additionalProperties: true,
}
