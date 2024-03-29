import React, { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const MyEditor = () => {
  const [menuVisible, setMenuVisible] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing here...</p>", // Set initial content here
    onUpdate: ({ editor }) => {
      const { state } = editor
      const { selection } = state
      const { $from } = selection
      const textBefore = editor.state.doc.textBetween(
        $from.pos - 1,
        $from.pos,
        "\n",
        "\n"
      )

      setMenuVisible(textBefore.endsWith("/"))
    }
  })

  if (!editor) {
    return null
  }

  type Level = 1 | 2 | 3 | 4 | 5 | 6
  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run()
  const toggleHeading = (level: Level) =>
    editor.chain().focus().toggleHeading({ level }).run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()

  const applyStyle = (style: string) => {
    const { state, view } = editor
    const { selection } = state
    const { $from } = selection
    const slashPos = $from.pos - 1

    // Remove the slash character
    view.dispatch(state.tr.delete(slashPos, $from.pos))

    switch (style) {
      case "bold":
        toggleBold()
        break
      case "italic":
        toggleItalic()
        break
      case "underline":
        toggleUnderline()
        break
      case "heading1":
        toggleHeading(1)
        break
      case "heading2":
        toggleHeading(2)
        break
      case "heading3":
        toggleHeading(3)
        break
      case "bulletList":
        toggleBulletList()
        break
      case "orderedList":
        toggleOrderedList()
        break
      case "blockquote":
        toggleBlockquote()
        break
      case "codeBlock":
        toggleCodeBlock()
        break
      default:
        break
    }
    setMenuVisible(false)
  }
  return (
    <div id="editor" className="text-card-foreground bg-card flex-1">
      <EditorContent editor={editor} className="h-full p-4" />
      {menuVisible && (
        <div
          id="slash-menu"
          className="bg-popover text-popover-foreground absolute rounded-lg p-2 shadow-lg"
        >
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("bold")}
          >
            Bold
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("italic")}
          >
            Italic
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("underline")}
          >
            Underline
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("heading1")}
          >
            Heading 1
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("heading2")}
          >
            Heading 2
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("heading3")}
          >
            Heading 3
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("bulletList")}
          >
            Bullet List
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("orderedList")}
          >
            Ordered List
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("blockquote")}
          >
            Blockquote
          </button>
          <button
            className="hover:bg-muted block p-1"
            onClick={() => applyStyle("codeBlock")}
          >
            Code Block
          </button>
        </div>
      )}
    </div>
  )
}

export default MyEditor
