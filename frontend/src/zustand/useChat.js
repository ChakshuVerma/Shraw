import { create } from "zustand";

const useChat = create((set) => ({
  selectedChat: null,
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  ctx: "",
  setCtx: (ctx) => set({ ctx }),
}));

export default useChat;
