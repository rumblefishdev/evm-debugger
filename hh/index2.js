const solc = require('solc');
const fs = require('fs/promises');

class SourceMapElement {
  cons
}

const formatOpcodes = (opcodesRaw) => {
  return opcodesRaw
}

const formatSourceMap = (sourceMapRaw) => {
  return sourceMapRaw.split(";")
}

const getInternals = (contractCode) => {
  const input = {
    language: 'Solidity',
    sources: {
      'test.sol': {
        content: contractCode
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  return Object.entries(output.contracts).flatMap(([fileName, fileInternals]) => {
    return Object.entries(fileInternals).map(
      ([contractName, contractInternals]) => ({
        fileName,
        contractName,
        opcodes: formatOpcodes(contractInternals.evm.bytecode.opcodes),
        sourceMap: formatSourceMap(contractInternals.evm.bytecode.sourceMap)
      })
    )
  })
}

async function main() {
  const aSol = await fs.readFile('a.sol')
  const aSolString = aSol.toString()

  console.log('asol', aSolString)
  console.log('internals', getInternals(aSolString))
}

main()