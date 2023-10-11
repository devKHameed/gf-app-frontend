import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spin from "components/Spin";
import TagModel from "models/Tag";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import { useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import TagEditor from ".";

const formSchema = z.object({
  tags: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        color: z.string().optional(),
      })
    )
    .optional(),
});

type formType = z.infer<typeof formSchema>;
type IdBaseArray = { value: string };

function compareArrays<T extends IdBaseArray>(old: T[], newArray: T[]) {
  const added: T[] = [];
  const removed: T[] = [];

  // Check for removed elements
  for (let i = 0; i < old.length; i++) {
    const found = newArray.find((elem) => elem.value === old[i].value);
    if (!found) {
      removed.push(old[i]);
    }
  }

  // Check for added elements
  for (let i = 0; i < newArray.length; i++) {
    const found = old.find((elem) => elem.value === newArray[i].value);
    if (!found) {
      added.push(newArray[i]);
    }
  }

  return { added, removed };
}

const TagEditWithDataProvider = ({ recordType }: { recordType: string }) => {
  const { data: TagsList, isLoading } = useListItems({
    modelName: ApiModels.Tag,
    requestOptions: { path: recordType },
    queryKey: [ApiModels.Tag, recordType],
    queryOptions: { enabled: !!recordType },
  });
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit, reset } = form;
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const queryClient = useQueryClient();
  const initialTagList = useRef<
    {
      value: string;
      label: string;
      color: string;
    }[]
  >([]);
  const { mutate: updateTag } = useMutation<
    void,
    unknown,
    {
      record_type: string;
      tags: Pick<UniversalTag, "record_id" | "action" | "tag" | "color">[];
    }
  >({
    mutationFn: async (data) => {
      await TagModel.BulkUpdate(data);
    },
    onSuccess: (_, data) => {
      queryClient.refetchQueries([[ApiModels.Tag, recordType]]);
    },
  });
  useEffect(() => {
    initialValueSet.current = false;
  }, [recordType]);
  useEffect(() => {
    if (TagsList && !initialValueSet.current) {
      const tagsList = TagsList.map((item) => ({
        value: item.record_id,
        label: item.tag,
        color: item.color,
      }));
      initialTagList.current = tagsList;
      reset({ tags: tagsList });
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 1000);
    }
  }, [reset, TagsList]);

  const submitHandler = useCallback((data: Partial<formType>) => {
    console.log("data");

    if (recordType && allowNetworkRequest.current) {
      const newTags = data.tags || [];

      const oldTags = initialTagList.current;
      const { added, removed } = compareArrays(oldTags, newTags);

      const actionTags = removed
        .map((tag) => ({
          record_id: tag.value,
          tag: tag.label,
          color: tag.color || "",
          action: "remove",
        }))
        .concat(
          added.map((tag) => ({
            record_id: tag.value,
            tag: tag.label,
            color: tag.color || "",
            action: "add",
          }))
        );
      updateTag(
        {
          record_type: recordType,
          tags: actionTags as Pick<
            UniversalTag,
            "record_id" | "action" | "tag" | "color"
          >[],
        },
        {
          onSuccess: () => {
            console.log("ThreePAppAction edit success");
          },
        }
      );
    }
  }, []);

  return (
    <Spin spinning={isLoading}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <TagEditor name="tags" />
        </form>
      </FormProvider>
    </Spin>
  );
};

export default TagEditWithDataProvider;
