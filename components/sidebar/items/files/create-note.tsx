'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { useContext } from 'react'
import { ChatbotUIContext } from "@/context/context"

export const CreateNoteButton = () => {
  const router = useRouter()
  const { selectedWorkspace } = useContext(ChatbotUIContext)

  const handleCreateNote = () => {
    if (selectedWorkspace) {
      console.log("Creating new note...")  // Add this line for debugging
      router.push(`/${selectedWorkspace.id}/notes/new`)
    } else {
      console.error("No workspace selected")  // Add this line for error handling
    }
  }

  return (
    <Button className="flex h-[36px] grow" onClick={handleCreateNote}>
      <IconPlus className="mr-1" size={20} />
      New Note
    </Button>
  )
}