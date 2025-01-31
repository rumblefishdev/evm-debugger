import { ParamType } from 'ethers'

import { parseParameter, parseParameters } from './activeBlock.utils'

const ADDRESS_TYPE = ParamType.from(
  {
    type: 'address',
    name: 'recipient',
    indexed: false,
    components: null,
    baseType: 'address',
    arrayLength: null,
    arrayChildren: null,
    _isParamType: true,
  },
  true,
)

const UINT256_TYPE = ParamType.from(
  {
    type: 'uint256',
    name: null,
    indexed: null,
    components: null,
    baseType: 'uint256',
    arrayLength: null,
    arrayChildren: null,
    _isParamType: true,
  },
  true,
)

const BYTES_TYPE = ParamType.from(
  {
    type: 'bytes',
    name: 'permit',
    indexed: null,
    components: null,
    baseType: 'bytes',
    arrayLength: null,
    arrayChildren: null,
    _isParamType: true,
  },
  true,
)

const ADDRESS_ARRAY_TYPE = ParamType.from(
  {
    type: 'address[]',
    name: 'srcReceivers',
    indexed: null,
    components: null,
    baseType: 'array',
    arrayLength: -1,
    arrayChildren: ADDRESS_TYPE,
    _isParamType: true,
  },
  true,
)

const UNIT256_ARRAY_TYPE = ParamType.from(
  {
    type: 'uint256[]',
    name: 'srcAmounts',
    indexed: null,
    components: null,
    baseType: 'array',
    arrayLength: -1,
    arrayChildren: UINT256_TYPE,
    _isParamType: true,
  },
  true,
)

const TUPLE_TYPE = ParamType.from(
  {
    type: 'tuple',
    name: 'desc',
    indexed: null,
    components: [ADDRESS_TYPE, UINT256_TYPE, BYTES_TYPE, ADDRESS_ARRAY_TYPE, UNIT256_ARRAY_TYPE],
    baseType: 'tuple',
    arrayLength: null,
    arrayChildren: null,
    _isParamType: true,
  },
  true,
)

const ARRAY_TYPE = {
  type: 'tuple[]',
  name: 'consideration',
  indexed: false,
  components: [ADDRESS_TYPE, UINT256_TYPE, BYTES_TYPE, ADDRESS_ARRAY_TYPE, UNIT256_ARRAY_TYPE],
  baseType: 'array',
  arrayLength: -1,
  arrayChildren: TUPLE_TYPE,
  _isParamType: true,
}

describe('parseParameters tests', () => {
  describe('Exceptions', () => {
    it('Address exist but not with failed to decode output', () => {
      const result = parseParameters([ADDRESS_TYPE], null)
      expect(result).toStrictEqual([
        {
          value: 'Failed to decode',
          type: 'address',
          name: 'recipient',
        },
      ])
    })

    it('Tuple parameter exist but not with failed to decode output', () => {
      const result = parseParameters([TUPLE_TYPE], null)
      expect(result).toStrictEqual([
        {
          value: 'Failed to decode',
          type: 'tuple',
          name: 'desc',
        },
      ])
    })
  })
})

describe('parseParameter tests', () => {
  describe('Basic types', () => {
    it('Address type', () => {
      const value = '0xd45C07b37538e94cf0dC768A56491EeC14Ce898B'
      const result = parseParameter(ADDRESS_TYPE, '0xd45C07b37538e94cf0dC768A56491EeC14Ce898B')
      expect(result).toStrictEqual({
        value,
        type: 'address',
        name: 'recipient',
      })
    })

    it('unit256 type', () => {
      const value = BigInt('1')
      const result = parseParameter(UINT256_TYPE, value)
      expect(result).toStrictEqual({
        value: '0.000000000000000001 ETH',
        type: 'uint256',
        name: '',
      })
    })

    it('Bytes type', () => {
      const value =
        '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e'
      const result = parseParameter(BYTES_TYPE, value)
      expect(result).toStrictEqual({
        value,
        type: 'bytes',
        name: 'permit',
      })
    })
  })
  describe('Collection types', () => {
    it('Address array', () => {
      const address1 = '0xd45C07b37538e94cf0dC768A56491EeC14Ce898B'
      const address2 = '0xabcd07b37538e94cf0dC768A56491EeC14Ce898B'
      const values = [address1, address2]
      const result = parseParameter(ADDRESS_ARRAY_TYPE, values)
      expect(result).toStrictEqual({
        value: values,
        type: 'address[]',
        name: 'srcReceivers',
      })
    })

    it('uint256 array', () => {
      const values = [BigInt('1'), BigInt('2')]
      const result = parseParameter(UNIT256_ARRAY_TYPE, values)
      expect(result).toStrictEqual({
        value: ['0.000000000000000001 ETH', '0.000000000000000002 ETH'],
        type: 'uint256[]',
        name: 'srcAmounts',
      })
    })

    it('Tuple type', () => {
      const bytes =
        '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e'
      const values = [
        '0x30dcBa0405004cF124045793E1933C798Af9E66a',
        BigInt('1'),
        bytes,
        ['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', '0xEaaaaaEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'],
        [BigInt('2'), BigInt('3')],
      ]
      const result = parseParameter(TUPLE_TYPE, values)
      expect(result).toMatchSnapshot()
    })
    it('Tuple[] type', () => {
      const bytes =
        '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e'

      const values = [
        [
          '0x30dcBa0405004cF124045793E1933C798Af9E66a',
          BigInt('1'),
          bytes,
          ['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', '0xEaaaaaEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'],
          [BigInt('2'), BigInt('3')],
        ],
        [
          '0xbbbBa0405004cF124045793E1933C798Af9E66a',
          BigInt('5'),
          bytes,
          ['0xEeeeeEeeeEeEeeEeEeEeeffffffffffFAFFFfffE', '0xEaaaaaEeEeeEeEeEeeEffffffffffffffffffff'],
          [BigInt('62'), BigInt('33')],
        ],
      ]
      const result = parseParameter(ARRAY_TYPE, values)
      expect(result).toMatchSnapshot()
    })
  })
  describe('Exceptions', () => {
    it('uint256 array with Too little received', () => {
      const exception = 'Too little received'
      const result = parseParameter(UNIT256_ARRAY_TYPE, exception)
      expect(result).toStrictEqual({
        value: exception,
        type: 'uint256[]',
        name: 'srcAmounts',
      })
    })
  })
})
