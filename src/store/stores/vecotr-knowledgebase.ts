import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { v4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  messages: VectorKnowledgebaseMessage[];
};

type Actions = {
  addMessage: (message: Partial<VectorKnowledgebaseMessage>) => void;
  updateMessage: (
    slug: string,
    message: Partial<VectorKnowledgebaseMessage>
  ) => void;
  setMessages: (messages: VectorKnowledgebaseMessage[]) => void;
};

const useVectorKnowledgebaseStoreBase = create(
  devtools(
    immer<State & Actions>((set) => ({
      messages: [],
      addMessage(message) {
        set((state) => {
          state.messages.push({
            id: message.id || v4(),
            slug: message.slug || v4(),
            data: message.data || "",
            sent_by: message.sent_by || "user",
            user_data: message.user_data,
            created_at: message.created_at || new Date().toISOString(),
            updated_at: message.updated_at || null,
            is_active: 1,
            is_deleted: 0,
          });
        });
      },
      updateMessage(slug, message) {
        set((state) => {
          state.messages = state.messages.map((m) => {
            if (m.slug === slug) {
              return {
                ...m,
                ...message,
              };
            }

            return m;
          });
        });
      },
      setMessages(messages) {
        set((state) => {
          state.messages = messages;
        });
      },
    }))
  )
);

export const useVectorKnowledgebaseStore = createSelectorHooks(
  useVectorKnowledgebaseStoreBase
);
