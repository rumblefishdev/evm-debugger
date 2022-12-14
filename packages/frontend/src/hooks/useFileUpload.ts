import { useCallback, useState } from 'react'

export const useFileUploadHandler = () => {
  const [fileData, setFileData] = useState<string>('')
  const [isTooBig, setTooBigFlag] = useState<boolean>(false)

  const uploadFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    if (event.target.files?.length) {
      fileReader.readAsText(event.target.files[0])
      fileReader.onload = (loadEvent) => {
        if (event.target.files[0].size > 1_000_000) {
          setFileData(loadEvent!.target!.result as string)
          setTooBigFlag(true)
          return
        }
        setFileData(loadEvent!.target!.result as string)
        setTooBigFlag(false)
      }
    }
  }, [])
  return [fileData, uploadFile, setFileData, isTooBig] as const
}
