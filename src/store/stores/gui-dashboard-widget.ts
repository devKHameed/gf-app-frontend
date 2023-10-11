import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { cloneDeep } from "lodash";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type GuiDashboardWidgetDraft = Partial<GuiDashboardWidget> & {
  pushUpdate?: boolean;
};
export type GuiDraft = Partial<GfGui> & { pushUpdate?: boolean };
export type WidgetActionDraft = Partial<WidgetAction> & {
  pushUpdate?: boolean;
};

type DataFieldDraft = Partial<Omit<DataField, "id">> & Pick<DataField, "id">;

type State = {
  guiDraft: GuiDraft | null;
  widgetDraft: GuiDashboardWidgetDraft | null;
  selectedTab: number | null;
  isWidgetEditorOpen: boolean;
  widgetData: Record<string, any>;
  selectedFilterTabs: Record<string, string>;
  actionButtonDraft: WidgetActionDraft | null;
  actionButtonFieldDrafts: Partial<DataField>[];
  populateFusionPayload: Record<string, unknown> | null;
  editModeEnabled: boolean;
};

type Actions = {
  setWidgetDraft(
    widget: GuiDashboardWidgetDraft | null,
    pushUpdate?: boolean
  ): void;
  updateWidgetDraft: (
    widget: GuiDashboardWidgetDraft,
    pushUpdate?: boolean
  ) => void;
  setGuiDraft(guiDraft: GuiDraft | null): void;
  updateGuiDraft: (guiDraft: GfGui, pushUpdate?: boolean) => void;
  setSelectedTab(selectedTab: number | null): void;
  addTabRow(tabIndex: number, row: DashboardTabRow, pushUpdate?: boolean): void;
  removeTabRow(tabIndex: number, rowId: string, pushUpdate?: boolean): void;
  updateTabRow(
    tabIndex: number,
    rowId: string,
    row: Partial<DashboardTabRow>,
    pushUpdate?: boolean
  ): void;
  setTabRows(
    tabIndex: number,
    tabRows: DashboardTabRow[],
    pushUpdate?: boolean
  ): void;
  openWidgetEditor(): void;
  closeWidgetEditor(): void;
  updateWidgetFilter(updates: WidgetFilterGroup): void;
  removeWidgetFilter(filterId: string): void;
  setWidgetData(
    widgetId: string,
    widgetData:
      | Record<string, any>
      | ((data: Record<string, any> | null) => Record<string, any>)
  ): void;
  setSelectedFilterTabs(widgetSlug: string, tab: string): void;
  setActionButtonDraft(draft: WidgetActionDraft | null): void;
  pushFieldDraft(fieldDraft: DataFieldDraft): void;
  popFieldDraft(): void;
  updateDataFieldDraft: (index: number, draft: Partial<DataField>) => void;
  emptyDataFieldDrafts(): void;
  mergeDataFieldDraftTail: (data: Partial<DataField>) => void;
  setActionButtonFields(fields: WidgetActionDraft["form_fields"]): void;
  setPopulateFusionPayload(payload: Record<string, unknown> | null): void;
  setEditModeEnabled(enabled: boolean): void;
};

