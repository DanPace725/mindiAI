"use client"
import React, { useState, useEffect, useContext } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { getProfileByUserId } from "@/db/profile"
import { saveNotesAsMarkdown } from "@/db/files"
import { getWorkspaceById } from "@/db/workspaces"
import dynamic from "next/dynamic"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { ChatbotUIContext } from "@/context/context"
import { useParams } from "next/navigation"
import { debounce } from "lodash"
import { NotesContext } from "@/components/utility/NotesContext"

const Editor = dynamic(() => import("../utility/editor"), { ssr: false })

export const NotesComponent: React.FC = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const params = useParams()
  const workspaceId = params.workspaceid as string
  const [embeddingsProvider, setEmbeddingsProvider] = useState<string>("")
  const { files, setFiles } = useContext(ChatbotUIContext)
  const {
    selectedFileContent,
    setSelectedFileContent,
    selectedFileId,
    setSelectedFileId,
    markdownContent,
    setMarkdownContent
  } = useContext(NotesContext)

 
  // Debounce function to save notes after 2 seconds of inactivity
  const saveNotes = debounce(async () => {
    try {
      localStorage.setItem("markdownContent", markdownContent)
      console.log("Saving notes:", markdownContent)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 5000)
    } catch (error) {
      console.error("Failed to save notes:", error)
    }
  }, 2000)
  
  const updateMarkdownContent = (newContent: string) => {
    setMarkdownContent(newContent)
  } 

  // Effect to trigger autosave whenever markdownContent changes
  useEffect(() => {saveNotes()
    // Cancel the debounce on component unmount
    return () => saveNotes.cancel()},[markdownContent, saveNotes])

    

  useEffect(() => {
    ;(async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        try {
          const profile = await getProfileByUserId(user.id)

          await fetchWorkspaceData(workspaceId)
        } catch (error: any) {
          console.error("Failed to fetch user profile:", error.message)
        }
      }
    })()
  }, [])

  const { setSelectedWorkspace } = React.useContext(ChatbotUIContext)

  const fetchWorkspaceData = async (workspaceId: string) => {
    try {
      const workspace = await getWorkspaceById(workspaceId)
      setSelectedWorkspace(workspace)
      setEmbeddingsProvider(workspace.embeddings_provider)
    } catch (error: any) {
      console.error("Failed to fetch workspace data:", error.message)
    }
  }

  const handleSaveNotes = async () => {
    try {
      if (selectedFileId) {
        // Update the file content in the database
        await supabase
          .from("file_items")
          .update({ content: markdownContent })
          .eq("file_id", selectedFileId)
      } else {
        const savedFile = await saveNotesAsMarkdown(
          title,
          markdownContent,
          userId,
          workspaceId,
          "local" as "openai" | "local"
        )
        setFiles([...files, savedFile])
      }
      setSaveSuccess(true) // Update state to indicate save success
      setTimeout(() => setSaveSuccess(false), 3000) // Reset the state after 3 seconds
    } catch (error) {
      console.error("Failed to save notes:", error)
    }
  }

  const handleMarkdownChange = (markdown: string) => {
    setMarkdownContent(markdown) // Update the markdownContent state with the new markdown
  }

  return (
    <div className="dark:bg-secondary dark:text-foreground flex min-h-screen flex-col">
      <div className="py-8"></div>
      <h1 className="mb-4 text-center text-2xl font-bold">Notes</h1>
      <div className="flex grow items-center justify-center px-2">
        <div className="border-muted bg-secondary relative flex min-h-[500px] w-full max-w-screen-lg flex-col sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg">
          <div className="bg-secondary px-4 py-2">
            <input
              type="text"
              placeholder="Enter title..."
              className="text-foreground w-full border-none bg-transparent text-lg font-bold outline-none"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="bg-secondary">
            <Editor 
            initialContent={markdownContent}
            onMarkdownChange={handleMarkdownChange} />
            <div className="flex justify-center py-2">
              <button
                className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded px-4 py-2 font-bold"
                onClick={handleSaveNotes}
              >
                Save
              </button>
              {saveSuccess && (
                <div className="alert alert-success text-foreground bg-accent absolute bottom-0 right-0 m-4 flex justify-center font-bold">
                  Saved
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotesComponent
