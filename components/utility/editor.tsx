"use client"
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/react/style.css"

// Define an interface for the props of the Editor component
interface EditorProps {
  initialContent: string;
  onMarkdownChange: (markdown: string) => void;
}

export default function Editor({ initialContent, onMarkdownChange }: EditorProps) {
  const editor = useCreateBlockNote(
    {
      initialContent: initialContent 
        ? [{ type: "paragraph", content: initialContent }] 
        : undefined,
    }
  )

  const handleEditorChange = async () => {
    const markdown = await editor.blocksToMarkdownLossy(editor.document)
    onMarkdownChange(markdown)
  }

  return <BlockNoteView editor={editor} onChange={handleEditorChange} />
}
