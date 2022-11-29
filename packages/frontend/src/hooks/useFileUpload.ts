import { useCallback, useState } from 'react'

export const useFileUpload = () => {
    const [fileData, setFileData] = useState<string>('')
    const uploadHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader()
        if (event.target.files?.length) {
            fileReader.readAsText(event.target.files[0])
            fileReader.onload = (loadEvent) => {
                setFileData(loadEvent!.target!.result as string)
            }
        } else setFileData('')
    }, [])
    return [fileData, uploadHandler] as const
}
