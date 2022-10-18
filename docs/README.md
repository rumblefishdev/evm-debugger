# Notes on EVM debugging

## Example command to run local hardhat network

```
node_modules/.bin/hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/4PB39lGfrAHjn4fr5cJ_j6M2-7N7jyBT --fork-block-number 15773299
```

## Get trace from some transaction from Ethereum mainnet

This assumes the local hardhat node is running and it's forking mainnet.

```
curl -X POST -H"Content-Type: application/json" -d'{"method":"debug_traceTransaction","jsonrpc":"2.0","id":1,"params":["0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682"]}' localhost:8545 | jq
```

- put any transaction hash you like
- `jq` is for json formatting
- beware, example above spits out 34M of data


## Get transaction information

Using same trasnsaction as above you can get information out the input of transaction:

```
$ curl -X POST -H"Content-Type: application/json" -d'{"method":"eth_getTransactionByHash","jsonrpc":"2.0","id":1,"params":["0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682"]}' localhost:8545  | jq

{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
    "blockNumber": "0xf0ad48",
    "from": "0x5af940352557cc707fd5cffc0aedcf1ea8e63865",
    "gas": "0x3d636",
    "hash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
    "input": "0xa7f5c10400000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000062000000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001400000000000000000000000005af940352557cc707fd5cffc0aedcf1ea8e6386500000000000000000000000000000000000000000000000ac22f8686ff44eb99000000000000000000000000000000000000000000000000002199ac457472f70000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000634e429c00000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000ac22f8686ff44eb990000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd00000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000a27b22536f75726365223a22646578746f6f6c73222c2244617461223a227b5c22736f757263655c223a5c22646578746f6f6c735c227d222c22416d6f756e74496e555344223a2231322e373837313734313534323034393134222c22416d6f756e744f7574555344223a2231322e373037393834393333333835393634222c22526566657272616c223a22222c22496e74656772697479496e666f223a6e756c6c7d000000000000000000000000000000000000000000000000000000000000",
    "nonce": "0x51",
    "to": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
    "transactionIndex": "0x7f",
    "value": "0x0",
    "v": "0x0",
    "r": "0xf46cff1e00802522b32d9e7e0be9dd60c93a43784b42417acbe2c5b59f500f1b",
    "s": "0x604536f0b333cc4c800aac43b1c37f9ca17023422fd2e76849f2b95534f9146d",
    "type": "0x2",
    "accessList": [],
    "chainId": "0x1",
    "gasPrice": "0x37e11d600",
    "maxFeePerGas": "0x37e11d600",
    "maxPriorityFeePerGas": "0x37e11d600"
  }
}
```

The `to` field above is the address of the contract that is getting called.
We can look it up on etherscan: https://etherscan.io/address/0x617dee16b86534a5d792a4d7a62fb491b544111e#code


### Getting transaction receipt

This is information out the result of transaction (logs and result)