const useGuiDashboardStoreBase = create<State & Actions>()(
  devtools(
    immer<State & Actions>((set) => ({
      widgetDraft: null,
      guiDraft: null,
      selectedTab: null,
      isWidgetEditorOpen: false,
      widgetData: {},
      selectedFilterTabs: {},
      actionButtonDraft: null,
      actionButtonFieldDrafts: [],
      populateFusionPayload: null,
      editModeEnabled: false,
      setEditModeEnabled(enabled) {
        set((state) => {
          state.editModeEnabled = enabled;
        });
      },
      setPopulateFusionPayload(payload) {
        set((state) => {
          state.populateFusionPayload = payload;
        });
      },
      setActionButtonDraft(draft) {
        set((state) => {
          state.actionButtonDraft = draft;
        });
      },
      setSelectedFilterTabs(widgetSlug, tab) {
        set((state) => {
          state.selectedFilterTabs[widgetSlug] = tab;
        });
      },
      setWidgetData(widgetId, widgetData) {
        set((state) => {
          if (typeof widgetData === "function") {
            state.widgetData[widgetId] = widgetData(state.widgetData[widgetId]);
          } else {
            state.widgetData[widgetId] = widgetData;
          }
        });
      },
      updateWidgetFilter(updates) {
        set((state) => {
          const index = state.widgetDraft?.filter_groups?.findIndex(
            (filter) => filter.id === updates.id
          );
          if (state.widgetDraft?.filter_groups) {
            if (index != null && index !== -1) {
              state.widgetDraft.filter_groups[index] = {
                ...state.widgetDraft.filter_groups[index],
                ...updates,
              };
            } else {
              state.widgetDraft.filter_groups.push(updates);
            }
          }
        });
      },
      removeWidgetFilter(id) {
        set((state) => {
          const index = state.widgetDraft?.filter_groups?.findIndex(
            (filter) => filter.id === id
          );
          if (
            state.widgetDraft?.filter_groups &&
            index != null &&
            index !== -1
          ) {
            state.widgetDraft.filter_groups.splice(index, 1);
          }
        });
      },
      openWidgetEditor() {
        set((state) => {
          state.isWidgetEditorOpen = true;
        });
      },
      closeWidgetEditor() {
        set((state) => {
          state.isWidgetEditorOpen = false;
        });
      },
      setSelectedTab(selectedTab) {
        set((state) => {
          state.selectedTab = selectedTab;
        });
      },
      setWidgetDraft(widget, pushUpdate = false) {
        set((state) => {
          state.widgetDraft = { ...widget, pushUpdate };
        });
      },
      updateWidgetDraft(widget, pushUpdate = false) {
        set((state) => {
          state.widgetDraft = {
            ...(state.widgetDraft || {}),
            ...widget,
            pushUpdate,
          };
        });
      },
      setGuiDraft(guiDraft) {
        set((state) => {
          state.guiDraft = guiDraft;
        });
      },
      updateGuiDraft(guiDraft, pushUpdate = false) {
        set((state) => {
          state.guiDraft = {
            ...(state.guiDraft || {}),
            ...guiDraft,
            pushUpdate,
          };
        });
      },
      addTabRow(tabIndex, row, pushUpdate = false) {
        set((state) => {
          if (state.guiDraft) {
            const rows =
              state.guiDraft.dashboard_list_settings?.tabs?.[tabIndex]
                ?.tab_rows || [];
            rows.push(row);
            state.guiDraft.pushUpdate = pushUpdate;
          }
        });
      },
      removeTabRow(tabIndex, rowId, pushUpdate = false) {
        set((state) => {
          if (state.guiDraft) {
            const rows =
              state.guiDraft.dashboard_list_settings?.tabs?.[tabIndex]
                ?.tab_rows || [];
            rows.splice(
              rows.findIndex((row) => row.row_id === rowId),
              1
            );
            state.guiDraft.pushUpdate = pushUpdate;
          }
        });
      },
      updateTabRow(tabIndex, rowId, row, pushUpdate = false) {
        set((state) => {
          if (state.guiDraft) {
            const rows =
              state.guiDraft.dashboard_list_settings?.tabs?.[tabIndex]
                ?.tab_rows || [];
            const rowIndex = rows.findIndex((row) => row.row_id === rowId);
            if (rowIndex !== -1) {
              rows.splice(rowIndex, 1, { ...rows[rowIndex], ...row });
            }

            state.guiDraft.pushUpdate = pushUpdate;
          }
        });
      },
      setTabRows(tabIndex, tabRows, pushUpdate = false) {
        set((state) => {
          if (state.guiDraft) {
            const tab =
              state.guiDraft.dashboard_list_settings?.tabs?.[tabIndex];
            if (tab) {
              tab.tab_rows = tabRows;
              state.guiDraft.pushUpdate = pushUpdate;
            }
          }
        });
      },
      setActionButtonFields(fields) {
        set((state) => {
          const draft = cloneDeep(state.actionButtonDraft) || {};
          draft.form_fields = fields;
          return { actionButtonDraft: draft };
        });
      },
      pushFieldDraft(fieldDraft) {
        set((state) => {
          const actionButtonFieldDrafts =
            cloneDeep(state.actionButtonFieldDrafts) || [];
          actionButtonFieldDrafts.push(fieldDraft);
          return { actionButtonFieldDrafts };
        });
      },
      popFieldDraft() {
        set((state) => {
          const actionButtonFieldDrafts =
            cloneDeep(state.actionButtonFieldDrafts) || [];
          actionButtonFieldDrafts.pop();
          return { actionButtonFieldDrafts };
        });
      },
      updateDataFieldDraft(index, fieldDraft) {
        set((state) => {
          const actionButtonFieldDrafts =
            cloneDeep(state.actionButtonFieldDrafts) || [];
          actionButtonFieldDrafts[index] = fieldDraft;

          return { actionButtonFieldDrafts };
        });
      },
      emptyDataFieldDrafts() {
        set((state) => {
          return { actionButtonFieldDrafts: [] };
        });
      },
      mergeDataFieldDraftTail: (data) => {
        set((state) => {
          const actionButtonFieldDrafts =
            cloneDeep(state.actionButtonFieldDrafts) || [];
          const dataFieldDraft = actionButtonFieldDrafts.pop();
          const mergeIntoField = actionButtonFieldDrafts.pop();
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

            actionButtonFieldDrafts.push(mergeIntoField);

            return { actionButtonFieldDrafts };
          }

          return {};
        });
      },
    }))
  )
);

export const useGuiDashboardStore = createSelectorHooks(
  useGuiDashboardStoreBase
);
