import { FileIcon } from "@/components/ui/file-icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FILE_DESCRIPTION_MAX, FILE_NAME_MAX } from "@/db/limits"
import { getFileFromStorage } from "@/db/storage/files"
import { Tables } from "@/supabase/types"
import { FC, useState, useContext } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { Button } from "@/components/ui/button"
import { NotesContext } from "@/components/utility/NotesContext"
import { fetchFileContent } from "@/components/utility/fetFileContent"
import { useRouter } from "next/navigation"

interface FileItemProps {
  file: Tables<"files">
}

export const FileItem: FC<FileItemProps> = ({ file }) => {
  const router = useRouter()
  const [name, setName] = useState(file.name)
  const [isTyping, setIsTyping] = useState(false)
  const [description, setDescription] = useState(file.description)
  const { setSelectedFileContent, setSelectedFileId, setMarkdownContent } = useContext(NotesContext) // Create a context to share state between components
  

  const handleOpenFile = async () => {
    console.log(`Opening file with ID: ${file.id}`)
    setSelectedFileId(file.id)
    try {
      const fileContent = await fetchFileContent(file.id)
      console.log(`File content fetched, length: ${fileContent.length}`)
      if (fileContent) {
        setMarkdownContent(fileContent)
        console.log("Markdown content set")
        router.push('/workspace/${file.workspace_id}/notes')
      } else {
        console.warn("No file content returned")
      }
    } catch (error) {
      console.error("Error opening file:", error)
    }
  }
  const getLinkAndView = async () => {
    const link = await getFileFromStorage(file.file_path)
    window.open(link, "_blank")
  }

  return (
    <SidebarItem
      item={file}
      isTyping={isTyping}
      contentType="files"
      icon={<FileIcon type={file.type} size={30} />}
      updateState={{ name, description }}
      renderInputs={() => (
        <>
          <div
            className="cursor-pointer underline hover:opacity-50"
            onClick={getLinkAndView}
          >
            View {file.name}
          </div>

          <div className="flex flex-col justify-between">
            <div>{file.type}</div>

            <div>{formatFileSize(file.size)}</div>

            <div>{file.tokens.toLocaleString()} tokens</div>
          </div>

          <div className="space-y-1">
            <Label>Name</Label>

            <Input
              placeholder="File name..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={FILE_NAME_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>Description</Label>

            <Input
              placeholder="File description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={FILE_DESCRIPTION_MAX}
            />
            <Button onClick={handleOpenFile}>Open</Button>
          </div>
        </>
      )}
    />
  )
}

export const formatFileSize = (sizeInBytes: number): string => {
  let size = sizeInBytes
  let unit = "bytes"

  if (size >= 1024) {
    size /= 1024
    unit = "KB"
  }

  if (size >= 1024) {
    size /= 1024
    unit = "MB"
  }

  if (size >= 1024) {
    size /= 1024
    unit = "GB"
  }

  return `${size.toFixed(2)} ${unit}`
}
