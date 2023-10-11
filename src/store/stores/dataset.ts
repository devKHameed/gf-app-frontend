import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { current } from "immer";
import cloneDeep from "lodash/cloneDeep";
import isArray from "lodash/isArray";
import last from "lodash/last";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type DataFieldDraft = Partial<Omit<DataField, "id">> & Pick<DataField, "id">;
export type DatasetDraft = {
  field?: string;
  data: Record<string, unknown>;
  fields?: DataField[];
};

type State = {
  datacardDesignDraft: Partial<DatacardDesign> | null;
  dataFieldDrafts: DataFieldDraft[];
  datasetDrafts: DatasetDraft[];
  datasetDraft: { pushUpdate: boolean; draft: Partial<Dataset> | null };
};

type Actions = {
  setDatacardDesignDraft: (
    datacardDesignDraft: Partial<DatacardDesign> | null
  ) => void;
  pushDataFieldDraft: (dataFieldDraft: DataFieldDraft) => void;
  setDataFieldDrafts: (drafts: DataFieldDraft[]) => void;
  popDataFieldDraft: () => void;
  emptyDataFieldDrafts: () => void;
  updateDataFieldDraft: (index: number, draft: DataFieldDraft) => void;
  mergeDataFieldDraftTail: (data: Omit<DataField, "id">) => void;
  pushDatasetDraft: (
    dataFieldDraft: DatasetDraft,
    pushUpdates?: boolean
  ) => void;
  popDatasetDraft: () => void;
  deleteDatasetDraftAtIndex: (index: number, field: string) => void;
  emptyDatasetDrafts: () => void;
  setDatasetDrafts: (drafts: DatasetDraft[]) => void;
  updateDatasetDraft: (field: string, draftData: DatasetDraft["data"]) => void;
  mergeDatasetDraftTail: (data?: Record<string, unknown>) => void;
};

const createDatasetDraft = (drafts: DatasetDraft[]): Partial<Dataset> => {
  const datasetDrafts = cloneDeep(drafts).reverse();
  return datasetDrafts.reduce((acc, draft, index, arr) => {
    const nextDraft = arr[index + 1];
    if (!nextDraft || !draft.field) {
      return acc;
    }

    const nextIsLast = index + 1 === arr.length - 1;

    const fieldName = getFieldFromPath(draft.field) as keyof DatasetDraft;
    const fieldData = (
      nextIsLast ? nextDraft.data.fields : nextDraft.data
    ) as Record<string, unknown>;
    const data = fieldData[fieldName];
    if (isArray(data)) {
      const dataIndex = data.findIndex((d) => d._id === acc._id);
      if (dataIndex === -1) {
        if (nextIsLast) {
          acc = {
            ...nextDraft.data,
            fields: {
              ...(nextDraft.data.fields as Record<string, unknown>),
              [fieldName]: [acc, ...data],
            },
          };
        } else {
          acc = {
            ...fieldData,
            [fieldName]: [acc, ...data],
          };
        }
      } else {
        if (nextIsLast) {
          acc = {
            ...nextDraft.data,
            fields: {
              ...(nextDraft.data.fields as Record<string, unknown>),
              [fieldName]: data.map((d) =>
                d._id === acc._id ? { ...d, ...acc } : d
              ),
            },
          };
        } else {
          acc = {
            ...fieldData,
            [fieldName]: data.map((d) =>
              d._id === acc._id ? { ...d, ...acc } : d
            ),
          };
        }
      }
    }

    return acc;
  }, datasetDrafts[0]?.data || null) as Partial<Dataset>;
};

const getFieldFromPath = (path?: string) =>
  last(path?.split(/\.|\[|\]/).filter(Boolean));