```
$ curl -X POST -H"Content-Type: application/json" -d'{"method":"eth_getTransactionReceipt","jsonrpc":"2.0","id":1,"params":["0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682"]}' localhost:8545  | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  7137  100  6996  100   141  11104    223 --:--:-- --:--:-- --:--:-- 11310
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
    "blockNumber": "0xf0ad48",
    "contractAddress": null,
    "cumulativeGasUsed": "0xe0332b",
    "from": "0x5af940352557cc707fd5cffc0aedcf1ea8e63865",
    "gasUsed": "0x3117f",
    "logs": [
      {
        "removed": false,
        "address": "0x30dcba0405004cf124045793e1933c798af9e66a",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x00000000000000000000000000000000000000000000000ac22f8686ff44eb99",
        "logIndex": "0x144",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x0000000000000000000000005af940352557cc707fd5cffc0aedcf1ea8e63865",
          "0x000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd"
        ]
      },
      {
        "removed": false,
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x0000000000000000000000000000000000000000000000000021f89377c7214c",
        "logIndex": "0x145",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          "0x000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd",
          "0x00000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c4"
        ]
      },
      {
        "removed": false,
        "address": "0x153f2044feace1eb377c6e1cf644d12677bd86fd",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x0000000000000000000000000000000000000000000d6883a15d1669cb96f81600000000000000000000000000000000000000000000002a76efb4993dbe9535",
        "logIndex": "0x146",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"
        ]
      },
      {
        "removed": false,
        "address": "0x153f2044feace1eb377c6e1cf644d12677bd86fd",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x00000000000000000000000000000000000000000000000ac22f8686ff44eb99000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000021f89377c7214c",
        "logIndex": "0x147",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
          "0x00000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c4",
          "0x00000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c4"
        ]
      },
      {
        "removed": false,
        "address": "0x45a5b8cf524ec574b40e80274f0f3856a679c5c4",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd0000000000000000000000000000000000000000000000000021f89377c7214c000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "logIndex": "0x148",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0xddac40937f35385a34f721af292e5a83fc5b840f722bff57c2fc71adba708c48"
        ]
      },
      {
        "removed": false,
        "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x0000000000000000000000000000000000000000000000000021f89377c7214c",
        "logIndex": "0x149",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
          "0x00000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c4"
        ]
      },
      {
        "removed": false,
        "address": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x0000000000000000000000005af940352557cc707fd5cffc0aedcf1ea8e6386500000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000005af940352557cc707fd5cffc0aedcf1ea8e6386500000000000000000000000000000000000000000000000ac22f8686ff44eb990000000000000000000000000000000000000000000000000021de7c7f5ac1b6",
        "logIndex": "0x14a",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0xd6d4f5681c246c9f42c203e287975af1601f8df8035a9251f79aab5c8f09e2f8"
        ]
      },
      {
        "removed": false,
        "address": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x00000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c40000000000000000000000000000000000000000000000000021de7c7f5ac1b6000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "logIndex": "0x14b",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0xddac40937f35385a34f721af292e5a83fc5b840f722bff57c2fc71adba708c48"
        ]
      },
      {
        "removed": false,
        "address": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
        "blockHash": "0x9bb67c7d2fd0423895e83d157395a15cdb1f5a016cfe6e530a5f78f4527a155e",
        "blockNumber": "0xf0ad48",
        "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a27b22536f75726365223a22646578746f6f6c73222c2244617461223a227b5c22736f757263655c223a5c22646578746f6f6c735c227d222c22416d6f756e74496e555344223a2231322e373837313734313534323034393134222c22416d6f756e744f7574555344223a2231322e373037393834393333333835393634222c22526566657272616c223a22222c22496e74656772697479496e666f223a6e756c6c7d000000000000000000000000000000000000000000000000000000000000",
        "logIndex": "0x14c",
        "transactionIndex": "0x7f",
        "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
        "topics": [
          "0x095e66fa4dd6a6f7b43fb8444a7bd0edb870508c7abf639bc216efb0bcff9779"
        ]
      }
    ],
    "logsBloom": "0x00200000010000000000000080000000000000000000000000000000200000000000000000000000000000040000000006000000080000000000000000000000000000000000000002000028000000200000000000440000000000004000000000000010000000400000000000000000000000000000040000000010000200000000000000000000000000004000400000000001000040080000004000000000000000008000000000000010000000000000000000000000002000001000000000000002080000000000000000601000000000000400001000004002000000000000200000000000000100000000000000008000010000000000000002000000",
    "status": "0x1",
    "to": "0x617dee16b86534a5d792a4d7a62fb491b544111e",
    "transactionHash": "0x4c39f85ff29a71b49d4237fe70d68366ccd28725e1343500c1203a9c62674682",
    "transactionIndex": "0x7f",
    "type": "0x2",
    "effectiveGasPrice": "0x37e11d600"
  }
}
```

### Getting ABI

You can get ABI of any contract that is verified on Etherscan using:

