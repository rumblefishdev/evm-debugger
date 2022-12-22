import { Disassembler } from './disassembler'


// document.getElementById('form').addEventListener('submit', (ev) => {
//   ev.preventDefault();
//   const hexcode = document.getElementById('code').value;
//   disassembler.disassemble(hexcode).then((result) => {
  //     document.getElementById('result').textContent = JSON.stringify(result, null, 2);
  //   });
  // })
  
  export async function disassembleBytecode(hexcode) {
    const disassembler = new Disassembler()
    let tst = 'xD'
  // try{
  //     result = await disassembler.disasseble(hexcode)
  // } catch(error) {
  //     console.log('error disassembler', error)
  //     return ''
  // } finally {
  //     tst = JSON.stringify(result, null,2)
  // }
  disassembler.disassemble(hexcode).then((result) => {
      tst = JSON.stringify(result, null, 2);
      console.log('error NO', tst.length)
      return tst
    })
    .catch(error => {

        console.log('error', error)
        return ':<' 
    })
}