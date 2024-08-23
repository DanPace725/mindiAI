"use client"

import { NotesComponent } from "@/components/ui/notesComponent"

export default function NotePage({ params }: { params: { noteid: string } }) {
  return <NotesComponent noteId={params.noteid} />
}