const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:3001/api";

/**
 * Forums Service
 *
 * Handles all API calls related to forum messages
 */
export const forumsService = {
  /**
   * Delete a message from a forum (Admin only)
   *
   * @param messageId - ID of the message to delete
   * @returns Promise with success response
   * @throws Error if deletion fails
   */
  async deleteMessage(messageId: number): Promise<{
    success: boolean;
    message: string;
    data: {
      message_id: number;
      deleted_at: string;
    };
  }> {
    const response = await fetch(
      `${API_BASE_URL}/forums/messages/${messageId}`,
      {
        method: "DELETE",
        credentials: "include", // Include session cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle different error types
      if (errorData.error) {
        throw new Error(errorData.error.message || errorData.error);
      }

      throw new Error("Error al eliminar el mensaje");
    }

    return response.json();
  },
};
