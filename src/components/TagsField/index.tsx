import { Box, Chip, ChipProps, TextField, TextFieldProps } from "@mui/material";
import { useEffect, useState } from "react";
import { TagsBoxItem } from "./index.style";

type Props = {
  fieldProps?: TextFieldProps;
  tagProps?: ChipProps;
  onChange?(tags: string[]): void;
};

const TagsField: React.FC<Props> = (props) => {
  const { fieldProps, tagProps, onChange } = props;

  const [value, setValue] = useState("");
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    onChange?.(tags);
  }, [tags]);

  const onDelete = (title: any) => () => {
    setTags((value: any[]) => value.filter((v: string) => v !== title));
  };

  const onEnterTag = (e: any) => {
    if (
      !!value.trim() &&
      e.keyCode === 13 &&
      !!!tags.find((e) => e === value)
    ) {
      setTags((pre) => [...pre, value]);
      setValue("");
    }
  };

  return (
    <TagsBoxItem>
      <TextField
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => onEnterTag(e)}
        value={value}
        variant="outlined"
        placeholder="Favorites"
        {...fieldProps}
      />

      <Box
        mt={1.5}
        sx={{
          "& > :not(:last-child)": { marginRight: 1 },
          "& > *": { marginBottom: 1 },
        }}
      >
        {tags.map((v) => (
          <Chip key={v} label={v} onDelete={onDelete(v)} {...tagProps} />
        ))}
      </Box>
    </TagsBoxItem>
  );
};

export default TagsField;
