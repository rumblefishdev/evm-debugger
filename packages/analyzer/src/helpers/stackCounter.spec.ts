import { StackCounter } from './stackCounter'

describe('StackCounter', () => {
  it('analyzes simple mint transaction', () => {
    const initAddress = '0xInitAddress'
    const stackCounter = new StackCounter()
    expect(stackCounter.visitDepth(0, initAddress)).toEqual([])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)
    const address1 = '0xAddress1'
    const address2 = '0xAddress2'
    const address3 = '0xAddress3'
    expect(stackCounter.visitDepth(1, address1)).toEqual([0])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)
    expect(stackCounter.visitDepth(1, address2)).toEqual([1])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)

    expect(stackCounter.visitDepth(1, address3)).toEqual([2])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)
    expect(stackCounter.visitDepth(2, address2)).toEqual([2, 0])
    expect(stackCounter.getParentStorageAddress()).toEqual(address3)

    expect(stackCounter.visitDepth(2, address3)).toEqual([2, 1])
    expect(stackCounter.getParentStorageAddress()).toEqual(address3)
    expect(stackCounter.visitDepth(1, address3)).toEqual([3])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)
    expect(stackCounter.visitDepth(2, address1)).toEqual([3, 0])
    expect(stackCounter.getParentStorageAddress()).toEqual(address3)
    expect(stackCounter.visitDepth(3, address2)).toEqual([3, 0, 0])
    expect(stackCounter.getParentStorageAddress()).toEqual(address1)
    expect(stackCounter.visitDepth(3, address2)).toEqual([3, 0, 1])
    expect(stackCounter.getParentStorageAddress()).toEqual(address1)
    expect(stackCounter.visitDepth(2, address2)).toEqual([3, 1])
    expect(stackCounter.getParentStorageAddress()).toEqual(address3)
    expect(stackCounter.visitDepth(1, address2)).toEqual([4])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)
    expect(stackCounter.visitDepth(1, address2)).toEqual([5])
    expect(stackCounter.getParentStorageAddress()).toEqual(initAddress)
    expect(stackCounter.visitDepth(2, address3)).toEqual([5, 0])
    expect(stackCounter.getParentStorageAddress()).toEqual(address2)
  })
})
