import { supabase } from "@/lib/supabase/browser-client"

export const fetchFileContent = async (fileId: string): Promise<string> => {
  try {
    console.log(`Fetching content for file ID: ${fileId}`)
    const { data: fileItems, error } = await supabase
      .from("file_items")
      .select("content")
      .eq("file_id", fileId)

    if (error) {
      console.error("Error fetching file content:", error)
      throw error
    }

    if (!fileItems || fileItems.length === 0) {
      console.warn(`No content found for file ID: ${fileId}`)
      return ""
    }

    console.log(`Found ${fileItems.length} file item(s) for file ID: ${fileId}`)
    return fileItems[0].content // Assuming one file item per file
  } catch (error) {
    console.error("Error in fetchFileContent:", error)
    throw error
  }
}