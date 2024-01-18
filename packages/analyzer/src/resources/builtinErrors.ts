import type { ErrorFragment, ParamType, ErrorDescription } from 'ethers'

export const BUILTIN_ERRORS: Record<string, ErrorFragment> = {
  '0x4e487b71': {
    type: 'error',
    selector: '0x4e487b71',
    name: 'Panic',
    inputs: [{ type: 'uint256', name: '', indexed: null, baseType: 'uint256' } as ParamType],
    format: (type) => type,
  },
  '0x08c379a0': {
    type: 'error',
    selector: '0x08c379a0',
    name: 'Error',
    inputs: [
      {
        type: 'string',
        name: '',
        indexed: null,
        baseType: 'string',
      } as ParamType,
    ],
    format: (type) => type,
  },
}

export const createErrorDescription = (message: string) => {
  return {
    signature: 'Error(string)',
    selector: '0x08c379a0',
    name: 'Error',
    fragment: {
      type: 'error',
      selector: '0x08c379a0',
      name: 'Error',
      inputs: [
        {
          type: 'string',
          name: 'Message',
          indexed: null,
          components: null,
          baseType: 'string',
        } as ParamType,
      ] as readonly ParamType[],
      format: (format) => format,
    },
    args: [message],
  } as ErrorDescription
}
