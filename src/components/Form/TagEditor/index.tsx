import { AddOutlined } from "@mui/icons-material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { Box, Chip, InputAdornment, styled, TextField } from "@mui/material";
import { uniqueId } from "lodash";
import React, {
  RefObject,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from "react";
import FormFieldTooltipWrapper from "../FormFieldTooltipWrapper";

const colors = ["red", "green", "blue", "orange", "yellow"];

type Props = { title?: string } & Omit<
  React.ComponentProps<typeof FormFieldTooltipWrapper>,
  "render"
>;

const TagsCard = styled(Box)(({ theme }) => {
  return {
    background: theme.palette.background.GFRightNavForeground,
    padding: "14px 20px 16px",
    borderRadius: "6px",

    "&:hover": {
      ".edit-icon": {
        opacity: "0.6",
        visibility: "visible",

        "&:hover": {
          opacity: "1",
        },
      },
    },

    ".label-holder": {
      lineHeight: "20px",
      margin: "0 0 17px",
      fontWeight: "600",
    },

    ".edit-icon": {
      position: "absolute",
      right: "14px",
      width: "14px",
      top: "17px",
      opacity: "0",
      visibility: "hidden",
      transition: "all 0.4s ease",
    },

    ".MuiChip-root ": {
      height: "22px",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "3px",

      ".MuiChip-label ": {
        padding: "2px 7px",
      },
    },
  };
});

const Tags = styled(Box)(({ theme }) => {
  return {
    display: "flex",
    flexWrap: "wrap",

    ".MuiChip-root ": {
      height: "22px",
      fontSize: "14px",
      lineHeight: "18px",
      borderRadius: "3px",
      marginRight: "10px",
      fontWeight: "600",
      marginBottom: "4px",

      ".MuiChip-label ": {
        padding: "2px 7px",
      },
    },
  };
});

const TagsTooltip = styled(Box)(({ theme }) => {
  return {
    ".tag-item": {
      position: "relative",
      marginRight: "10px",
      marginBottom: "4px",

      ".MuiChip-root": {
        margin: "0",
        paddingRight: "26px",
      },

      svg: {
        width: "16px",
        height: "auto",
        position: "absolute",
        right: "8px",
        top: "5px",
        cursor: "pointer",
      },
    },

    ".label-holder": {
      fontSize: "16px",
      lineHeight: "20px",
      margin: "0 0 25px",
      fontWeight: "400",
    },

    ".MuiFormControl-root ": {
      display: "block",
    },

    ".MuiInputBase-root": {
      display: "flex",
    },

    ".tags-holder:not(:empty)": {
      margin: "0 0 14px",
    },
  };
});

const TagElement = ({
  label = "Tags",
  value = [],
}: {
  label?: string;
  value: { label: string; color: string }[];
}) => {
  return (
    <TagsCard>
      <Box className="label-holder">{label}</Box>
      <Box className="edit-icon">
        <CreateOutlinedIcon />
      </Box>
      <Tags className="tags-holder">
        {value.map((v) => (
          <Chip sx={{ background: v.color }} label={v.label} />
        ))}
      </Tags>
    </TagsCard>
  );
};

type Tag = { label: string; color: string; value: string };
export const TagEditorElement = React.forwardRef<
  HTMLInputElement | null,
  {
    label?: string;
    value?: Tag[];
    onChange?: (_: Tag[]) => void;
  }
>(({ label = "Edit Tags", value = [], onChange }, ref) => {
  const inputRef = useRef() as RefObject<HTMLInputElement> | null;

  useImperativeHandle(
    ref,
    () => {
      return inputRef?.current as any;
    },
    [inputRef]
  );

  const addTagHandle = (e: SyntheticEvent) => {
    if (inputRef?.current) {
      const tag = inputRef?.current.value;
      const newValue = [
        ...value,
        {
          value: uniqueId(),
          label: tag,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ];
      onChange?.(newValue);
      inputRef.current.value = "";
    }
  };
  const removeHandler = (index: number) => {
    if (index) {
      const newArray = [...value];
      newArray.splice(index, 1);
      onChange?.(newArray);
    }
  };
  const onEnterHandler = (e: any) => {
    if (e.key === "Enter" || e.key === "enter") {
      if (inputRef?.current) {
        const tag = inputRef?.current.value;
        const newValue = [
          ...value,
          {
            value: uniqueId(),
            label: tag,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
        ];
        onChange?.(newValue);
        inputRef.current.value = "";
      }
    }
  };
  return (
    <TagsTooltip>
      <Box className="label-holder">{label}</Box>
      <Tags className="tags-holder">
        {value.map((v, index) => (
          <Box className="tag-item">
            {" "}
            <Chip key={v.value} sx={{ background: v.color }} label={v.label} />
            <HighlightOffOutlinedIcon
              onClick={() => {
                removeHandler(index);
              }}
            />
          </Box>
        ))}
      </Tags>
      <TextField
        inputRef={inputRef}
        onKeyDown={onEnterHandler}
        variant="filled"
        size="small"
        hiddenLabel
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AddOutlined onClick={addTagHandle} />
            </InputAdornment>
          ),
        }}
      />
    </TagsTooltip>
  );
});

const TagEditor: React.FC<Props> = (props) => {
  return (
    <FormFieldTooltipWrapper
      tooltipProps={{ placement: "right" }}
      render={({ field, fieldRef, isBaseElement }) => {
        if (isBaseElement)
          return <TagElement value={field.value} label={props.label} />;
        return (
          <TagEditorElement
            value={field.value}
            label={props.label}
            ref={fieldRef}
            onChange={field.onChange}
          />
        );
      }}
      {...props}
    />
  );
};

export default TagEditor;
