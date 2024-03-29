"use client"
import React, { useState } from "react"
import NotesComponent from "@/components/ui/notesComponent"
import { ToggleSwitch } from "@/components/utility/toggle-switch"

export default function NotesPage() {
  const [showNotes, setShowNotes] = useState(false)

  const handleToggle = (toggled: boolean) => {
    setShowNotes(toggled)
  }

  return (
    <>
      <div>
        <NotesComponent />
      </div>
    </>
  )
}
