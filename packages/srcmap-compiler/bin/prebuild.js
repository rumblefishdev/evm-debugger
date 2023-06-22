
const solcVersion = process.argv.slice(2)

console.log(`Prebuild for solc: solcVersion`)

const fs = require('fs')
const filePath = './src/solc.ts'
const typeFilePath = './types/solc.d.ts'

const filesToDelete = [filePath, typeFilePath]

filesToDelete.forEach(file => {
    fs.unlink(file, () => {
        console.log(`Deleted file: ${file}`)
    })
})

const toReplace = '{{version}}'

const filesToCreate = ['./src/solc.template', './types/solc.d.template']
filesToCreate.forEach(file => {
    fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
        console.error(err);
        return;
        }
        const fileName = file.replace('template', 'ts')
        fs.writeFile(fileName, content.replace(toReplace, solcVersion), err => {
            if (err) {
            console.error(err);
            }
            console.log(`Created file ${fileName} for solc ${solcVersion}`)
        });
        
    })
})