```
$ curl "https://api.etherscan.io/api?module=contract&action=getabi&address=0x617dee16b86534a5d792a4d7a62fb491b544111e&apikey=VTCZHIZD7SD7EP2TMQRDINFV8HWHM243MY" | jq -r .result | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  8582  100  8582    0     0  13305      0 --:--:-- --:--:-- --:--:-- 13305
[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_WETH",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "clientData",
        "type": "bytes"
      }
    ],
    "name": "ClientData",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "Error",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "pair",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "output",
        "type": "address"
      }
    ],
    "name": "Exchange",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "contract IERC20",
        "name": "srcToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "contract IERC20",
        "name": "dstToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "dstReceiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "spentAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      }
    ],
    "name": "Swapped",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "WETH",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isWhitelist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "rescueFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IAggregationExecutor",
        "name": "caller",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "contract IERC20",
            "name": "srcToken",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "dstToken",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "srcReceivers",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "srcAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "dstReceiver",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minReturnAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "flags",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "permit",
            "type": "bytes"
          }
        ],
        "internalType": "struct MetaAggregationRouter.SwapDescription",
        "name": "desc",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "executorData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "clientData",
        "type": "bytes"
      }
    ],
    "name": "swap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gasUsed",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IAggregationExecutor1Inch",
        "name": "caller",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "contract IERC20",
            "name": "srcToken",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "dstToken",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "srcReceiver1Inch",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "dstReceiver",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "srcReceivers",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "srcAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minReturnAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "flags",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "permit",
            "type": "bytes"
          }
        ],
        "internalType": "struct SwapDescriptionExecutor1Inch",
        "name": "desc",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "executor1InchData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "clientData",
        "type": "bytes"
      }
    ],
    "name": "swapExecutor1Inch",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gasUsed",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "router1Inch",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "router1InchData",
        "type": "bytes"
      },
      {
        "components": [
          {
            "internalType": "contract IERC20",
            "name": "srcToken",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "dstToken",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "srcReceivers",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "srcAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "dstReceiver",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minReturnAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "flags",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "permit",
            "type": "bytes"
          }
        ],
        "internalType": "struct MetaAggregationRouter.SwapDescription",
        "name": "desc",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "clientData",
        "type": "bytes"
      }
    ],
    "name": "swapRouter1Inch",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gasUsed",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IAggregationExecutor",
        "name": "caller",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "contract IERC20",
            "name": "srcToken",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "dstToken",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "srcReceivers",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "srcAmounts",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "dstReceiver",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minReturnAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "flags",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "permit",
            "type": "bytes"
          }
        ],
        "internalType": "struct MetaAggregationRouter.SwapDescription",
        "name": "desc",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "executorData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "clientData",
        "type": "bytes"
      }
    ],
    "name": "swapSimpleMode",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "returnAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gasUsed",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "value",
        "type": "bool"
      }
    ],
    "name": "updateWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]
```

### Decode transaction input in context of the contract ABI

Using node:

