import { create } from 'zustand';
import { api } from '../lib/axiosInstance'; // Assuming your axios instance is set up here
import { Chat, Message } from '../types';

// You'll need to define these types in your types.ts file
// Example:

interface ChatState {
  userChats: Chat[];
  currentChatMessages: Message[];
  isLoading: boolean;
  error: string | null;
  currentChatId: number | null; // To keep track of the chat currently being viewed

  fetchUserChats: () => Promise<void>;
  fetchMessages: (chatId: number) => Promise<void>;
  sendMessage: (chatId: number, messageContent: string) => Promise<void>;
  clearCurrentChat: () => void; // To clear messages when leaving a chat view
}

export const useChatStore = create<ChatState>((set, get) => ({
  userChats: [],
  currentChatMessages: [],
  isLoading: false,
  error: null,
  currentChatId: null,

  fetchUserChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Chat[]>('/chat');
      set({ userChats: response.data, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch user chats:', err);
      set({ error: 'Failed to fetch chats', isLoading: false });
    }
  },

  fetchMessages: async (chatId) => {
    set({ isLoading: true, error: null, currentChatId: chatId });
    try {
      const response = await api.get<Message[]>(`/chat/${chatId}/messages`);
      set({ currentChatMessages: response.data, isLoading: false });
    } catch (err) {
      console.error(`Failed to fetch messages for chat ${chatId}:`, err);
      set({ error: 'Failed to fetch messages', isLoading: false, currentChatId: null });
    }
  },

  sendMessage: async (chatId, messageContent) => {
    // Optionally set a sending state here if needed, but often handled locally in the chat component
    // set({ isLoading: true, error: null }); // Might not want to block other actions
    try {
      const response = await api.post<Message>(`/chat/${chatId}/messages`, {
        message: messageContent,
      });

      const newMessage = response.data;

      // Add the new message to the current chat messages if we are viewing this chat
      if (get().currentChatId === chatId) {
        set(state => ({
          currentChatMessages: [...state.currentChatMessages, newMessage],
          // isLoading: false, // If you set isLoading above
        }));
      }

      // Optionally update the last message/updated_at for the chat in the userChats list
      set(state => ({
          userChats: state.userChats.map(chat =>
              chat.id === chatId ? { ...chat, updated_at: newMessage.created_at /* or response timestamp */, last_message: newMessage.message } : chat
          )
      }));

    } catch (err) {
      console.error(`Failed to send message in chat ${chatId}:`, err);
      set({ error: 'Failed to send message' /*, isLoading: false */ });
      throw err; // Re-throw to allow component to handle error (e.g., show toast)
    }
  },

  clearCurrentChat: () => {
    set({ currentChatMessages: [], currentChatId: null });
  },
}));