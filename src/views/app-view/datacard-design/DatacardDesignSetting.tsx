import AddAssociatedField, {
  AddAssociatedFieldFormType,
} from "components/AddAssociatedField";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
  TransitionComponent,
} from "layouts/AnimationLayout";
import last from "lodash/last";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useUpdateItem from "queries/useUpdateItem";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDatasetStore } from "store/stores/dataset";
import { getSearchParams } from "utils";
import { v4 } from "uuid";
import DatacardDesignSidebar from "./DatacardDesignSidebar";

const DatacardDesignSetting = ({
  disableScrollbar,
}: {
  disableScrollbar?: boolean;
}) => {
  const { slug: datacardDesignSlug = "" } = useParams<{ slug?: string }>();

  const dataFieldDrafts = useDatasetStore.useDataFieldDrafts();
  const pushDataFieldDraft = useDatasetStore.usePushDataFieldDraft();
  const setDataFieldDrafts = useDatasetStore.useSetDataFieldDrafts();
  const popDataFieldDraft = useDatasetStore.usePopDataFieldDraft();
  const emptyDataFieldDrafts = useDatasetStore.useEmptyDataFieldDrafts();
  const updateDataFieldDraft = useDatasetStore.useUpdateDataFieldDraft();
  const mergeDataFieldDraftTail = useDatasetStore.useMergeDataFieldDraftTail();

  const rightSidebarRef = useRef<AnimationLayoutRef>(null);

  const { data: datacardDesign } = useGetItem({
    modelName: ApiModels.DatacardDesign,
    slug: datacardDesignSlug!,
    requestOptions: { path: "contacts" },
  });

  const { mutate: updateDatacardDesign } = useUpdateItem({
    modelName: ApiModels.DatacardDesign,
    mutationOptions: {
      mutationKey: [ApiModels.DatacardDesign],
    },
    requestOptions: { path: "contacts" },
  });

  useLayoutEffect(() => {
    if (rightSidebarRef.current) {
      const s = getSearchParams().get("s");
      const sName = getSearchParams().get("s_name");
      const transitionHistory: TransitionComponent[] = [
        { name: "main", id: "main" },
      ];

      if (s === "add-field") {
        transitionHistory.push({
          name: "add-field",
          id: "add-field",
        });
        setDataFieldDrafts([{ id: v4() }]);
      } else if (sName === "add-field") {
        const { transitionHistory: tHistory, dataFieldDrafts: dfDrafts } =
          getAsscFieldTransitionHistory(
            s,
            datacardDesign?.associated_fields?.fields || []
          );
        transitionHistory.push(...tHistory);
        setDataFieldDrafts(dfDrafts);
      }
      rightSidebarRef.current.setTransitionHistory(transitionHistory);
      // rightSidebarRef.current.gotoComponent(
      //   transitionHistory[transitionHistory.length - 1],
      //   false
      // );
    }
  }, [datacardDesign]);

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

  const updateDatasetDesignField = React.useCallback(
    (data: AddAssociatedFieldFormType, goBack: () => void) => {
      if (!datacardDesign || !dataFieldDrafts.length) {
        return;
      }
      if (dataFieldDrafts.length === 1) {
        const dataFieldDraft = dataFieldDrafts[0];
        let fields = datacardDesign.associated_fields?.fields || [];
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
        updateDatacardDesign({
          slug: datacardDesign.slug,
          data: {
            associated_fields: {
              ...(datacardDesign.associated_fields || {}),
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
        let fields = datacardDesign.associated_fields?.fields || [];
        const fieldIndex = fields.findIndex((f) => f.id === dataFieldDraft.id);
        if (fieldIndex > -1) {
          fields[fieldIndex] = {
            ...fields[fieldIndex],
            ...dataFieldDraft,
          };
        } else {
          fields.push({ ...dataFieldDraft, ...data });
        }
        updateDatacardDesign({
          slug: datacardDesign.slug,
          data: {
            associated_fields: {
              ...(datacardDesign.associated_fields || {}),
              fields,
            },
          },
        });
        mergeDataFieldDraftTail(data);
        goBack();
      }
    },
    [
      datacardDesign,
      dataFieldDrafts,
      updateDatacardDesign,
      emptyDataFieldDrafts,
      mergeDataFieldDraftTail,
    ]
  );

  const getComponents: Config["getComponents"] = React.useCallback(
    (gotoComponent, goBack) => {
      return {
        main: (
          <DatacardDesignSidebar
            onAddFieldClick={() => {
              const id = v4();
              pushDataFieldDraft({ id });
              gotoComponent({ name: "add-field", id: "add-field" });
            }}
            onFieldClick={(field) => {
              pushDataFieldDraft(field);
              gotoComponent({ name: "add-field", id: field.id });
            }}
            datacardDesign={datacardDesign}
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
      };
    },
    [
      datacardDesign,
      dataFieldDrafts,
      pushDataFieldDraft,
      popDataFieldDraft,
      updateDatasetDesignField,
      updateDataFieldDraft,
    ]
  );

  useEffect(() => {
    rightSidebarRef?.current?.reset();
  }, [datacardDesignSlug, rightSidebarRef]);

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

export default DatacardDesignSetting;
