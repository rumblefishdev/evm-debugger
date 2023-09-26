export type SolcOutput = Record<
  string,
  Record<
    string,
    {
      evm: {
        evm: {
          bytecode: {
            object: string
            opcodes: string
            sourceMap: string
          }
          deployedBytecode: {
            object: string
            opcodes: string
            sourceMap: string
          }
        }
      }
    }
  >
>

export type TSourceFile = {
  path: string
  content: string
}
