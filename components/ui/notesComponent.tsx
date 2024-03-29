"use client"
import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { getProfileByUserId } from "@/db/profile"
import { saveNotesAsMarkdown } from "@/db/files"
import { getWorkspaceById } from "@/db/workspaces"
import dynamic from "next/dynamic"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { ChatbotUIContext } from "@/context/context"
import { useParams } from "next/navigation"

const Editor = dynamic(() => import("./editor"), { ssr: false })

const NotesComponent: React.FC = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [markdownContent, setMarkdownContent] = useState("")
  const [userId, setUserId] = useState<string>("")
  const params = useParams()
  const workspaceId = params.workspaceid as string
  const [embeddingsProvider, setEmbeddingsProvider] = useState<string>("")

  useEffect(() => {
    ;(async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        try {
          const profile = await getProfileByUserId(user.id)
          console.log(profile)
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
    if (!workspaceId) {
      console.error("Workspace ID is not set. Cannot save notes.")
      return
    }
    try {
      await saveNotesAsMarkdown(
        title,
        markdownContent,
        userId,
        workspaceId,
        "local" as "openai" | "local"
      )
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error("Failed to save notes:", error)
      // Handle error (e.g., show an error message)
    }
  }

  const handleMarkdownChange = (markdown: string) => {
    setMarkdownContent(markdown) // Update the markdownContent state with the new markdown
  }

  return (
    <div className="dark:bg-surface dark:text-foreground flex min-h-screen flex-col">
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
          <Editor onMarkdownChange={handleMarkdownChange} />
        </div>
      </div>
      <div className="flex justify-center py-2">
        <button
          className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded px-4 py-2 font-bold"
          onClick={handleSaveNotes}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default NotesComponent
