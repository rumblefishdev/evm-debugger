/* eslint-disable require-atomic-updates */
import * as fsPromises from 'node:fs/promises'
import * as fs from 'node:fs'

const OPCODES_FILE_PATH = './opcodes.json'

type OpcodesFileType = { opcodes: string[]; excluded: string[] }

const getOpcodeFile = async (): Promise<OpcodesFileType> => {
  if (!fs.existsSync(OPCODES_FILE_PATH))
    return {
      opcodes: [],
      excluded: [],
    }

  const opcodesBuff = await fsPromises.readFile(OPCODES_FILE_PATH)
  return JSON.parse(opcodesBuff.toString())
}

let lastOpcodeFile: OpcodesFileType | null = null

export const getLastOpcodeFile = async (): Promise<OpcodesFileType> => {
  if (lastOpcodeFile === null) lastOpcodeFile = await getOpcodeFile()

  return lastOpcodeFile
}

export const addNewPotentialOpcodes = async (opcodesRaw: string) => {
  const opcodesFile = await getOpcodeFile()

  const potentialOpcodes = opcodesRaw.split(' ')

  const opcodesSet: Set<string> = new Set(opcodesFile.opcodes)
  for (const potentialOpcode of potentialOpcodes)
    if (
      !potentialOpcode.startsWith('0x') &&
      potentialOpcode.length > 0 &&
      !opcodesFile.excluded.includes(potentialOpcode)
    )
      opcodesSet.add(potentialOpcode)

  await fsPromises.writeFile(
    OPCODES_FILE_PATH,
    JSON.stringify(
      {
        ...opcodesFile,
        opcodes: [...opcodesSet].sort(),
      },
      null,
      2,
    ),
  )
}
