import { create } from "zustand";
// zustand is used for global state management

const useChat = create((set) => ({
  selectedChat: null,
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
  onlineUserColorMap: {},
  setOnlineUserColorMap: (onlineUserColorMap) => set({ onlineUserColorMap }),
}));

export default useChat;
