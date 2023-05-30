import YDF from './sampleSourceCodes/YDF.json'
import UniswapV2 from './sampleSourceCodes/UniswapV2.json'
import { parseSourceCode } from './sourceCodeParser'

describe('Source code parser', () => {
  it.only('Parse json based string source code', () => {
    const result = parseSourceCode('YDF', YDF.result[0].SourceCode)
    expect(result).toMatchSnapshot()
  })

  it.only('Parse based string source code', () => {
    const result = parseSourceCode('UniswapV2', UniswapV2.result[0].SourceCode)
    expect(result).toMatchSnapshot()
  })
})
