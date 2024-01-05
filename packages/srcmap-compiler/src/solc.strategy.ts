import type { TEtherscanParsedSourceCode } from '@evm-debuger/types'

import solc from './solc'
import type { SolcOutput, SolcManager } from './types'

const santizeSolcVersionToNumber = (solcVersion: string) => {
  // example solcVersion: v0.5.16+commit.9c3226ce
  const versionPart = solcVersion.split('+')[0] // v0.5.16

  if (versionPart[1] === '0') {
    return Number(versionPart.slice(3)) // 5.16
  }

  return Number(versionPart.slice(1)) // 0.5.16
}

// solc version is lower than 0.4.11
// input is not standard JSON settings object instead its plain solidity code
// second parameter is if you want to optimize the code or not
class SolcOldLegacy {
  public compile(input: TEtherscanParsedSourceCode): string {
    console.log('Running solc.compile on SolcOldLegacy')
    return solc.compile(
      JSON.stringify(input.sources[Object.keys(input.sources)[0]].content),
      input.settings.optimizer.enabled,
    )
  }
}

// solc version is higher than 0.4.11 and lower than 0.5.0
class SolcLegacy {
  public compile(input: TEtherscanParsedSourceCode): string {
    console.log('Running solc.compileStandard on SolcLegacy')
    return solc.compileStandard(JSON.stringify(input))
  }
}

// solc version is higher than 0.6.0
class SolcLatest {
  public compile(input: TEtherscanParsedSourceCode): string {
    console.log('Running solc.compile on SolcLatest')
    return solc.compile(JSON.stringify(input))
  }
}

export class SolcManagerStrategy {
  private solcManager: SolcManager
  constructor(solcVersion: string) {
    const version = santizeSolcVersionToNumber(solcVersion)

    console.log('santized version', version)

    console.log('is OldLegacy', version < 4.11)
    console.log('is Legacy', version < 5.0 && version >= 4.11)
    console.log('is Latest', version >= 5.0)

    switch (true) {
      case version < 4.11:
        this.solcManager = new SolcOldLegacy()
        break
      case version < 5.0 && version >= 4.11:
        this.solcManager = new SolcLegacy()
        break
      default:
        this.solcManager = new SolcLatest()
    }
  }

  public compile(input: TEtherscanParsedSourceCode): SolcOutput {
    const rawCompilationResult = this.solcManager.compile(input)
    console.log('rawCompilationResult', rawCompilationResult)
    return JSON.parse(rawCompilationResult)
  }
}
