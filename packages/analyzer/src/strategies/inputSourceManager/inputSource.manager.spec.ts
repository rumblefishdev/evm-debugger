import type { TContractFunctionInputParameter } from '@evm-debuger/types'

import { InputSourceManager } from './inputSource.manager'

const HARDCODED_STACK_FOR_CALLDATA_ARRAY_PARAMETER = [
  '0xf532e79fd8a83d228423e8a129c87fc8fb7d42270d79565b90baebf142c40292',
  '0xd',
  '0x64',
  '0x5bd',
  '0x',
  '0x',
]

const HARDCODED_STACK_FOR_CALLDATA_NONARRAY_PARAMETER = [
  '0xf532e79fd8a83d228423e8a129c87fc8fb7d42270d79565b90baebf142c40292',
  '0xd',
  '0x64',
  '0x5bd',
]

const HARDCODED_CALLDATA =
  '0x9a114cb2000000000000000000000000000000000000000000000015af1d78b58c4000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000d1b18370dc678bb7eed10f9a19f53ab437bdbf8f260f101fe8bdafc114212e0b846b4093d414f7499e09414c95fa4e992f624d1810b24da5a1a92fa7d633fba4c7d6dca2772148d351760cde4b87db57b5684475012ccdc60a1862a649a68649024a7a64a01ea069bf9c0bba68ed02e74658449452d0e2f95ee98650ce2592af9e416033b4c1648206bdf0cfb012813c77f9465b7cdced5b926898e834ce9c3b3fc4f1dc02bd191fb74dfd66904404ea4fedf2ef3615c40bcb59b8a7898da81c56797d474ae291fd0894fcb6c1e215503e7aef1640eeb2a58d5280193757b7b7111407d346aa988fdc9c668cbd43809f28144e70efbd36073aa8d6dd56b785792fbd721e94caeef0a6e5e8836f51fae486837e7bd550ac70ecbf6d0aa540377dd697cc9d362a75723b457ae19b69c7a756322d00443e2315af3fc0502bd4b10de558a46b59fbf8f16396bfc54573521c7b32037d3604df331350ecf1156f0a82fd627d85936b486edd1e2078b9a6a8b6c5e5517e05e64339b9c254f9906623671737f7ec9222b80a77c8f204e57672447de6e9fc67a938f235a454796f2ecc854'

const HARDCODED_STACK_FOR_MEMORY_ARRAY_PARAMETER = [
  '0xf532e79fd8a83d228423e8a129c87fc8fb7d42270d79565b90baebf142c40292',
  '0xfaa17e7be3479cc3ebf495727ad8044bc41c58626c575ce410d2f437fe0440fc',
  '0xd4',
  '0x4f6',
  '0x',
  '0x',
]

const HARDCODED_STACK_FOR_NONARRAY_PARAMETER = ['0x40', '0x80', '0x294', '0x0']

const HARDCODED_MEMORY = [
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000294',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000034',
  '41f44ad213cc2aace7bbcfee10971b60c633342c000000000000000000000000',
  '000000000000000000000015af1d78b58c400000000000000000000000000000',
  '000000000000000000000000000000000000000d1b18370dc678bb7eed10f9a1',
  '9f53ab437bdbf8f260f101fe8bdafc114212e0b846b4093d414f7499e09414c9',
  '5fa4e992f624d1810b24da5a1a92fa7d633fba4c7d6dca2772148d351760cde4',
  'b87db57b5684475012ccdc60a1862a649a68649024a7a64a01ea069bf9c0bba6',
  '8ed02e74658449452d0e2f95ee98650ce2592af9e416033b4c1648206bdf0cfb',
  '012813c77f9465b7cdced5b926898e834ce9c3b3fc4f1dc02bd191fb74dfd669',
  '04404ea4fedf2ef3615c40bcb59b8a7898da81c56797d474ae291fd0894fcb6c',
  '1e215503e7aef1640eeb2a58d5280193757b7b7111407d346aa988fdc9c668cb',
  'd43809f28144e70efbd36073aa8d6dd56b785792fbd721e94caeef0a6e5e8836',
  'f51fae486837e7bd550ac70ecbf6d0aa540377dd697cc9d362a75723b457ae19',
  'b69c7a756322d00443e2315af3fc0502bd4b10de558a46b59fbf8f16396bfc54',
  '573521c7b32037d3604df331350ecf1156f0a82fd627d85936b486edd1e2078b',
  '9a6a8b6c5e5517e05e64339b9c254f9906623671737f7ec9222b80a77c8f204e',
  '57672447de6e9fc67a938f235a454796f2ecc854000000000000000000000000',
  '0000000000000000000000000000000000000000000000000000000000000000',
]

