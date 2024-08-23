"use client"
import { useEffect } from "react"
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/react/style.css"

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export default function Editor({ content, onContentChange }: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: content
      ? [{ type: "paragraph", content: content }]
      : undefined,
  });

  useEffect(() => {
    const handleEditorChange = async () => {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      onContentChange(markdown);
    };

    editor.onEditorContentChange(handleEditorChange);

    return () => {
      editor.onEditorContentChange(handleEditorChange);
    };
  }, [editor, onContentChange]);

  return <BlockNoteView editor={editor} />;
}