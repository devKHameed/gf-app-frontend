import { ArrowBack } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SidebarSection from "components/RightSidebar/SidebarSection";
import { debounce } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useUpdateItem from "queries/useUpdateItem";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ConditionSets from "./ConditionSets";

const SidebarSectionWrap = styled(SidebarSection)(({ theme }) => {
  return {
    ".MuiCard-root:hover": {
      background: `${theme.palette.background.GFRightNavForeground} !important`,

      ".edit-icon": {
        opacity: "1",
        visibility: "visible",
      },
    },

    ".record-item": {
      transition: "all 0.4s ease",

      "&:hover ": {
        background: theme.palette.background.GF20,

        ".edit-icon": {
          opacity: "1",
          visibility: "visible",
        },
      },
    },

    ".edit-icon": {
      width: "16px",
      height: "16px",
      color: theme.palette.background.GF60,
      transition: "all 0.4s ease",
      opacity: "0",
      visibility: "hidden",
      cursor: "pointer",

      "&:hover": {
        color: theme.palette.text.primary,
      },

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
        color: "currentColor",
      },
    },
  };
});

const RulesCard = styled(Card)(({ theme }) => {
  return {
    padding: "13px",
    transition: "all 0.4s ease",
    background: theme.palette.background.GFOutlineNav,

    ".MuiCardHeader-root": {
      padding: "0 0 9px",

      ".MuiTypography-root": {
        fontSize: "14px",
        lineHeight: "20px",
        color: theme.palette.text.primary,
        fontWeight: "400",
      },

      ".MuiCardHeader-action ": {
        marginRight: "0",
        ".MuiButtonBase-root": {
          padding: "0",
          width: "20px",
          height: "20px",
          color: theme.palette.text.primary,

          svg: {
            width: "100%",
            height: "auto",
            display: "block",
          },
        },
      },
    },

    ".MuiCardContent-root ": {
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "11px",

      "&:last-child": {
        padding: "0",
      },
    },

    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent !important",
    },

    ".MuiInputBase-root": {
      background: theme.palette.background.GFTopNav,
    },
  };
});

const name = "view_filters";
const GuiSidenavRules: React.FC<{ gui: GfGui; onClickBack: () => void }> = ({
  gui,
  onClickBack,
}) => {
  const { control, register, handleSubmit, watch, setValue, ...rest } =
    useForm();
  const initialValueSet = useRef(false);
  const allowNetworkRequest = useRef(false);
  const { mutate: updateGui } = useUpdateItem({ modelName: ApiModels.Gui });

  const guiSlug = useMemo(() => gui.slug, [gui.slug]);
  const { fields, remove, replace, insert } = useFieldArray({
    control,
    name,
  });

  useEffect(() => {
    if (!fields.length) {
      replace([{ condition_set: [{ a: "", b: "", o: "=" }] }]);
    }
  }, [fields]);

  useEffect(() => {
    initialValueSet.current = false;
    allowNetworkRequest.current = false;
  }, [guiSlug]);

  useEffect(() => {
    if (guiSlug && !initialValueSet.current) {
      setValue(name, gui?.filter_settings?.view_filters);
      initialValueSet.current = true;
      setTimeout(() => {
        allowNetworkRequest.current = true;
      }, 3000);
    }
  }, [guiSlug, gui?.filter_settings, setValue]);

  const submitHandler = useCallback(
    (data: Partial<{ view_filters: Condition[] }>) => {
      if (guiSlug && allowNetworkRequest.current) {
        updateGui(
          {
            slug: guiSlug,
            data: { filter_settings: { view_filters: data.view_filters } },
          },
          {
            onSuccess: () => {
              console.log("AccountUser edit success");
            },
          }
        );
      }
    },
    [guiSlug, updateGui]
  );

  useEffect(() => {
    const submitDeb = debounce(() => {
      handleSubmit(submitHandler)();
    }, 600);
    const subscription = watch((_) => {
      submitDeb();
    });
    return () => subscription.unsubscribe();
  }, [watch, submitHandler, handleSubmit]);
  return (
    <SidebarSectionWrap
      title="Manage Rules"
      onRightIconClick={() => {
        insert(fields.length + 1, {
          condition_set: [{ a: "", b: "", o: "=" }],
        });
      }}
      leftIcon={<ArrowBack />}
      onLeftIconClick={onClickBack}
    >
      {fields.map((field, fieldIdx) => {
        return (
          <Box key={field.id} id={field.id}>
            <Stack direction="column" spacing={1} key={field.id}>
              {fieldIdx > 0 && (
                <Divider
                  sx={{
                    "&:before, &:after": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  }}
                >
                  or
                </Divider>
              )}
            </Stack>
            <RulesCard>
              <CardHeader
                title="INCLUDE IF "
                action={
                  <IconButton
                    aria-label="cross"
                    onClick={() => remove(fieldIdx)}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent sx={{ padding: "0px 8px" }}>
                <ConditionSets
                  control={control}
                  register={register}
                  parentNamePath={`${name}[${fieldIdx}]`}
                  conditionsLength={fields.length}
                  // field={{}}
                  // field={paramField}
                  {...rest}
                />
              </CardContent>
            </RulesCard>
          </Box>
        );
      })}
    </SidebarSectionWrap>
  );
};

export default GuiSidenavRules;
