"use client"
"use client"
import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/browser-client"
import { useParams, useRouter } from "next/navigation" // Added useRouter
import Editor from "../utility/editor" // Assuming this path is correct
import { createNote, updateNote } from "@/db/notes" // Updated imports
import { toast } from "sonner"

interface NotesComponentProps {
  noteId?: string | null
  initialTitle?: string
  initialContent?: string
  workspaceId: string // Make workspaceId a required prop
}

export const NotesComponent: React.FC<NotesComponentProps> = ({
  noteId: propNoteId,
  initialTitle = "",
  initialContent = "",
  workspaceId
}) => {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    setCurrentNoteId(propNoteId || null)
    setTitle(initialTitle)
    setContent(initialContent)
  }, [propNoteId, initialTitle, initialContent])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("User not authenticated. Please log in.")
        setIsSaving(false)
        return
      }

      if (!title.trim()) {
        toast.error("Title cannot be empty.")
        setIsSaving(false)
        return
      }

      if (currentNoteId) {
        // Update existing note
        const updatedNote = await updateNote(currentNoteId, {
          title,
          content,
          // updated_at is handled by DB trigger
        })
        if (updatedNote) {
          toast.success("Note updated successfully!")
          setTitle(updatedNote.title) // Update state with potentially sanitized title from DB
          setContent(updatedNote.content || "")
        } else {
          toast.error("Failed to update note.")
        }
      } else {
        // Create new note
        const newNote = await createNote({
          user_id: user.id,
          workspace_id: workspaceId,
          title,
          content
        })
        if (newNote) {
          toast.success("Note created successfully!")
          setCurrentNoteId(newNote.id) // Set currentNoteId for subsequent saves
          setTitle(newNote.title)
          setContent(newNote.content || "")
          // Redirect to the new note's edit page
          router.replace(`/${locale}/${workspaceId}/notes/${newNote.id}`)
        } else {
          toast.error("Failed to create note.")
        }
      }
    } catch (error: any) {
      console.error("Failed to save note:", error)
      toast.error(`Failed to save note: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="dark:bg-secondary dark:text-foreground flex min-h-screen flex-col">
      <div className="py-8"></div> {/* Spacer */}
      <h1 className="mb-4 text-center text-2xl font-bold">
        {currentNoteId ? "Edit Note" : "Create New Note"}
      </h1>
      <div className="flex grow items-center justify-center px-2">
        <div className="border-muted bg-secondary relative flex min-h-[500px] w-full max-w-screen-lg flex-col sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg">
          <div className="bg-secondary px-4 py-2">
            <input
              type="text"
              placeholder="Enter title..."
              className="text-foreground w-full border-none bg-transparent text-lg font-bold outline-none"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="dark:bg-secondary flex-grow"> {/* Ensure this div can grow */}
            <Editor
              initialContent={content} // The Editor should ideally also take `content` and update internally via `key` or method if `initialContent` changes after first load
              onMarkdownChange={handleContentChange}
              // Consider making Editor controllable or re-initialize with a key prop if content needs to be reset from parent
              // key={currentNoteId || 'new'} // This would re-mount the editor when note changes
            />
          </div>
          <div className="flex justify-center py-2">
            <button
              className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded px-4 py-2 font-bold disabled:opacity-50"
              onClick={handleSaveNotes}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Note"}
            </button>
            {/* Removed old saveSuccess local message, relying on toast */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotesComponent