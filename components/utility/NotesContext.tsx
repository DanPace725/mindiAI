import React, { createContext, useState } from "react"

interface NotesContextProps {
  selectedFileContent: string;
  setSelectedFileContent: React.Dispatch<React.SetStateAction<string>>;
  selectedFileId: string | null;
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>;
  markdownContent: string;
  setMarkdownContent: React.Dispatch<React.SetStateAction<string>>;
}

export const NotesContext = createContext<NotesContextProps>({
  selectedFileContent: "",
  setSelectedFileContent: () => {},
  selectedFileId: null,
  setSelectedFileId: () => {},
  markdownContent: '',
  setMarkdownContent: () => {}
});

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');

  return (
    <NotesContext.Provider
      value={{
        selectedFileContent,
        setSelectedFileContent,
        selectedFileId,
        setSelectedFileId,
        markdownContent,
        setMarkdownContent,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}
