import AddAssociatedField, {
  AddAssociatedFieldFormType,
} from "components/AddAssociatedField";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
  TransitionComponent,
} from "layouts/AnimationLayout";
import last from "lodash/last";
import pick from "lodash/pick";
import useCreateItem from "queries/useCreateItem";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import useUpdateItem from "queries/useUpdateItem";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDatasetStore } from "store/stores/dataset";
import { getSearchParams } from "utils";
import { v4 } from "uuid";
import DataCardDesignEditor, {
  AddDatacardDesignFieldFormType,
} from "./DataCardDesignEditor";
import DatasetDesignSettingsEditor from "./DatasetDesignSettingsEditor";
import DatasetDesignSidebar from "./DatasetDesignSidebar";

const DatasetDesignSetting = ({
  disableScrollbar,
}: {
  disableScrollbar?: boolean;
}) => {
  const { slug: datasetDesignSlug = "" } =
    useParams<{ slug?: string; datasetSlug?: string }>();

  const setDatacardDesignDraft = useDatasetStore.useSetDatacardDesignDraft();
  const datacardDesignDraft = useDatasetStore.useDatacardDesignDraft();

  const dataFieldDrafts = useDatasetStore.useDataFieldDrafts();
  const pushDataFieldDraft = useDatasetStore.usePushDataFieldDraft();
  const setDataFieldDrafts = useDatasetStore.useSetDataFieldDrafts();
  const popDataFieldDraft = useDatasetStore.usePopDataFieldDraft();
  const emptyDataFieldDrafts = useDatasetStore.useEmptyDataFieldDrafts();
  const updateDataFieldDraft = useDatasetStore.useUpdateDataFieldDraft();
  const mergeDataFieldDraftTail = useDatasetStore.useMergeDataFieldDraftTail();

  const rightSidebarRef = useRef<AnimationLayoutRef>(null);

  const { data: datacardDesigns } = useListItems({
    modelName: "datacard-design",
    requestOptions: {
      path: `datasets:${datasetDesignSlug}`,
    },
    queryOptions: { enabled: !!datasetDesignSlug },
  });
  const { data: datasetDesign } = useGetItem({
    modelName: "dataset-design",
    slug: datasetDesignSlug,
  });

  const { mutate: updateDatasetDesign } = useUpdateItem({
    modelName: "dataset-design",
    mutationOptions: {
      mutationKey: ["dataset-design"],
    },
  });
  const { mutate: createDatacardDesign } = useCreateItem({
    modelName: "datacard-design",
    mutationOptions: {
      mutationKey: ["datacard-design"],
    },
  });
  const { mutate: updateDatacardDesign } = useUpdateItem({
    modelName: "datacard-design",
    requestOptions: {
      path: `datasets:${datasetDesignSlug}`,
    },
    mutationOptions: {
      mutationKey: ["datacard-design"],
    },
  });

  useLayoutEffect(() => {
    if (!!datacardDesigns?.length && rightSidebarRef.current) {
      const s = getSearchParams().get("s");
      const sName = getSearchParams().get("s_name");
      const transitionHistory: TransitionComponent[] = [
        { name: "main", id: "main" },
      ];

      if (s === "dataset-settings") {
        transitionHistory.push({
          name: "dataset-settings",
          id: "dataset-settings",
        });
      } else if (s === "add-datacard-design") {
        transitionHistory.push({
          name: "dataset-card-editor",
          id: "add-datacard-design",
        });
      } else if (s === "add-field") {
        transitionHistory.push({
          name: "add-field",
          id: "add-field",
        });
        setDataFieldDrafts([{ id: v4() }]);
      } else if (sName === "add-field-datacard-design") {
        const [design, field] = s?.split(".") || [];
        const cardDesign = datacardDesigns.find((d) => d.slug === design);
        if (!field && cardDesign) {
          transitionHistory.push(
            {
              name: "dataset-card-editor",
              id: cardDesign.slug,
            },
            {
              name: "add-field-datacard-design",
              id: cardDesign.slug,
            }
          );
          setDatacardDesignDraft(cardDesign);
          setDataFieldDrafts([{ id: v4() }]);
        } else if (cardDesign) {
          const { transitionHistory: tHistory, fieldDrafts } =
            getAsscDatacardFieldTransitionHistory(
              field,
              cardDesign.associated_fields.fields || [],
              cardDesign.slug
            );
          transitionHistory.push(
            {
              name: "dataset-card-editor",
              id: cardDesign.slug,
            },
            ...tHistory
          );
          setDatacardDesignDraft(cardDesign);
          setDataFieldDrafts(fieldDrafts);
        }
      } else if (sName === "add-field") {
        const { transitionHistory: tHistory, dataFieldDrafts: dfDrafts } =
          getAsscFieldTransitionHistory(s, datasetDesign?.fields.fields || []);
        transitionHistory.push(...tHistory);
        setDataFieldDrafts(dfDrafts);
      } else if (sName === "dataset-card-editor") {
        const { transitionHistory: tHistory, datacardDesignDraft: dcDraft } =
          getTransitionHistory(s, datacardDesigns);
        transitionHistory.push(...tHistory);
        setDatacardDesignDraft(dcDraft);
      }

      console.log(
        "🚀 ~ file: DatasetDesignSetting.tsx:153 ~ useLayoutEffect ~ transitionHistory:",
        transitionHistory
      );
      rightSidebarRef.current.setTransitionHistory(transitionHistory);
      // rightSidebarRef.current.gotoComponent(
      //   transitionHistory[transitionHistory.length - 1],
      //   false
      // );
    }
  }, [datacardDesigns, datasetDesign]);

  const getAsscFieldTransitionHistory = (
    comp: string | null,
    fields: DataField[]
  ) => {
    if (!comp) {
      return { transitionHistory: [], dataFieldDrafts: [] };
    }

    const transitionHistory: TransitionComponent[] = [];
    const drafts: DataField[] = [];

    for (const field of fields) {
      if (field.id === comp) {
        transitionHistory.push({
          name: "add-field",
          id: field.id,
        });

        drafts.push(field);

        return { transitionHistory, dataFieldDrafts: drafts };
      }

      if (field.fields?.length) {
        const nextAsscHistory = getAsscFieldTransitionHistory(
          comp,
          field.fields
        );
        if (nextAsscHistory.transitionHistory.length) {
          transitionHistory.push(
            {
              name: "add-field",
              id: field.id,
            },
            ...nextAsscHistory.transitionHistory
          );
          drafts.push(field, ...nextAsscHistory.dataFieldDrafts);
        }
      }
    }

    return { transitionHistory, dataFieldDrafts: drafts };
  };

  const getAsscDatacardFieldTransitionHistory = (
    comp: string | null,
    fields: DataField[],
    datacardSlug: string
  ) => {
    if (!comp) {
      return { transitionHistory: [], fieldDrafts: [] };
    }

    const transitionHistory: TransitionComponent[] = [];
    let fieldDrafts: DataField[] = [];

    for (const field of fields) {
      if (field.id === comp) {
        transitionHistory.push({
          name: "add-field-datacard-design",
          id: `${datacardSlug}.${field.id}`,
        });

        fieldDrafts.push(field);

        return { transitionHistory, fieldDrafts };
      }

      if (field.fields?.length) {
        const nextAsscHistory = getAsscDatacardFieldTransitionHistory(
          comp,
          field.fields,
          datacardSlug
        );
        if (nextAsscHistory.transitionHistory.length) {
          transitionHistory.push(
            {
              name: "add-field-datacard-design",
              id: `${datacardSlug}.${field.id}`,
            },
            ...nextAsscHistory.transitionHistory
          );

          fieldDrafts.push(field, ...nextAsscHistory.fieldDrafts);
        }
      }
    }

    return { transitionHistory, fieldDrafts };
  };

  const getTransitionHistory = (
    comp: string | null,
    designs: DatacardDesign[]
  ) => {
    if (!comp) return { transitionHistory: [], datacardDesignDraft: null };

    const transitionHistory: TransitionComponent[] = [];
    let draft: Partial<DatacardDesign> | null = null;

    for (const d of designs) {
      if (d.slug === comp) {
        transitionHistory.push({
          name: "dataset-card-editor",
          id: d.slug,
        });
        draft = d;

        return { transitionHistory, datacardDesignDraft: draft };
      }
    }

    return { transitionHistory, datacardDesignDraft: draft };
  };

  const updateDatasetDesignField = React.useCallback(
    (data: AddAssociatedFieldFormType, goBack: () => void) => {
      if (!datasetDesign || !dataFieldDrafts.length) {
        return;
      }
      if (dataFieldDrafts.length === 1) {
        const dataFieldDraft = dataFieldDrafts[0];
        let fields = datasetDesign.fields?.fields || [];
        const fieldIndex = fields.findIndex((f) => f.id === dataFieldDraft.id);
        if (fieldIndex > -1) {
          fields[fieldIndex] = {
            ...fields[fieldIndex],
            ...dataFieldDraft,
            ...data,
          };
        } else {
          fields.push({ ...dataFieldDraft, ...data });
        }
        updateDatasetDesign({
          slug: datasetDesign.slug,
          data: {
            fields: {
              ...(datasetDesign.fields || {}),
              fields,
            },
          },
        });
        emptyDataFieldDrafts();
        goBack();
      } else {
        const finalDraft = dataFieldDrafts.reduceRight(
          (finalDraft, draft, idx, arr) => {
            if (idx === arr.length - 1) {
              return { ...draft, ...data };
            }

            let newDraft = { ...draft };
            if (newDraft.fields) {
              const fieldIdx = newDraft.fields.findIndex(
                (f) => f.id === finalDraft.id
              );
              if (fieldIdx > -1) {
                newDraft.fields = newDraft.fields!.map((f) =>
                  f.id === finalDraft.id
                    ? {
                        ...f,
                        ...finalDraft,
                      }
                    : f
                );
              } else {
                newDraft.fields = [
                  ...(newDraft.fields || []),
                  { ...finalDraft },
                ];
              }
            } else {
              newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
            }

            return newDraft;
          },
          {} as any
        );
        const dataFieldDraft = finalDraft;
        let fields = datasetDesign.fields?.fields || [];
        const fieldIndex = fields.findIndex((f) => f.id === dataFieldDraft.id);
        if (fieldIndex > -1) {
          fields[fieldIndex] = {
            ...fields[fieldIndex],
            ...dataFieldDraft,
          };
        } else {
          fields.push({ ...dataFieldDraft, ...data });
        }
        updateDatasetDesign({
          slug: datasetDesign.slug,
          data: {
            fields: {
              ...(datasetDesign.fields || {}),
              fields,
            },
          },
        });
        mergeDataFieldDraftTail(data);
        goBack();
      }
    },
    [
      datasetDesign,
      dataFieldDrafts,
      updateDatasetDesign,
      emptyDataFieldDrafts,
      mergeDataFieldDraftTail,
    ]
  );

  const updateDatacardDesignField = React.useCallback(
    (data: AddAssociatedFieldFormType, goBack: () => void) => {
      if (!datacardDesignDraft?.slug || !dataFieldDrafts.length) {
        return;
      }
      if (dataFieldDrafts.length === 1) {
        const dataFieldDraft = dataFieldDrafts[0];
        let fields = datacardDesignDraft.associated_fields?.fields || [];
        const fieldIndex = fields.findIndex((f) => f.id === dataFieldDraft.id);
        if (fieldIndex > -1) {
          fields = fields.map((f) =>
            f.id === dataFieldDraft.id
              ? {
                  ...f,
                  ...dataFieldDraft,
                  ...data,
                }
              : f
          );
        } else {
          fields.push({ ...dataFieldDraft, ...data });
        }
        const asscFields = {
          ...(datacardDesignDraft.associated_fields || {}),
          fields,
        };
        updateDatacardDesign({
          slug: datacardDesignDraft.slug,
          data: {
            associated_fields: asscFields,
          },
        });
        emptyDataFieldDrafts();
        setDatacardDesignDraft({
          ...datacardDesignDraft,
          associated_fields: asscFields,
        });
        goBack();
      } else {
        const finalDraft = dataFieldDrafts.reduceRight(
          (finalDraft, draft, idx, arr) => {
            if (idx === arr.length - 1) {
              return { ...draft, ...data };
            }

            let newDraft = { ...draft };
            if (newDraft.fields) {
              const fieldIdx = newDraft.fields.findIndex(
                (f) => f.id === finalDraft.id
              );
              if (fieldIdx > -1) {
                newDraft.fields = newDraft.fields!.map((f) =>
                  f.id === finalDraft.id
                    ? {
                        ...f,
                        ...finalDraft,
                      }
                    : f
                );
              } else {
                newDraft.fields = [
                  ...(newDraft.fields || []),
                  { ...finalDraft },
                ];
              }
            } else {
              newDraft.fields = [...(newDraft.fields || []), { ...finalDraft }];
            }

            return newDraft;
          },
          {} as any
        );
        const dataFieldDraft = finalDraft;
        let fields = datacardDesignDraft.associated_fields?.fields || [];
        const fieldIndex = fields.findIndex((f) => f.id === dataFieldDraft.id);
        if (fieldIndex > -1) {
          fields = fields.map((f) =>
            f.id === dataFieldDraft.id
              ? {
                  ...f,
                  ...dataFieldDraft,
                }
              : f
          );
        } else {
          fields.push({ ...dataFieldDraft, ...data });
        }
        updateDatacardDesign({
          slug: datacardDesignDraft.slug,
          data: {
            associated_fields: {
              ...(datacardDesignDraft.associated_fields || {}),
              fields,
            },
          },
        });
        mergeDataFieldDraftTail(data);
        goBack();
      }
    },
    [
      datacardDesignDraft,
      dataFieldDrafts,
      updateDatacardDesign,
      emptyDataFieldDrafts,
      setDatacardDesignDraft,
      mergeDataFieldDraftTail,
    ]
  );

  // const updateDatacardDesignField = React.useCallback(
  //   (data: AddAssociatedFieldFormType) => {
  //     if (!datacardDesignDraft) {
  //       return;
  //     }
  //     if (!selectedDataField) {
  //       setDatacardDesignDraft({
  //         ...datacardDesignDraft,
  //         associated_fields: {
  //           fields: [
  //             ...(datacardDesignDraft?.associated_fields?.fields || []),
  //             { ...data, id: v4() },
  //           ],
  //         },
  //       });
  //     } else {
  //       setDatacardDesignDraft({
  //         ...datacardDesignDraft,
  //         associated_fields: {
  //           fields: (datacardDesignDraft?.associated_fields?.fields || []).map(
  //             (field) => {
  //               return field.id === selectedDataField.id
  //                 ? { ...field, ...data }
  //                 : field;
  //             }
  //           ),
  //         },
  //       });
  //     }
  //   },
  //   [datacardDesignDraft, selectedDataField, setDatacardDesignDraft]
  // );

  const normalizeDatacardDesignDraft = React.useCallback(
    (draft: Partial<DatacardDesign>) => {
      return pick(draft, [
        "name",
        "description",
        "sort_order",
        "icon",
        "associated_fields",
      ]);
    },
    []
  );

  const datacardDesignSubmitHandler = React.useCallback(
    (data: AddDatacardDesignFieldFormType, goBack: () => void) => {
      if (!datasetDesign) {
        return;
      }
      if (datacardDesignDraft?.slug) {
        updateDatacardDesign(
          {
            slug: datacardDesignDraft.slug,
            data: {
              ...normalizeDatacardDesignDraft(datacardDesignDraft),
              ...data,
            },
          },
          {
            onSuccess() {
              goBack?.();
            },
          }
        );
      } else {
        createDatacardDesign(
          {
            ...normalizeDatacardDesignDraft(datacardDesignDraft || {}),
            ...data,
            datacard_type: "datasets",
            dataset_design_slug: datasetDesign?.slug,
          },
          {
            onSuccess() {
              goBack?.();
            },
          }
        );
      }
    },
    [
      createDatacardDesign,
      normalizeDatacardDesignDraft,
      datacardDesignDraft,
      datasetDesign,
      updateDatacardDesign,
    ]
  );

  const getComponents: Config["getComponents"] = React.useCallback(
    (gotoComponent, goBack) => {
      return {
        main: (
          <DatasetDesignSidebar
            onAddFieldClick={() => {
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent({ name: "add-field", id: "add-field" });
            }}
            odEditSettingsClick={() =>
              gotoComponent({
                name: "dataset-settings",
                id: "dataset-settings",
              })
            }
            onFieldClick={(field) => {
              pushDataFieldDraft(field);
              gotoComponent({ name: "add-field", id: field.id });
            }}
            onCardFieldClick={(datacardDesign) => {
              setDatacardDesignDraft(datacardDesign);
              gotoComponent({
                name: "dataset-card-editor",
                id: datacardDesign.slug,
              });
            }}
            onAddCardFieldClick={() => {
              gotoComponent({
                name: "dataset-card-editor",
                id: "add-datacard-design",
              });
              setDatacardDesignDraft({});
            }}
            datasetDesign={datasetDesign}
            datacardDesigns={datacardDesigns}
          />
        ),
        "add-field": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft();
            }}
            onSubmit={(data) => {
              updateDatasetDesignField(data, goBack);
            }}
            dataField={last(dataFieldDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(dataFieldDrafts.length - 1, {
                ...dataFieldDrafts[dataFieldDrafts.length - 1],
                ...data,
              });
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent(
                { name: "add-field", id },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(dataFieldDrafts.length - 1, {
                ...dataFieldDrafts[dataFieldDrafts.length - 1],
                ...data,
              });
              pushDataFieldDraft(field);
              gotoComponent({ name: "add-field", id: field.id });
            }}
          />
        ),
        "add-field-datacard-design": (
          <AddAssociatedField
            onBackClick={() => {
              goBack();
              popDataFieldDraft();
            }}
            onSubmit={(data) => {
              updateDatacardDesignField(data, goBack);
              // goBack();
            }}
            dataField={last(dataFieldDrafts)}
            onAddClick={(data) => {
              updateDataFieldDraft(dataFieldDrafts.length - 1, {
                ...dataFieldDrafts[dataFieldDrafts.length - 1],
                ...data,
              });
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent(
                {
                  name: "add-field-datacard-design",
                  id: `${datacardDesignDraft?.slug}.${id}`,
                },
                { updateQuery: { id: false } }
              );
            }}
            onFieldClick={(field, data) => {
              updateDataFieldDraft(dataFieldDrafts.length - 1, {
                ...dataFieldDrafts[dataFieldDrafts.length - 1],
                ...data,
              });
              pushDataFieldDraft(field);
              gotoComponent({
                name: "add-field-datacard-design",
                id: `${datacardDesignDraft?.slug}.${field.id}`,
              });
            }}
          />
        ),
        "dataset-settings": (
          <DatasetDesignSettingsEditor
            onBackClick={() => goBack()}
            datasetDesign={datasetDesign}
          />
        ),
        "dataset-card-editor": (
          <DataCardDesignEditor
            onBackClick={() => {
              goBack();
              setDatacardDesignDraft(null);
            }}
            onAddFieldClick={(design) => {
              setDatacardDesignDraft({ ...datacardDesignDraft, ...design });
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent({
                name: "add-field-datacard-design",
                id: datacardDesignDraft?.slug!,
              });
            }}
            onFieldClick={(field, design) => {
              setDatacardDesignDraft({ ...datacardDesignDraft, ...design });
              pushDataFieldDraft(field);
              gotoComponent({
                name: "add-field-datacard-design",
                id: `${datacardDesignDraft?.slug}.${field.id}`,
              });
            }}
            onSubmit={(data) => datacardDesignSubmitHandler(data, goBack)}
            datacardDesign={datacardDesignDraft}
          />
        ),
      };
    },
    [
      datasetDesign,
      datacardDesigns,
      dataFieldDrafts,
      datacardDesignDraft,
      pushDataFieldDraft,
      setDatacardDesignDraft,
      popDataFieldDraft,
      updateDatasetDesignField,
      updateDataFieldDraft,
      updateDatacardDesignField,
      datacardDesignSubmitHandler,
    ]
  );

  useEffect(() => {
    rightSidebarRef?.current?.reset();
  }, [datasetDesignSlug, rightSidebarRef]);

  return (
    <React.Fragment>
      <AnimationLayout
        config={{
          getComponents,
          initialComponent: getSearchParams().get("s_name") || "main",
        }}
        enableScrollbar={!disableScrollbar}
        ref={rightSidebarRef}
        urlQueryKey="s"
      />
    </React.Fragment>
  );
};

export default DatasetDesignSetting;
