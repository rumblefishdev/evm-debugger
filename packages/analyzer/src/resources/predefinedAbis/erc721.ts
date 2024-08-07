import type { JsonFragment } from '@ethersproject/abi'

export const ERC721_ABI: JsonFragment[] = [
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'approved',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ApprovalForAll',
    inputs: [
      {
        type: 'address',
        name: 'owner',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
        indexed: true,
      },
      { type: 'bool', name: 'approved', internalType: 'bool', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address', indexed: true },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
        indexed: true,
      },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
        indexed: true,
      },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'approve',
    inputs: [
      { type: 'address', name: 'to', internalType: 'address' },
      {
        type: 'uint256',
        name: 'tokenId',
        internalType: 'uint256',
      },
    ],
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
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: 'balance', internalType: 'uint256' }],
    name: 'balanceOf',
    inputs: [{ type: 'address', name: 'owner', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: 'operator', internalType: 'address' }],
    name: 'getApproved',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'isApprovedForAll',
    inputs: [
      { type: 'address', name: 'owner', internalType: 'address' },
      {
        type: 'address',
        name: 'operator',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'name',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: 'owner', internalType: 'address' }],
    name: 'ownerOf',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'safeTransferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
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
      { type: 'address', name: 'operator', internalType: 'address' },
      {
        type: 'bool',
        name: '_approved',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'supportsInterface',
    inputs: [{ type: 'bytes4', name: 'interfaceId', internalType: 'bytes4' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'symbol',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'tokenURI',
    inputs: [{ type: 'uint256', name: 'tokenId', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferFrom',
    inputs: [
      { type: 'address', name: 'from', internalType: 'address' },
      {
        type: 'address',
        name: 'to',
        internalType: 'address',
      },
      { type: 'uint256', name: 'tokenId', internalType: 'uint256' },
    ],
  },
]
