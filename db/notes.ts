export const getNoteById = async (noteId: string) => {
    // This is a placeholder. Replace with actual database query.
    return {
      id: noteId,
      title: "Sample Note",
      content: [
        {
          type: "paragraph",
          content: "This is a sample note."
        }
      ]
    }
  }