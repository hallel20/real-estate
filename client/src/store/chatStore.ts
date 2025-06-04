import { create } from 'zustand';
import { api } from '../lib/axiosInstance'; // Assuming your axios instance is set up here
import { Chat, Message } from '../types';
import { useAuthStore } from "./authStore"; // Import useAuthStore to get current user ID

interface ChatState {
  userChats: Chat[];
  activeChatMessages: Message[];
  activeChatDetail: Chat | null; // Holds the details of the currently open chat
  isLoading: boolean;
  isLoadingMessages: boolean; // Specific loading state for messages
  error: string | null;
  activeChatId: number | null; // To keep track of the chat currently being viewed

  fetchUserChats: () => Promise<void>;
  setActiveChat: (chatId: number | null) => Promise<void>; // Combined open/close logic
  sendMessage: (chatId: number, messageContent: string) => Promise<void>;
  markChatAsReadAPI: (chatId: number) => Promise<void>; // Action to call the backend
  getChatById: (chatId: number) => Chat | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  userChats: [],
  activeChatMessages: [],
  activeChatDetail: null,
  isLoading: false,
  isLoadingMessages: false,
  error: null,
  activeChatId: null,

  fetchUserChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Chat[]>("/chat");
      set({ userChats: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch user chats:", err);
      set({ error: "Failed to fetch chats", isLoading: false });
    }
  },

  setActiveChat: async (chatId) => {
    if (chatId === null) {
      set({
        activeChatMessages: [],
        activeChatId: null,
        activeChatDetail: null,
        isLoadingMessages: false,
      });
      return;
    }

    const existingChat = get().userChats.find((chat) => chat.id === chatId);
    set({
      activeChatId: chatId,
      activeChatDetail: existingChat || null, // Set basic details immediately
      isLoadingMessages: true,
      error: null,
    });

    try {
      const response = await api.get<Message[]>(`/chat/${chatId}/messages`);
      set({ activeChatMessages: response.data, isLoadingMessages: false });

      // Mark chat as read on the client side for immediate feedback
      // Call the dedicated API to mark as read if conditions are met.
      const currentUserId = useAuthStore.getState().user?.id;
      if (
        existingChat &&
        !existingChat.is_read &&
        currentUserId &&
        String(existingChat.last_message_sender_id) !== String(currentUserId)
      ) {
        await get().markChatAsReadAPI(chatId);
      }
    } catch (err) {
      console.error(`Failed to fetch messages for chat ${chatId}:`, err);
      set({
        error: "Failed to fetch messages",
        isLoadingMessages: false,
        activeChatId:
          chatId /* Keep activeChatId to allow retry or show error in context */,
      });
    }
  },

  sendMessage: async (chatId, messageContent) => {
    // No global isLoading for sending, usually handled in component
    try {
      const response = await api.post<Message>(`/chat/${chatId}/messages`, {
        message: messageContent,
      });
      const newMessage = response.data;

      // Add the new message to the active chat messages if it's the one being viewed
      if (get().activeChatId === chatId) {
        set((state) => ({
          activeChatMessages: [...state.activeChatMessages, newMessage],
        }));
      }

      // Update the chat in the userChats list with new last message info and mark as unread for the other party
      set((state) => ({
        userChats: state.userChats
          .map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  updated_at: newMessage.created_at, // Use timestamp from new message
                  last_message_snippet:
                    newMessage.message.substring(0, 50) +
                    (newMessage.message.length > 50 ? "..." : ""), // Create a snippet
                  is_read: false, // New message means it's unread for the recipient
                  last_message_sender_id: newMessage.sender_id,
                }
              : chat
          )
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          ), // Re-sort by updated_at
        // Also update activeChatDetail if it's the current chat
        activeChatDetail:
          state.activeChatId === chatId && state.activeChatDetail
            ? {
                ...state.activeChatDetail,
                updated_at: newMessage.created_at,
                last_message_snippet:
                  newMessage.message.substring(0, 50) +
                  (newMessage.message.length > 50 ? "..." : ""),
                is_read: false, // This might be tricky, as the sender has "read" their own message.
                // is_read on the chat usually refers to the *other* party.
                last_message_sender_id: newMessage.sender_id,
              }
            : state.activeChatDetail,
      }));
    } catch (err) {
      console.error(`Failed to send message in chat ${chatId}:`, err);
      set({ error: "Failed to send message" /*, isLoading: false */ });
      throw err; // Re-throw to allow component to handle error (e.g., show toast)
    }
  },

  getChatById: (chatId: number) => {
    return get().userChats.find((chat) => chat.id === chatId);
  },

  markChatAsReadAPI: async (chatId: number) => {
    try {
      // Optimistically update the local state first for better UX
      set((state) => ({
        userChats: state.userChats.map((chat) =>
          Number(chat.id) === Number(chatId) ? { ...chat, is_read: true } : chat
        ),
        activeChatDetail:
          state.activeChatDetail && state.activeChatDetail.id === chatId
            ? { ...state.activeChatDetail, is_read: true }
            : state.activeChatDetail,
      }));
      await api.post(`/chat/${chatId}/read`);
    } catch (error) {
      console.error(`Failed to mark chat ${chatId} as read via API:`, error);
      // Optionally: Revert optimistic update if API call fails, or show an error toast
    }
  },
}));