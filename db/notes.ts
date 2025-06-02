import { supabase } from "@/lib/supabase/browser-client"
import { Tables, TablesInsert, TablesUpdate } from "@/supabase/types"

export const createNote = async (
  noteData: TablesInsert<"notes">
): Promise<Tables<"notes">> => {
  const { data: createdNote, error } = await supabase
    .from("notes")
    .insert(noteData)
    .select("*")
    .single()

  if (error) {
    console.error("Error creating note:", error)
    throw new Error(error.message)
  }
  if (!createdNote) {
    throw new Error("Failed to create note, no data returned.")
  }

  return createdNote
}

export const getNoteById = async (
  noteId: string
): Promise<Tables<"notes"> | null> => {
  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .maybeSingle() // Use maybeSingle to return null if not found, instead of erroring

  if (error) {
    console.error("Error fetching note by ID:", error)
    throw new Error(error.message)
  }

  return note
}

export const getNotesByWorkspaceId = async (
  workspaceId: string
): Promise<Tables<"notes">[]> => {
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false }) // Optional: order by creation date

  if (error) {
    console.error("Error fetching notes by workspace ID:", error)
    throw new Error(error.message)
  }

  return notes || [] // Return empty array if notes is null
}

export const updateNote = async (
  noteId: string,
  updates: TablesUpdate<"notes">
): Promise<Tables<"notes">> => {
  const { data: updatedNote, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", noteId)
    .select("*")
    .single()

  if (error) {
    console.error("Error updating note:", error)
    throw new Error(error.message)
  }
  if (!updatedNote) {
    throw new Error("Failed to update note, no data returned.")
  }

  return updatedNote
}

export const deleteNote = async (noteId: string): Promise<boolean> => {
  const { error } = await supabase.from("notes").delete().eq("id", noteId)

  if (error) {
    console.error("Error deleting note:", error)
    throw new Error(error.message)
  }

  return true
}