describe('InputSourceManager', () => {
  it('should select memory strategy', () => {
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32[]',
      stackInitialIndex: 0,
      name: 'name',
      modifiers: ['memory'],
      isArray: true,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_MEMORY_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readStrategyName()).toBe('MemorySourceStrategy')
  })

  it('should select calldata strategy', () => {
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32[]',
      stackInitialIndex: 0,
      name: 'name',
      modifiers: ['calldata'],
      isArray: true,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_CALLDATA_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readStrategyName()).toBe('CallDataSourceStrategy')
  })

  it('should select stack strategy', () => {
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32[]',
      stackInitialIndex: 0,
      name: 'name',
      modifiers: [],
      isArray: true,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_MEMORY_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readStrategyName()).toBe('StackSourceStrategy')
  })

  it('should read value from stack strategy', () => {
    const expectedValue0 = '0xf532e79fd8a83d228423e8a129c87fc8fb7d42270d79565b90baebf142c40292'
    const expectedValue1 = '0xfaa17e7be3479cc3ebf495727ad8044bc41c58626c575ce410d2f437fe0440fc'

    const mockedFunctionInputParameter0: TContractFunctionInputParameter = {
      type: 'bytes32',
      stackInitialIndex: 0,
      name: 'name',
      modifiers: [],
      isArray: false,
    }

    const mockedFunctionInputParameter1: TContractFunctionInputParameter = {
      type: 'bytes32',
      stackInitialIndex: 1,
      name: 'name',
      modifiers: [],
      isArray: false,
    }

    const inputSourceManager0 = new InputSourceManager(
      HARDCODED_STACK_FOR_MEMORY_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter0,
    )

    const inputSourceManager1 = new InputSourceManager(
      HARDCODED_STACK_FOR_MEMORY_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter1,
    )

    expect(inputSourceManager0.readValue()).toBe(expectedValue0)
    expect(inputSourceManager1.readValue()).toBe(expectedValue1)
  })

  it('should read value from calldata strategy', () => {
    const expectedResult = [
      '0x1b18370dc678bb7eed10f9a19f53ab437bdbf8f260f101fe8bdafc114212e0b8',
      '0x46b4093d414f7499e09414c95fa4e992f624d1810b24da5a1a92fa7d633fba4c',
      '0x7d6dca2772148d351760cde4b87db57b5684475012ccdc60a1862a649a686490',
      '0x24a7a64a01ea069bf9c0bba68ed02e74658449452d0e2f95ee98650ce2592af9',
      '0xe416033b4c1648206bdf0cfb012813c77f9465b7cdced5b926898e834ce9c3b3',
      '0xfc4f1dc02bd191fb74dfd66904404ea4fedf2ef3615c40bcb59b8a7898da81c5',
      '0x6797d474ae291fd0894fcb6c1e215503e7aef1640eeb2a58d5280193757b7b71',
      '0x11407d346aa988fdc9c668cbd43809f28144e70efbd36073aa8d6dd56b785792',
      '0xfbd721e94caeef0a6e5e8836f51fae486837e7bd550ac70ecbf6d0aa540377dd',
      '0x697cc9d362a75723b457ae19b69c7a756322d00443e2315af3fc0502bd4b10de',
      '0x558a46b59fbf8f16396bfc54573521c7b32037d3604df331350ecf1156f0a82f',
      '0xd627d85936b486edd1e2078b9a6a8b6c5e5517e05e64339b9c254f9906623671',
      '0x737f7ec9222b80a77c8f204e57672447de6e9fc67a938f235a454796f2ecc854',
    ]
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32[]',
      stackInitialIndex: 2,
      name: 'name',
      modifiers: ['calldata'],
      isArray: true,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_CALLDATA_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readValue()).toEqual(expectedResult)
  })

  it('should read value from memory strategy', () => {
    const expectedResult = [
      '0x1b18370dc678bb7eed10f9a19f53ab437bdbf8f260f101fe8bdafc114212e0b8',
      '0x46b4093d414f7499e09414c95fa4e992f624d1810b24da5a1a92fa7d633fba4c',
      '0x7d6dca2772148d351760cde4b87db57b5684475012ccdc60a1862a649a686490',
      '0x24a7a64a01ea069bf9c0bba68ed02e74658449452d0e2f95ee98650ce2592af9',
      '0xe416033b4c1648206bdf0cfb012813c77f9465b7cdced5b926898e834ce9c3b3',
      '0xfc4f1dc02bd191fb74dfd66904404ea4fedf2ef3615c40bcb59b8a7898da81c5',
      '0x6797d474ae291fd0894fcb6c1e215503e7aef1640eeb2a58d5280193757b7b71',
      '0x11407d346aa988fdc9c668cbd43809f28144e70efbd36073aa8d6dd56b785792',
      '0xfbd721e94caeef0a6e5e8836f51fae486837e7bd550ac70ecbf6d0aa540377dd',
      '0x697cc9d362a75723b457ae19b69c7a756322d00443e2315af3fc0502bd4b10de',
      '0x558a46b59fbf8f16396bfc54573521c7b32037d3604df331350ecf1156f0a82f',
      '0xd627d85936b486edd1e2078b9a6a8b6c5e5517e05e64339b9c254f9906623671',
      '0x737f7ec9222b80a77c8f204e57672447de6e9fc67a938f235a454796f2ecc854',
    ]
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32[]',
      stackInitialIndex: 3,
      name: 'name',
      modifiers: ['memory'],
      isArray: true,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_MEMORY_ARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readValue()).toEqual(expectedResult)
  })

  it('should read value from memory strategy with single value', () => {
    const expectedResult = '0x294'
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32',
      stackInitialIndex: 0,
      name: 'name',
      modifiers: ['memory'],
      isArray: false,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_NONARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readValue()).toBe(expectedResult)
  })

  it('should read value from calldata strategy with single value', () => {
    const expectedResult = '0x1b18370dc678bb7eed10f9a19f53ab437bdbf8f260f101fe8bdafc114212e0b8'
    const mockedFunctionInputParameter: TContractFunctionInputParameter = {
      type: 'bytes32',
      stackInitialIndex: 2,
      name: 'name',
      modifiers: ['calldata'],
      isArray: false,
    }

    const inputSourceManager = new InputSourceManager(
      HARDCODED_STACK_FOR_CALLDATA_NONARRAY_PARAMETER,
      HARDCODED_MEMORY,
      HARDCODED_CALLDATA,
      mockedFunctionInputParameter,
    )

    expect(inputSourceManager.readValue()).toBe(expectedResult)
  })
})
