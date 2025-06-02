"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getNoteById } from "@/db/notes"
import { Tables } from "@/supabase/types"
import { NotesComponent } from "@/components/ui/notesComponent" // Adjust path if needed
import { IconLoader2 } from "@tabler/icons-react" // Assuming Tabler icons

interface Note extends Tables<"notes"> {}

export default function EditNotePage() {
  const params = useParams()
  const noteId = params.noteid as string
  const workspaceId = params.workspaceid as string // Pass this to NotesComponent too

  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!noteId) {
      setError("Note ID is missing.")
      setLoading(false)
      return
    }

    const fetchNote = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedNote = await getNoteById(noteId)
        if (fetchedNote) {
          setNote(fetchedNote)
        } else {
          setError("Note not found.")
        }
      } catch (err: any) {
        console.error(`Failed to fetch note ${noteId}:`, err)
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [noteId])

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconLoader2 className="animate-spin text-muted-foreground" size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-destructive">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!note) {
    // This case should ideally be handled by the error state if note not found,
    // but as a fallback:
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Note not found.</p>
      </div>
    )
  }

  // Pass the fetched note data to NotesComponent
  // Assuming NotesComponent will accept these props:
  // noteId={note.id}
  // initialTitle={note.title}
  // initialContent={note.content}
  // workspaceId is also needed for context or if the note moves workspace (though less common for updates)
  return (
    <NotesComponent
      noteId={note.id}
      initialTitle={note.title}
      initialContent={note.content || ""} // Ensure content is not null, default to empty string
      workspaceId={workspaceId}
    />
  )
}