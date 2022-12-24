import { Disassembler } from './disassembler'

const SingletonDisassembler = (function(){
  let instance;

  function createDisassembler() {
    return new Disassembler();
  }

  return {
    getInstance(){
      if (!instance) {
        instance = createDisassembler();
        delete instance.constructor;
      }
      return instance;
    }
  };
})();

export async function disassembleBytecode(hexcode) {
  const disassembler = SingletonDisassembler.getInstance()
  return disassembler.disassemble(hexcode)
}