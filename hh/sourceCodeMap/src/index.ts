import * as solc from "solc";
import * as fs from "fs/promises";
import { glob } from "glob";
import { render } from "nunjucks";
import { SourceMapElement } from "./sourceMapElement";
import { addNewPotentialOpcodes, getLastOpcodeFile } from "./opcodesFile";
import { EntryType, SolcOutput } from "./types";
import { SourceMapElementTree } from "./sourceMapElementTree";
import { SourceMapContext } from "./sourceMapContext"
import { renderAndSaveAsync } from "./asyncNunjucks";

const formatOpcodes = async (opcodesRaw: string): Promise<string> => {
  const opcodeFile = await getLastOpcodeFile()

  const parts = opcodesRaw.split(" ")
  let lastCommand: string = ""
  let formattedOpcodes: string[] = []
  for (const part of parts) {
    if (opcodeFile.opcodes.includes(part)) {
      formattedOpcodes = [
        ...formattedOpcodes,
        lastCommand
      ]

      lastCommand = part
    } else {
      lastCommand = `${lastCommand} ${part}`
    }
  }

  return formattedOpcodes.join("\n")
}

const formatSourceMap = (sourceMapRaw: string, sourceCode: string, allOpCodes: string[]): SourceMapElementTree => {
  const sourceMapContext = new SourceMapContext(
    sourceCode,
    allOpCodes
  )

  return SourceMapElementTree.fromElements(
    SourceMapElement.fromSourceMapString(sourceMapRaw, sourceMapContext)
  )
}

const gatherSameSourceCodeElements = (els: SourceMapElement[]): SourceMapElement[] => {
  return els.reduce<SourceMapElement[]>(
    (acc, item, idx): SourceMapElement[] => {
      const lastItem = acc.length > 0 ? acc[acc.length - 1] : null
      if (lastItem === null) {
        console.log(1)
        return [
          item
        ]
      }

      // console.log('reduce', idx, acc.length, { start: lastItem.start, end: lastItem.end, sourceSt: lastItem.sourceString, ids: lastItem.ids }, {start: item.start, end: item.end, sourceSt: lastItem.sourceString })
      if (lastItem.start === item.start && item.end === lastItem.end) {
        const lastItemClone = lastItem.clone()
        lastItemClone.addIds(item.ids)
        acc.splice(-1)
        return [
          ...acc,
          lastItemClone
        ]
      }

      return [
        ...acc,
        item
      ]
    },
    []
  )
}

const renderSourceMapOutput = async (sourceMapRaw: string, sourceCode: string, allOpCodes: string[]): Promise<void> => {
  const sourceMapContext = new SourceMapContext(
    sourceCode,
    allOpCodes
  )

  const elements = SourceMapElement.fromSourceMapString(sourceMapRaw, sourceMapContext)
  const gatheredElements = gatherSameSourceCodeElements(elements)

  console.log('before', elements.length, gatheredElements.length)

  const jumpDestLevels = SourceMapElement.getJumpDestLevels(gatheredElements)

  await renderAndSaveAsync(
    __dirname+"/templates/index.html.jinja2",
    {
      title: 'index',
      elements: gatheredElements,
      jumpDestLevels
    },
    __dirname+"/index.html"
  )
}

const getInternals = async (contractCode: string) => {
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

  const output = JSON.parse(solc.compile(JSON.stringify(input))) as SolcOutput;

  let allEntries: EntryType[] = []
  for (const [fileName, fileInternals] of Object.entries(output.contracts)) {
    const newEntries: EntryType[] = await Promise.all(
      Object.entries(fileInternals).map(
        async ([contractName, contractInternals]) => {
          const formattedOpcodes = await formatOpcodes(contractInternals.evm.deployedBytecode.opcodes)
          const formattedOpcodesArr = formattedOpcodes.split("\n")

          formattedOpcodesArr.shift()

          await renderSourceMapOutput(contractInternals.evm.deployedBytecode.sourceMap, contractCode, formattedOpcodesArr)

          return {
            fileName,
            contractName,
            opcodes: formattedOpcodes,
            opcodesRaw: contractInternals.evm.deployedBytecode.opcodes,
            sourceMap: formatSourceMap(contractInternals.evm.deployedBytecode.sourceMap, contractCode, formattedOpcodesArr).shrinkTree(),
          };
        }
      )
    )

    allEntries = [
      ...allEntries,
      ...newEntries
    ]
  }

  return allEntries
}

async function main() {
  const CONTRACTS_DIR = __dirname+"/../contracts"

  const solFiles = await glob(`${CONTRACTS_DIR}/**/*.sol`, {})

  await Promise.all(
    solFiles.map(
      async solFile => {
        const aSol = await fs.readFile(solFile)
        const aSolString = aSol.toString()

        const [{ sourceMap, opcodes, opcodesRaw }] = await getInternals(aSolString)

        await addNewPotentialOpcodes(opcodesRaw)

        console.log('opcodes', opcodes.split("\n").length)
        console.log('opcodes', opcodes.split("\n")[134])
        console.log('opcodes', opcodes.split("\n")[135])
        // console.log('sourceMap', sourceMap.toString())
      }
    )
  )
}

main()