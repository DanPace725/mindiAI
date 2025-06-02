"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getNotesByWorkspaceId } from "@/db/notes"
import { Tables } from "@/supabase/types"
import { Button } from "@/components/ui/button"
import { IconLoader2, IconPlus } from "@tabler/icons-react" // Assuming Tabler icons are used, common in this project

interface Note extends Tables<"notes"> {}

export default function NotesPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const workspaceId = params.workspaceid as string

  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) return

    const fetchNotes = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedNotes = await getNotesByWorkspaceId(workspaceId)
        setNotes(fetchedNotes)
      } catch (err: any) {
        console.error("Failed to fetch notes:", err)
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [workspaceId])

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <IconLoader2 className="animate-spin text-muted-foreground" size={48} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
        <p className="text-destructive">Error loading notes: {error}</p>
        <Button onClick={() => router.refresh()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Notes</h1>
        <Link href={`/${locale}/${workspaceId}/notes/new`} passHref>
          <Button>
            <IconPlus size={20} className="mr-2" />
            Create New Note
          </Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
          <h2 className="mb-2 text-xl font-semibold text-card-foreground">No notes yet</h2>
          <p className="mb-4 text-muted-foreground">
            Get started by creating your first note.
          </p>
          <Link href={`/${locale}/${workspaceId}/notes/new`} passHref>
            <Button size="lg">
              <IconPlus size={24} className="mr-2" />
              Create New Note
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map(note => (
            <Link key={note.id} href={`/${locale}/${workspaceId}/notes/${note.id}`} passHref>
              <div className="block cursor-pointer rounded-lg border bg-card p-6 shadow-sm transition-shadow duration-150 hover:shadow-md">
                <h3 className="mb-2 truncate text-lg font-semibold text-card-foreground">{note.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(note.updated_at).toLocaleDateString()}
                </p>
                {/* Optionally, show a snippet of content here */}
                {/* <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{note.content ? (typeof note.content === 'string' ? note.content.substring(0,100) : 'Rich content') : 'No content'}</p> */}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
