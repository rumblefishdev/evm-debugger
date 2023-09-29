import { readFileSync, writeFileSync } from 'fs'

import { preparePayload } from './preparePayload'
import type { ConversionResult, OpcodeElement, Payload } from './types'
import { convertOpcodes } from './convertOpcodes'
import { converSourceMap } from './convertSourceMap'
import { Opcodes } from './opcodes'
import { convert } from './converter'

// eslint-disable-next-line import/newline-after-import
;(() => {
  const result = preparePayload()
  // const sourceMapOpcodes: { payload: string; opcode: number }[] = JSON.parse(
  //   readFileSync('./src/sourceMapConverter/opcodes_result2.json', 'utf8'),
  // )
  // const dissasembledOpcodes: { pc: string; opcode: number; operand: string | null }[] = JSON.parse(
  //   readFileSync('./src/sourceMapConverter/dissasembled_result.json', 'utf8'),
  // )

  // console.log('sourceMapOpcodes', sourceMapOpcodes.length)
  // console.log('dissasembledOpcodes', dissasembledOpcodes.length)

  // const comparedOpcodes = dissasembledOpcodes.map((item, index) => {
  //   const sourceMapOP = sourceMapOpcodes[index]
  //   return {
  //     sourceMapOp: sourceMapOP.opcode,
  //     pc: item.pc,
  //     isSame: sourceMapOP.opcode === item.opcode,
  //     dissasembledOp: item.opcode,
  //   }
  // })

  // const onlyNotSame = comparedOpcodes.filter((item) => !item.isSame)

  // writeFileSync('./src/sourceMapConverter/comparedOpcodes.json', JSON.stringify(comparedOpcodes, null, 2))
  // writeFileSync('./src/sourceMapConverter/onlyNotSame.json', JSON.stringify(onlyNotSame, null, 2))

  //   writeFileSync('./src/sourceMapConverter/convertedPayload.json', JSON.stringify(result, null, 2))
  // const convertedPayload: Payload = JSON.parse(readFileSync('./src/sourceMapConverter/convertedPayload.json', 'utf8'))
  // const resultOfConversion: Record<string, Record<string, ConversionResult[]>> = {}
  // Object.entries(convertedPayload).forEach(([address, payloadContent]) => {
  //   Object.entries(payloadContent.sources).forEach(([filePath, source]) => {
  //     if (source.opcodes && source.sourceMap) {
  //       console.log('filePath', filePath)
  //       writeFileSync(
  //         `./src/sourceMapConverter/opcodes_result2.json`,
  //         JSON.stringify(
  //           convertOpcodes(source.opcodes).map((item) => ({
  //             ...item,
  //             opcode: parseInt(item.opcode, 16),
  //           })),
  //           null,
  //           2,
  //         ),
  //       )
  //       resultOfConversion[address][filePath] = convert(converSourceMap(source.sourceMap), convertOpcodes(source.opcodes))
  //     }
  //   })
  // })
  // writeFileSync('./src/sourceMapConverter/resultOfConversion.json', JSON.stringify(resultOfConversion, null, 2))
})()
