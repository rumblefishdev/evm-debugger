# How values are read from the input source. 

## How to read memory and calldata from hex value

For example hex value = `0x20` is the offset in memory where the value is stored.
So `0x20` is `32` in decimal. So the value is stored at the 32nd byte in memory.
One byte in memory is 2 hexadecimal characters. So the value is stored from the 64th character in the memory.

## Input Parameter
Example Function signature: 

`function verify(bytes32[] calldata _proof, bytes32 _leaf) public view returns (bool, uint256) {}`

is converted to:

- `name` : Input name => `_proof`  
- `type` : Input type => `bytes32[]`
- `isArray` : Whether the input source is an array or not => `true`
- `modifiers` : The modifiers of the input source => `[ calldata ]`
- `stackInitialIndex` : The initial index of the stack. => `2`
  

### How to read stackInitialIndex

Example Function signature:   
`function verify(bytes32 calldata _proof, bytes32 _leaf) public view returns (bool, uint256) {}`

So in this example we have 2 input parameters `_proof` and `_leaf`. The values of these parameters are pushed to the stack in the order they are declared in the function signature. So `_proof` is pushed to the stack first and `_leaf` is pushed to the stack next. So the `stackInitialIndex` of `_proof` is `1` and the `stackInitialIndex` of `_leaf` is `0` as it is on the top of the stack.

<b>Stack</b>:

[0000000000000000000000000000000000000000000000000000000000000005] _leaf  
[00000000000000000000000000000000000000000000000000000000000000c4] _proof  
[0000000000000000000000000000000000000000000000000000000000000000]  


Example With Arrays:

`function verify(bytes32[] calldata _proof, bytes32 _leaf) public view returns (bool, uint256) {}`

In this example we have 2 input parameters `_proof` and `_leaf`, similar to the previous example. But `_proof` is an array. Array parameters require an additional stack index to store the length of the array. So the `stackInitialIndex` of `_proof` is `2` and the `stackInitialIndex` of `_leaf` is `0` as it is on the top of the stack.

<b>Stack</b>:  
[0000000000000000000000000000000000000000000000000000000000000005] _leaf  
[00000000000000000000000000000000000000000000000000000000000000c4] _proof.offset  
[000000000000000000000000000000000000000000000000000000000000000d] _proof.length  

## Reading parameters values without modifiers [ stack ]

Its simplest case because we need only to read the value from the stack at the index `stackInitialIndex` and we don't need to consider the modifiers.

Implementation: 
```javascript
return `0x${this.stack[this.contractFunction.stackInitialIndex].replace(/^0+/, '')}`;
```

So with the stack:  
[ 
    0000000000000000000000000000000000000000000000000000000000000005,
    00000000000000000000000000000000000000000000000000000000000000c4,
    000000000000000000000000000000000000000000000000000000000000000d
]
and the `stackInitialIndex` = `0`

We will return `0000000000000000000000000000000000000000000000000000000000000005`
Then we strip all the leading zeros and return `5` with `0x` to indicate that it is a hexadecimal number.

## Reading parameters values with modifier [ memory, calldata ]

<b>Non Array</b>  

With this case we need to read the offset in memory from stack
and then read the value [one word] from memory at the offset.

Implementation: 
```javascript
    const readOffset = this.stack[this.contractFunction.stackInitialIndex]
    const readLength = '0x20'

    const memoryReadValue = readMemory(this.memory, readOffset, readLength)

    return `0x${memoryReadValue.replace(/^0+/, '')}`
```

So with the 
stack:  
[
    00000000000000000000000000000000000000000000000000000000000000020
]  
memory:  
[  
    00000000000000000000000000000000000000000000000000000000000000000 | 0x00
    000000000000000000000000000000000000000000000000000000000000e2125 | 0x20  
]

and the `stackInitialIndex` = `0`

We will read the offset from the stack `00000000000000000000000000000000000000000000000000000000000000020`
We define word length as `0x20` which result in 64 characters of memory.
So we read the value from memory at the offset `0x20` and length of `64` characters.
The value read from memory is `000000000000000000000000000000000000000000000000000000000000e2125`
Then we strip all the leading zeros and return `e2125` with `0x` to indicate that it is a hexadecimal number.

<b>Array</b>

With this case we need to read the offset and arrayLength from stack
and then read the value [arrayLength words] from memory at the offset.

Implementation: 
```javascript
    const readLength = this.stack[this.contractFunction.stackInitialIndex]
    const readStart = this.stack[this.contractFunction.stackInitialIndex - 1]

    const memoryReadValue = readMemory(this.memory, readStart, readLength)
    const memoryWordArray = memoryReadValue.match(/.{1,64}/g)
    const bytesArrayLength = parseInt(memoryWordArray[0], 16)

    const result = memoryWordArray.slice(1, bytesArrayLength + 1)

    return result.map((r) => `0x${r.replace(/^0+/, '')}`)
```

So with the
stack:  
[
    0000000000000000000000000000000000000000000000000000000000000020
    0000000000000000000000000000000000000000000000000000000000000002
]
memory:  
[
    00000000000000000000000000000000000000000000000000000000000000000 | 0x00
    000000000000000000000000000000000000000000000000000000000000e2125 | 0x20  
    00000000000000000000000000000000000000000000000000000000000001825 | 0x40  
    000000000000000000000000000000000000000000000000000000000000eccc5 | 0x60  
]

and the `stackInitialIndex` = `1`

We will read the length from the stack `0000000000000000000000000000000000000000000000000000000000000002`
We will read the offset from the stack `0000000000000000000000000000000000000000000000000000000000000020`
Then we read the value from memory with theses values. The value read from memory is
`000000000000000000000000000000000000000000000000000000000000e212500000000000000000000000000000000000000000000000000000000000001825`
The we slice it to 64 char words and format them to hexadecimal numbers. The result is `['0xe2125', '0x1825']`