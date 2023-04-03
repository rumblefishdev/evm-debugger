import * as nunjucks from "nunjucks"
import * as fsPromises from "fs/promises"

export const renderAsync = (templateName: string, options: Parameters<typeof nunjucks.render>[1]): Promise<string | null> => {
  return new Promise<string>(
    (resolve, reject) => {
      nunjucks.render(templateName, options, (err, renderedTemplate) => {
        if (err) {
          reject(err)
          return
        }

        resolve(renderedTemplate)
      })
    }
  )
}

export const renderAndSaveAsync = async (templateName: string, options: Parameters<typeof nunjucks.render>[1], destPath: string): Promise<void> => {
  const rendered = await renderAsync(
    templateName,
    options
  )

  await fsPromises.writeFile(destPath, rendered)
}