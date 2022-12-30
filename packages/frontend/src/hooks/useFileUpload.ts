import { useCallback, useState } from 'react'

export const useFileUploadHandler = () => {
  const [fileData, setFileData] = useState<string>('')
  const [isTooBig, setTooBigFlag] = useState<boolean>(false)

  const uploadFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader()

      const file = event.target.files?.[0]

      if (file) {
        fileReader.readAsText(file)
        fileReader.onload = (loadEvent) => {
          if (file.size > 1_000_000) {
            setFileData(loadEvent.target.result as string)
            setTooBigFlag(true)
            return
          }
          setFileData(loadEvent.target.result as string)
          setTooBigFlag(false)
        }
      }
    },
    [],
  )
  return [fileData, uploadFile, setFileData, isTooBig] as const
}