```
const ethers = require('ethers')
const iface = new ethers.utils.Interface(abi) // abi is the list we got from Etherscan
// data above is the same as input in response of eth_getTransactionByHash
iface.parseTransaction({ "data": "0xa7f5c10400000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000260000000000000000000000000000000000000000000000000000000000000062000000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001400000000000000000000000005af940352557cc707fd5cffc0aedcf1ea8e6386500000000000000000000000000000000000000000000000ac22f8686ff44eb99000000000000000000000000000000000000000000000000002199ac457472f70000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000634e429c00000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000ac22f8686ff44eb990000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd00000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000a27b22536f75726365223a22646578746f6f6c73222c2244617461223a227b5c22736f757263655c223a5c22646578746f6f6c735c227d222c22416d6f756e74496e555344223a2231322e373837313734313534323034393134222c22416d6f756e744f7574555344223a2231322e373037393834393333333835393634222c22526566657272616c223a22222c22496e74656772697479496e666f223a6e756c6c7d000000000000000000000000000000000000000000000000000000000000"})
TransactionDescription {
  args: [
    '0x45a5B8Cf524EC574b40e80274F0F3856A679C5c4',
    [
      '0x30dcBa0405004cF124045793E1933C798Af9E66a',
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      [],
      [],
      '0x5AF940352557cc707Fd5CfFc0aedCF1EA8e63865',
      [BigNumber],
      [BigNumber],
      [BigNumber],
      '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e',
      srcToken: '0x30dcBa0405004cF124045793E1933C798Af9E66a',
      dstToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      srcReceivers: [],
      srcAmounts: [],
      dstReceiver: '0x5AF940352557cc707Fd5CfFc0aedCF1EA8e63865',
      amount: [BigNumber],
      minReturnAmount: [BigNumber],
      flags: [BigNumber],
      permit: '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e'
    ],
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000634e429c00000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000ac22f8686ff44eb990000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd00000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e',
    '0x7b22536f75726365223a22646578746f6f6c73222c2244617461223a227b5c22736f757263655c223a5c22646578746f6f6c735c227d222c22416d6f756e74496e555344223a2231322e373837313734313534323034393134222c22416d6f756e744f7574555344223a2231322e373037393834393333333835393634222c22526566657272616c223a22222c22496e74656772697479496e666f223a6e756c6c7d',
    caller: '0x45a5B8Cf524EC574b40e80274F0F3856A679C5c4',
    desc: [
      '0x30dcBa0405004cF124045793E1933C798Af9E66a',
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      [],
      [],
      '0x5AF940352557cc707Fd5CfFc0aedCF1EA8e63865',
      [BigNumber],
      [BigNumber],
      [BigNumber],
      '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e',
      srcToken: '0x30dcBa0405004cF124045793E1933C798Af9E66a',
      dstToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      srcReceivers: [],
      srcAmounts: [],
      dstReceiver: '0x5AF940352557cc707Fd5CfFc0aedCF1EA8e63865',
      amount: [BigNumber],
      minReturnAmount: [BigNumber],
      flags: [BigNumber],
      permit: '0x00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e'
    ],
    executorData: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000634e429c00000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000ac22f8686ff44eb990000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd00000000000000000000000030dcba0405004cf124045793e1933c798af9e66a000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001e',
    clientData: '0x7b22536f75726365223a22646578746f6f6c73222c2244617461223a227b5c22736f757263655c223a5c22646578746f6f6c735c227d222c22416d6f756e74496e555344223a2231322e373837313734313534323034393134222c22416d6f756e744f7574555344223a2231322e373037393834393333333835393634222c22526566657272616c223a22222c22496e74656772697479496e666f223a6e756c6c7d'
  ],
  functionFragment: {
    type: 'function',
    name: 'swapSimpleMode',
    constant: false,
    inputs: [ [ParamType], [Object], [ParamType], [ParamType] ],
    outputs: [ [ParamType], [ParamType] ],
    payable: false,
    stateMutability: 'nonpayable',
    gas: null,
    _isFragment: true,
    constructor: [Function: FunctionFragment] {
      from: [Function (anonymous)],
      fromObject: [Function (anonymous)],
      fromString: [Function (anonymous)],
      isFunctionFragment: [Function (anonymous)]
    },
    format: [Function (anonymous)]
  },
  name: 'swapSimpleMode',
  signature: 'swapSimpleMode(address,(address,address,address[],uint256[],address,uint256,uint256,uint256,bytes),bytes,bytes)',
  sighash: '0xa7f5c104',
  value: BigNumber { _hex: '0x00', _isBigNumber: true }
}
```

Above we see information parsed information about what was called.

Using same approach we can get inforamtion about internal calls.


## Structure of the trace.json

I'm looking at file `./example/trace.json`. It's the result of parsing the same transaction we've were
looking at above. The file has about 650k lines and weights 35 mb, so it's very verbose. **Our goal is to
present the important bits of it in a form that is useful for debugging**.


The structure goes like:

