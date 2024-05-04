import React, { createContext, useState } from "react"

interface NotesContextProps {
<<<<<<< HEAD
  selectedFileContent: string;
  setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>;
  selectedFileId: string | null;
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>;
  markdownContent: string;
  setMarkdownContent: React.Dispatch<React.SetStateAction<string>>;
=======
  selectedFileContent: string
  setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>
  selectedFileId: string | null
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>
>>>>>>> 339573006258faab681bfa6e830e3997c97b2105
}

export const NotesContext = createContext<NotesContextProps>({
  selectedFileContent: "",
  setSelectedFileContent: () => {},
  selectedFileId: null,
<<<<<<< HEAD
  setSelectedFileId: () => {},
  markdownContent: '',
  setMarkdownContent: () => {}
});

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
=======
  setSelectedFileId: () => {}
})

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [selectedFileContent, setSelectedFileContent] = useState("")
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
>>>>>>> 339573006258faab681bfa6e830e3997c97b2105

  return (
    <NotesContext.Provider
      value={{
        selectedFileContent,
        setSelectedFileContent,
        selectedFileId,
<<<<<<< HEAD
        setSelectedFileId,
        markdownContent,
        setMarkdownContent,
=======
        setSelectedFileId
>>>>>>> 339573006258faab681bfa6e830e3997c97b2105
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}
