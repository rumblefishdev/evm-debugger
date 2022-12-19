import type { JsonFragment } from '@ethersproject/abi'

export const ERC20_ABI: JsonFragment[] = [
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'string',
        name: '',
      },
    ],
    name: 'name',
    inputs: [],
    constant: true,
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    payable: false,
    outputs: [
      {
        type: 'bool',
        name: '',
      },
    ],
    name: 'approve',
    inputs: [
      {
        type: 'address',
        name: '_spender',
      },
      {
        type: 'uint256',
        name: '_value',
      },
    ],
    constant: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    name: 'totalSupply',
    inputs: [],
    constant: true,
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    payable: false,
    outputs: [
      {
        type: 'bool',
        name: '',
      },
    ],
    name: 'transferFrom',
    inputs: [
      {
        type: 'address',
        name: '_from',
      },
      {
        type: 'address',
        name: '_to',
      },
      {
        type: 'uint256',
        name: '_value',
      },
    ],
    constant: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'uint8',
        name: '',
      },
    ],
    name: 'decimals',
    inputs: [],
    constant: true,
  },
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'uint256',
        name: 'balance',
      },
    ],
    name: 'balanceOf',
    inputs: [
      {
        type: 'address',
        name: '_owner',
      },
    ],
    constant: true,
  },
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'string',
        name: '',
      },
    ],
    name: 'symbol',
    inputs: [],
    constant: true,
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    payable: false,
    outputs: [
      {
        type: 'bool',
        name: '',
      },
    ],
    name: 'transfer',
    inputs: [
      {
        type: 'address',
        name: '_to',
      },
      {
        type: 'uint256',
        name: '_value',
      },
    ],
    constant: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    payable: false,
    outputs: [
      {
        type: 'uint256',
        name: '',
      },
    ],
    name: 'allowance',
    inputs: [
      {
        type: 'address',
        name: '_owner',
      },
      {
        type: 'address',
        name: '_spender',
      },
    ],
    constant: true,
  },
  {
    type: 'fallback',
    stateMutability: 'payable',
    payable: true,
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        indexed: true,
      },
      {
        type: 'address',
        name: 'spender',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        type: 'address',
        name: 'from',
        indexed: true,
      },
      {
        type: 'address',
        name: 'to',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'value',
        indexed: false,
      },
    ],
    anonymous: false,
  },
]
