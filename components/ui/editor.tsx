"use client"
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/react/style.css"
import { useEffect } from "react"

// Define an interface for the props of the Editor component
interface EditorProps {
  onMarkdownChange: (markdown: string) => void
}

export default function Editor({ onMarkdownChange }: EditorProps) {
  const editor = useCreateBlockNote()

  const handleEditorChange = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document)
    onMarkdownChange(markdown)
  }

  return <BlockNoteView editor={editor} onChange={handleEditorChange} />
}
