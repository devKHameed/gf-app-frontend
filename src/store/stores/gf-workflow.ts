import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type RoleDraft = Partial<Omit<Role, "id">> & Pick<Role, "id">;
type DataFieldDraft = Partial<Omit<DataField, "id">> & Pick<DataField, "id">;
export type WorkflowDraft = Partial<
  Omit<GFWorkflow, "child_fields"> & {
    child_fields?: { fields?: Partial<DataField>[] };
  }
>;
type WorkflowStageDraft = Partial<GFWorkflowStage>;

type State = {
  workflowDraft: WorkflowDraft | null;
  workflowFieldDrafts: Partial<DataField>[];
  roleDraft: RoleDraft | null;
  stageDraft: WorkflowStageDraft | null;
};

type Actions = {
  setWorkflowDraft(workflow: WorkflowDraft | null): void;
  pushFieldDraft(fieldDraft: DataFieldDraft): void;
  popFieldDraft(): void;
  updateDataFieldDraft: (index: number, draft: Partial<DataField>) => void;
  emptyDataFieldDrafts(): void;
  mergeDataFieldDraftTail: (data: Partial<DataField>) => void;
  setWorkflowFields(fields: WorkflowDraft["child_fields"]): void;
  setRoleDraft(roleDraft: RoleDraft): void;
  setStageDraft(stageDraft: WorkflowStageDraft | null): void;
  updateStageDraft: (stageDraft: WorkflowStageDraft) => void;
};

const useWorkflowStoreBase = create<State & Actions>()(
  devtools(
    immer<State & Actions>((set) => ({
      roleDraft: null,
      workflowDraft: null,
      workflowFieldDrafts: [],
      stageDraft: null,
      setStageDraft(stageDraft) {
        set((state) => {
          state.stageDraft = stageDraft;
        });
      },
      updateStageDraft(stageDraft) {
        set((state) => {
          state.stageDraft = { ...(state.stageDraft || {}), ...stageDraft };
        });
      },
      setWorkflowFields(fields) {
        set((state) => {
          if (state.workflowDraft) {
            state.workflowDraft.child_fields = fields;
          }
        });
      },
      pushFieldDraft(fieldDraft) {
        set((state) => {
          state.workflowFieldDrafts.push(fieldDraft);
        });
      },
      popFieldDraft() {
        set((state) => {
          state.workflowFieldDrafts.pop();
        });
      },
      updateDataFieldDraft(index, fieldDraft) {
        set((state) => {
          state.workflowFieldDrafts[index] = fieldDraft;
        });
      },
      emptyDataFieldDrafts() {
        set((state) => {
          state.workflowFieldDrafts = [];
        });
      },
      mergeDataFieldDraftTail(data) {
        set((state) => {
          const dataFieldDraft = state.workflowFieldDrafts.pop();
          const mergeIntoField = state.workflowFieldDrafts.pop();
          if (dataFieldDraft && mergeIntoField) {
            if (mergeIntoField.fields) {
              const fieldIndex = mergeIntoField.fields.findIndex(
                (f) => f.id === dataFieldDraft.id
              );
              if (fieldIndex > -1) {
                mergeIntoField.fields[fieldIndex] = {
                  ...mergeIntoField.fields[fieldIndex],
                  ...dataFieldDraft,
                  ...data,
                };
              } else {
                mergeIntoField.fields.push({
                  ...dataFieldDraft,
                  ...data,
                } as DataField);
              }
            } else {
              mergeIntoField.fields = [
                { ...dataFieldDraft, ...data } as DataField,
              ];
            }
            state.workflowFieldDrafts.push(mergeIntoField);
          }
        });
      },
      setWorkflowDraft(workflow) {
        set((state) => {
          state.workflowDraft = workflow;
        });
      },
      setRoleDraft(draft) {
        set((state) => {
          state.roleDraft = draft;
        });
      },
    }))
  )
);

export const useWorkflowStore = createSelectorHooks(useWorkflowStoreBase);
