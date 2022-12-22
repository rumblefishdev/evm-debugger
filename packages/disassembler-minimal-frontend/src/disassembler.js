export class Disassembler {
  constructor() {
    this.initialized = false;
  }

  // async _initialize() {
  //   if (!this.initialized) {
  //     console.log('Initializing python environment');
  //     this.pyodide = await loadPyodide({});
  //     await this.pyodide.loadPackage('micropip')
  //     const pip = this.pyodide.pyimport('micropip')
  //     await pip.install('pyevmasm')
  //     this.initialized = true;
  //   }
  // }

  // async disassemble(code) {
  //   await this._initialize();
  //   const textResult = await this.pyodide.runPythonAsync(`
  //     import pyevmasm, json, binascii
  //     res = pyevmasm.disassemble_all(binascii.unhexlify("${code}"))
  //     json.dumps([x.__dict__ for x in res])
  //   `);
  //   return JSON.parse(textResult);
  // }
}
