import { create } from 'zustand';

const useCommandStore = create((set) => ({
  inputText: '',
  setInputText: (text) => set({ inputText: text }),
  appendInputText: (text) => set((state) => ({ 
    inputText: state.inputText + (state.inputText && !state.inputText.endsWith(' ') ? ' ' : '') + text + ' ' 
  })),
}));

export default useCommandStore;