const useDatasetStoreBase = create(
  devtools(
    immer<State & Actions>((set) => ({
      datacardDesignDraft: null,
      dataFieldDrafts: [],
      datasetDrafts: [],
      datasetDraft: { pushUpdate: false, draft: null },
      setDatacardDesignDraft: (
        datacardDesignDraft: Partial<DatacardDesign> | null
      ) => {
        set((state) => {
          state.datacardDesignDraft = datacardDesignDraft;
        });
      },
      pushDataFieldDraft: (dataFieldDraft: DataFieldDraft) => {
        set((state) => {
          state.dataFieldDrafts.push(dataFieldDraft);
        });
      },
      setDataFieldDrafts: (drafts: DataFieldDraft[]) => {
        set((state) => {
          state.dataFieldDrafts = drafts;
        });
      },
      popDataFieldDraft: () => {
        set((state) => {
          state.dataFieldDrafts.pop();
        });
      },
      emptyDataFieldDrafts: () => {
        set((state) => {
          state.dataFieldDrafts = [];
        });
      },
      updateDataFieldDraft: (index, draft) => {
        set((state) => {
          state.dataFieldDrafts[index] = draft;
        });
      },
      mergeDataFieldDraftTail: (data) => {
        set((state) => {
          const dataFieldDraft = state.dataFieldDrafts.pop();
          const mergeIntoField = state.dataFieldDrafts.pop();
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
                mergeIntoField.fields.push({ ...dataFieldDraft, ...data });
              }
            } else {
              mergeIntoField.fields = [{ ...dataFieldDraft, ...data }];
            }

            state.dataFieldDrafts.push(mergeIntoField);
          }
        });
      },
      pushDatasetDraft: (datasetDraft, pushUpdate) => {
        set((state) => {
          if (datasetDraft.fields) {
            state.datasetDrafts.push(datasetDraft);
          } else {
            const lastDraft = last(state.datasetDrafts);
            const fieldName = getFieldFromPath(datasetDraft.field);
            if (lastDraft && fieldName) {
              state.datasetDrafts.push({
                ...datasetDraft,
                fields: lastDraft.fields?.find((f) => f.slug === fieldName)
                  ?.fields,
              });
            }
          }
          state.datasetDraft.pushUpdate = pushUpdate ?? true;
          state.datasetDraft.draft = createDatasetDraft(
            current(state.datasetDrafts)
          );
        });
      },
      popDatasetDraft: () => {
        set((state) => {
          state.datasetDraft.pushUpdate = false;
          state.datasetDrafts.pop();
        });
      },
      deleteDatasetDraftAtIndex: (index, field) => {
        set((state) => {
          const lastDraft = state.datasetDrafts[state.datasetDrafts.length - 1];
          const data = lastDraft.field
            ? lastDraft.data[`${getFieldFromPath(field)}`]
            : (lastDraft.data as any).fields[`${getFieldFromPath(field)}`];
          if (data && isArray(data)) {
            data.splice(index, 1);
          }
          state.datasetDraft.pushUpdate = true;
          state.datasetDraft.draft = createDatasetDraft(
            current(state.datasetDrafts)
          );
        });
      },
      emptyDatasetDrafts: () => {
        set((state) => {
          state.datasetDrafts = [];
          state.datasetDraft.pushUpdate = false;
          state.datasetDraft.draft = null;
        });
      },
      setDatasetDrafts: (drafts) => {
        set((state) => {
          state.datasetDrafts = drafts;
          state.datasetDraft.pushUpdate = false;
          state.datasetDraft.draft = createDatasetDraft(drafts);
        });
      },
      updateDatasetDraft: (field, data) => {
        set((state) => {
          const index = state.datasetDrafts.findIndex((d) => d.field === field);
          if (index > -1) {
            state.datasetDrafts[index].data = data;
          }
          state.datasetDraft.pushUpdate = true;
          state.datasetDraft.draft = createDatasetDraft(
            current(state.datasetDrafts)
          );
        });
      },
      mergeDatasetDraftTail: (data) => {
        set((state) => {
          const datasetDraft = state.datasetDrafts.pop();
          const mergeIntoDraft = state.datasetDrafts.pop();
          if (mergeIntoDraft && datasetDraft) {
            const fieldName = getFieldFromPath(datasetDraft.field);
            if (fieldName) {
              let draftData = mergeIntoDraft.field
                ? mergeIntoDraft.data[`${fieldName}`]
                : (mergeIntoDraft.data?.fields as Record<string, unknown>)?.[
                    `${fieldName}`
                  ];
              if (!draftData) {
                if (mergeIntoDraft.field) {
                  mergeIntoDraft.data[`${fieldName}`] = [
                    { ...datasetDraft.data, ...data },
                  ];
                } else {
                  (mergeIntoDraft.data.fields as Record<string, unknown>)[
                    `${fieldName}`
                  ] = [{ ...datasetDraft.data, ...data }];
                }
              } else if (isArray(draftData)) {
                const dData = (
                  (mergeIntoDraft.field
                    ? mergeIntoDraft.data[`${fieldName}`]
                    : (
                        mergeIntoDraft.data?.fields as Record<string, unknown>
                      )?.[`${fieldName}`]) as any[]
                ).findIndex((d) => d._id === datasetDraft.data._id);
                if (dData > -1) {
                  if (mergeIntoDraft.field) {
                    mergeIntoDraft.data[`${fieldName}`] = draftData.map((d) =>
                      d._id === datasetDraft.data._id
                        ? { ...d, ...datasetDraft.data, ...data }
                        : d
                    );
                  } else {
                    (mergeIntoDraft as any).data.fields[`${fieldName}`] =
                      draftData.map((d) =>
                        d._id === datasetDraft.data._id
                          ? { ...d, ...datasetDraft.data, ...data }
                          : d
                      );
                  }
                } else {
                  draftData.unshift({ ...datasetDraft.data, ...data });
                }
              }
            }
          }
          if (mergeIntoDraft) {
            state.datasetDrafts.push(mergeIntoDraft);
            state.datasetDraft.pushUpdate = true;
            state.datasetDraft.draft = createDatasetDraft(
              current(state.datasetDrafts)
            );
          }
        });
      },
    }))
  )
);

export const useDatasetStore = createSelectorHooks(useDatasetStoreBase);
