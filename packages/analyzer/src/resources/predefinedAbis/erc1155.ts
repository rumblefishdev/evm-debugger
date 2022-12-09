import type { JsonFragment } from '@ethersproject/abi'

export const ERC1155_ABI: JsonFragment[] = [
  {
    type: 'event',
    name: 'ApprovalForAll',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'bool',
        name: 'approved',
        internalType: 'bool',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TransferBatch',
    inputs: [
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256[]',
        name: 'ids',
        internalType: 'uint256[]',
        indexed: false,
      },
      {
        type: 'uint256[]',
        name: 'values',
        internalType: 'uint256[]',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TransferSingle',
    inputs: [
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'id',
        internalType: 'uint256',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'value',
        internalType: 'uint256',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'URI',
    inputs: [
      {
        type: 'string',
        name: 'value',
        internalType: 'string',
        indexed: false,
      },
      {
        type: 'uint256',
        name: 'id',
        internalType: 'uint256',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256',
        name: '',
        internalType: 'uint256',
      },
    ],
    name: 'balanceOf',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'id',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'uint256[]',
        name: '',
        internalType: 'uint256[]',
      },
    ],
    name: 'balanceOfBatch',
    inputs: [
      {
        type: 'address[]',
        name: 'accounts',
        internalType: 'address[]',
      },
      {
        type: 'uint256[]',
        name: 'ids',
        internalType: 'uint256[]',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'isApprovedForAll',
    inputs: [
      {
        type: 'address',
        name: 'account',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeBatchTransferFrom',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256[]',
        name: 'ids',
        internalType: 'uint256[]',
      },
      {
        type: 'uint256[]',
        name: 'amounts',
        internalType: 'uint256[]',
      },
      {
        type: 'bytes',
        name: 'data',
        internalType: 'bytes',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      {
        type: 'address',
        name: 'from',
        internalType: 'address',
      },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      {
        type: 'uint256',
        name: 'id',
        internalType: 'uint256',
      },
      {
        type: 'uint256',
        name: 'amount',
        internalType: 'uint256',
      },
      {
        type: 'bytes',
        name: 'data',
        internalType: 'bytes',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setApprovalForAll',
    inputs: [
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
      {
        type: 'bool',
        name: 'approved',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'bool',
        name: '',
        internalType: 'bool',
      },
    ],
    name: 'supportsInterface',
    inputs: [
      {
        type: 'bytes4',
        name: 'interfaceId',
        internalType: 'bytes4',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'string',
        name: '',
        internalType: 'string',
      },
    ],
    name: 'uri',
    inputs: [
      {
        type: 'uint256',
        name: 'id',
        internalType: 'uint256',
      },
    ],
  },
]
