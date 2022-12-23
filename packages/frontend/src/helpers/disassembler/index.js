import { Disassembler } from './disassembler'

const SingletonDisassembler = (function(){
  let instance;

  function createDisassembler() {
    const disassembler = new Disassembler();
    return disassembler;
  }

  return {
    getInstance: function(){
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
  return await disassembler.disassemble(hexcode)
}