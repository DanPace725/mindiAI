import { supabase } from "@/lib/supabase/browser-client"

export const fetchFileContent = async (fileId: string): Promise<string> => {
  try {
    const { data: fileItems, error } = await supabase
      .from("file_items")
      .select("content")
      .eq("file_id", fileId)

    if (error) {
      console.error("Error fetching file content:", error)
      return ""
    } else {
      const fileContent = fileItems.reduce(
        (acc, item) => acc + item.content,
        ""
      )
      return fileContent
    }
  } catch (error) {
    console.error("Error fetching file content:", error)
    return ""
  }
}
