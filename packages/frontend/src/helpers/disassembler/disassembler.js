export class Disassembler {
  constructor() {
    this.initialized = false;
  }

  async _initialize() {
    if (!this.initialized) {
      console.log('Initializing python environment');
      this.pyodide = await loadPyodide({});
      await this.pyodide.loadPackage('micropip')
      const pip = this.pyodide.pyimport('micropip')
      await pip.install('pyevmasm')
      this.initialized = true;
    }
  }

  async disassemble(code) {
    await this._initialize();
    let trimmedCode = code.trim()
    if (trimmedCode.startsWith('0x'))
      trimmedCode = trimmedCode.slice(2)
    const textResult = await this.pyodide.runPythonAsync(`
      import pyevmasm, json, binascii
      res = pyevmasm.disassemble_all(binascii.unhexlify("${trimmedCode}"))
      json.dumps([{"pc":x.pc, "opcode":x.opcode, "operand":x.operand} for x in res])
    `);
    return JSON.parse(textResult);
  }
}
