"use client"
import React, { useState, useContext } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { ChatbotUIContext } from "@/context/context"
import { useParams } from "next/navigation"
import Editor from "../utility/editor"
import { saveNotesAsMarkdown } from "@/db/files"
import { toast } from "sonner"

export const NotesComponent: React.FC = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const params = useParams()
  const workspaceId = params.workspaceid as string
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSaveNotes = async () => {
    if (!selectedWorkspace) {
      console.error("Workspace not available")
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("User not authenticated")
        return
      }

      // Use saveNotesAsMarkdown function
      const savedFile = await saveNotesAsMarkdown(
        title,
        content,
        user.id,
        workspaceId,
        "openai" // or "local", depending on your default embedding provider
      )

      if (savedFile) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
        toast.success("Notes saved successfully")
      } else {
        toast.error("Failed to save notes")
      }
    } catch (error) {
      console.error("Failed to save notes:", error)
      toast.error("Failed to save notes")
    }
  }

  // ... rest of the component remains the same

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
          <div className="dark:bg-secondary">
            <Editor 
              initialContent={content}
              onMarkdownChange={handleContentChange}
            />
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