```
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "gas": 201087,
    "failed": false,
    "returnValue": "0000000000000000000000000000000000000000000000000021de7c7f5ac1b6000000000000000000000000000000000000000000000000000000000002f573",
    "structLogs": [
      {
        "pc": 0,
        "op": "PUSH1",
        "gas": 217838,
        "gasCost": 3,
        "depth": 1,
        "stack": [],
        "memory": [],
        "storage": {}
      },
      (... ~650k lines omitted )
      {
        "pc": 336,
        "op": "RETURN",
        "gas": 22859,
        "gasCost": 0,
        "depth": 1,
        "stack": [
          "00000000000000000000000000000000000000000000000000000000a7f5c104",
          "0000000000000000000000000000000000000000000000000000000000000040",
          "00000000000000000000000000000000000000000000000000000000000007cc"
        ],
        "memory": [
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "00000000000000000000000000000000000000000000000000000000000007cc",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000120",
          "0000000000000000000000000000000000000000000000000000000000000160",
          "00000000000000000000000000000000000000000000000000000000000001a0",
          "00000000000000000000000000000000000000000000000000000000634e429c",
          "0000000000000000000000000000000000000000000000000000000000000380",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "00000000000000000000000000000000000000000000000ac22f8686ff44eb99",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "00000000000000000000000000000000000000000000000000000000000001e0",
          "0000000000000000000000000000000000000000000000000000000000000180",
          "0000000000000000000000000000000000000000000000000000000000000020",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "0000000000000000000000000000000000000000000000000000000000000020",
          "0000000000000000000000000000000000000000000000000000000000000040",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "00000000000000000000000000000000000000000000000000000000000000c0",
          "000000000000000000000000153f2044feace1eb377c6e1cf644d12677bd86fd",
          "00000000000000000000000030dcba0405004cf124045793e1933c798af9e66a",
          "000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
          "00000000000000000000000045a5b8cf524ec574b40e80274f0f3856a679c5c4",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000060",
          "00000000000000000000000096c195f6643a3d797cb90cb6ba0ae2776d51b5f3",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "000000000000000000000000000000000000000000000000000000000000001e",
          "0000000000000000000000000000000000000000000000000000000000000064",
          "23b872dd0000000000000000000000005af940352557cc707fd5cffc0aedcf1e",
          "a8e63865000000000000000000000000153f2044feace1eb377c6e1cf644d126",
          "77bd86fd00000000000000000000000000000000000000000000000ac22f8686",
          "ff44eb9900000000000000000000000000000000000000000000000000000000",
          "0000002000000000000000000000000000000000000000000000000000000000",
          "0000000100000000000000000000000000000000000000000000000000000000",
          "000001c48b674f5d000000000000000000000000000000000000000000000000",
          "0000000000000020000000000000000000000000000000000000000000000000",
          "0000000000000180000000000000000000000000000000000000000000000000",
          "0000000000000020000000000000000000000000000000000000000000000000",
          "0000000000000001000000000000000000000000000000000000000000000000",
          "0000000000000020000000000000000000000000000000000000000000000000",
          "0000000000000040000000000000000000000000000000000000000000000000",
          "0000000000000001000000000000000000000000000000000000000000000000",
          "00000000000000c0000000000000000000000000153f2044feace1eb377c6e1c",
          "f644d12677bd86fd00000000000000000000000030dcba0405004cf124045793",
          "e1933c798af9e66a000000000000000000000000c02aaa39b223fe8d0a0e5c4f",
          "27ead9083c756cc200000000000000000000000045a5b8cf524ec574b40e8027",
          "4f0f3856a679c5c4000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000104774b6b7e00000000000000000000000030dcba0405004cf1",
          "24045793e1933c798af9e66a000000000000000000000000eeeeeeeeeeeeeeee",
          "eeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000005af940352557cc70",
          "7fd5cffc0aedcf1ea8e638650000000000000000000000000000000000000000",
          "0000000000000000000000800000000000000000000000000000000000000000",
          "00000000000000000000006000000000000000000000000096c195f6643a3d79",
          "7cb90cb6ba0ae2776d51b5f30000000000000000000000000000000000000000",
          "0000000000000000000000010000000000000000000000000000000000000000",
          "00000000000000000000001e0000000000000000000000000000000000000000",
          "000000000021de7c7f5ac1b60000000000000000000000000000000000000000",
          "00000000000000000002f5737b22536f75726365223a22646578746f6f6c7322",
          "2c2244617461223a227b5c22736f757263655c223a5c22646578746f6f6c735c",
          "227d222c22416d6f756e74496e555344223a2231322e37383731373431353432",
          "3034393134222c22416d6f756e744f7574555344223a2231322e373037393834",
          "393333333835393634222c22526566657272616c223a22222c22496e74656772",
          "697479496e666f223a6e756c6c7d000000000000000000000000000000000000",
          "0000000000000000000000000000001e00000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000"
        ],
        "storage": {}
      }
    ]
  }
}
```


Each entry of array under `obj.result.structLogs` represents one tick of the EVM
(ethereum virtual machine).


Tasks:

1. Transform trace.json into an object like:

```
[
  {
    id: "{CALL|STATICCALL|DELEGATECALL}_{indexes}",
    to, //address
    value, // native coin passed to the call
    gasCost, // difference in gas between start and finish
    success, // flag returned
    returnData, // you need to parse from stack of RETURN opcode and copy from memory
    startIndex, // index of structLogs where we entered this step
    returnIndex, // index of structLogs where we finished this step
  }
]
```

Indexes goes like:

- `CALL_0` <- first call done from root level
- `STATICCALL_0_0` <- staticcall done from inside of call above
- `STATICCALL_1` <- static call done after exiting nested function (so from root level)


2. Provide to your script a Dictionary of address -> abi. Make it so that if ABI is known the structure
above is enriched with `methodSignature`, `arguments`, `parsedReturnData`.
