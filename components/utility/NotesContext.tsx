import React, { createContext, useState } from "react"

interface NotesContextProps {
  selectedFileContent: string
  setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>
  selectedFileId: string | null
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>
}

export const NotesContext = createContext<NotesContextProps>({
  selectedFileContent: "",
  setSelectedFileContent: () => {},
  selectedFileId: null,
  setSelectedFileId: () => {}
})

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [selectedFileContent, setSelectedFileContent] = useState("")
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

  return (
    <NotesContext.Provider
      value={{
        selectedFileContent,
        setSelectedFileContent,
        selectedFileId,
        setSelectedFileId
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}
