
const solcVersion = process.argv.slice(2)

console.log(`Prebuild for solc: solcVersion`)
const prefix = '../../srcmap-compiler'
const fs = require('node:fs')

const filePath = `${prefix}/src/solc.ts`
const typeFilePath = `${prefix}/types/solc.d.ts`

const filesToDelete = [filePath, typeFilePath]

filesToDelete.forEach(file => {
    fs.unlink(file, () => {
        console.log(`Deleted file: ${file}`)
    })
})

const toReplace = '{{version}}'

const filesToCreate = [`${prefix}/src/solc.template`, `${prefix}/types/solc.d.template`]
filesToCreate.forEach(file => {
    fs.readFile(file, 'utf8', (error, content) => {
        if (error) {
        console.error(error);
        return;
        }
        const fileName = file.replace('template', 'ts')
        fs.writeFile(fileName, content.replace(toReplace, solcVersion), error => {
            if (error) 
            console.error(error);
            
            console.log(`Created file ${fileName} for solc ${solcVersion}`)
        });
        
    })
})

