import { actionChannel, take, call, put } from 'typed-redux-saga'

import { bytecodesActions, type BytecodesActions } from '../../bytecodes.slice'
import type { TOpcodeDisassemled } from '../../bytecodes.types'

async function initializePyodide() {
  console.log('Initializing python environment')
  // @ts-expect-error loadPyodide is included through global static <script> import. When have more time at hand consider importing typing and augumenting Global interface with it
  const pyodide = await loadPyodide({})
  await pyodide.loadPackage('micropip')
  const pip = pyodide.pyimport('micropip')
  await pip.install('pyevmasm')
  return pyodide
}

async function disassembleBytecode(pyodide, code: string) {
  let trimmedCode = code.trim()
  if (trimmedCode.startsWith('0x')) trimmedCode = trimmedCode.slice(2)

  const textResult = await pyodide.runPythonAsync(`
    import pyevmasm, json, binascii
    res = pyevmasm.disassemble_all(binascii.unhexlify("${trimmedCode}"))
    json.dumps([{
      "pc": hex(x.pc),
      "opcode": x.opcode,
      "operand": hex(x.operand) if x.operand is not None else None
    } for x in res])
  `)
  return JSON.parse(textResult) as TOpcodeDisassemled[]
}

export function* disassembleNewlyAddedBytescodes() {
  const channel = yield* actionChannel<BytecodesActions['updateBytecode']>(bytecodesActions.updateBytecode.type)
  let pyodide
  while (true) {
    const action = yield* take(channel)
    if (!pyodide) pyodide = yield* call(initializePyodide)

    const { id, changes } = action.payload
    if (!changes.bytecode) continue

    try {
      const disassembled = yield* call(disassembleBytecode, pyodide, changes.bytecode)
      yield* put(
        bytecodesActions.updateBytecode({
          id,
          changes: { disassembled },
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }
}
