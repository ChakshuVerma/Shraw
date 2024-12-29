import { create } from "zustand";
// zustand is used for global state management

const useChat = create((set) => ({
  selectedChat: null,
  setSelectedChat: (selectedChat) => set({ selectedChat }),
}));

export default useChat;
