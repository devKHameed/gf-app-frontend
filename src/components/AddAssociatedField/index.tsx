import { zodResolver } from "@hookform/resolvers/zod";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import {
  Box,
  Button,
  CardActions,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { TimePicker } from "@mui/x-date-pickers";
import ColorPicker from "components/ColorPicker";
import FieldIcon from "components/Form/FieldIcon";
import FormField from "components/FormField";
import SidebarSection from "components/RightSidebar/SidebarSection";
import Scrollbar from "components/Scrollbar";
import { SortableList } from "components/SortableList";
import { FormElements, NumericTypesOptions } from "constants/index";
import { DocumentElementType } from "enums";
import { SelectTypes } from "enums/Form";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import React, { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldError,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
import { v4 } from "uuid";
import { z } from "zod";
const AddNewFieldContainer = styled(Box)(({ theme }) => {
  return {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    height: "100%",
    // width: "420px",

    [`${theme.breakpoints.down("sm")}`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },

    ".MuiFormLabel-root": {
      fontSize: "12px",
      lineHeight: "1",
      fontWeight: "600",
      color: theme.palette.background.GF80,
      marginBottom: "8px",
      textTransform: "uppercase",
    },

    ".MuiFormControl-root": {
      ".MuiFormControl-root": {
        marginBottom: "0",
        marginTop: "0",
      },
    },

    ".MuiListItem-root , .MuiBox-root": {
      paddingLeft: "0",
      paddingRight: "0",
    },
  };
});

const FieldSettingsContainer = styled(Box)({
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 20,
});

const CheckboxStyled = styled(Checkbox)({
  display: "block",
  width: "fit-content",
});

const DialogWrap = styled(Dialog)({
  ".MuiDialog-paper": {
    width: "100%",
  },

  ".color-picker": {
    marginTop: "8px",
  },
});

const BoxIcon = styled(Box)(({ theme }) => {
  return {
    width: "20px",
    color: theme.palette.background.GF70,

    svg: {
      maxWidth: "100%",
      height: "20px",
      width: "auto",
      display: "block",
      margin: "auto",

      path: {
        fill: "currentColor",
      },
    },
  };
});

type TypeFieldProps = {
  type: string;
  control: Control<AddAssociatedFieldFormType, any>;
  onAddClick: () => void;
  onFieldClick: (field: DataField) => void;
  watch: UseFormWatch<AddAssociatedFieldFormType>;
};

const AssociatedSubFields: React.FC<Omit<TypeFieldProps, "type">> = (props) => {
  const { control, onAddClick, onFieldClick } = props;

  const theme = useTheme();

  return (
    <SidebarSection
      title="Associated Fields"
      onRightIconClick={() => onAddClick()}
    >
      <Controller
        name="fields"
        control={control}
        render={({ field }) => (
          <SortableList
            items={field.value || ([] as DataField[])}
            onChange={(updatedItems) => {
              field.onChange(updatedItems);
            }}
            renderItem={(item) => (
              <SortableList.Item id={item.id} handle>
                <ProfileCard
                  AvatarImage={
                    <BoxIcon>
                      <LocalOfferOutlined />
                    </BoxIcon>
                  }
                  options={{
                    draggable: true,
                    switcher: false,
                  }}
                  rightIcon={<></>}
                  subTitle={item.slug}
                  title={item.title}
                  sx={{
                    background: theme.palette.background.GFRightNavForeground,
                    height: 48,
                    ".DragHandle": {
                      lineHeight: "1",
                      width: "20px",
                      height: "20px",
                      margin: "0 6px 0 -6px",
                      color: theme.palette.background.GF20,

                      "&:hover": {
                        color: theme.palette.background.GF50,

                        path: {
                          fill: theme.palette.background.GF50,
                        },
                      },

                      path: {
                        fill: theme.palette.background.GF20,
                        transition: "all 0.4s ease",
                      },

                      svg: {
                        width: "100%",
                        height: "auto",
                        display: "block",
                      },
                    },

                    ".card-inner-content": {
                      gap: "8px",
                    },
                  }}
                  onClick={() => onFieldClick(item)}
                />
              </SortableList.Item>
            )}
          />
        )}
      />
    </SidebarSection>
  );
};

const DATE_OFFSET_FROM_CREATION_LIST = [
  "Date Only",
  "Date Time",
  "Date Range",
  "Date Time Range",
];
const END_DATE_OFFSET_FROM_CREATION_LIST = ["Date Range", "Date Time Range"];
const DEFAULT_TIME_LIST = [
  "Date Only",
  "Time Only",
  "Date Time",
  "Date Time Range",
];
const DEFAULT_END_TIME_LIST = ["Date Time Range"];

enum DateType {
  DateOnly = "Date Only",
  TimeOnly = "Time Only",
  DateTime = "Date Time",
  // DateRange = 'Date Range',
  // DateTimeRange = 'Date Time Range',
}

const DateTypeOptions = Object.entries(DateType).map(([label, value]) => ({
  label,
  value,
}));

const DateTypeField: React.FC<TypeFieldProps> = (props) => {
  const { control, watch } = props;
  const dateType = watch("date_type") || "";
  const useCurrentTime = watch("use_current");

  return (
    <Stack gap={2.5} pt={2.5}>
      <FormField label="Date Type">
        <Controller
          name="date_type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              id="type"
              fullWidth
              select
              hiddenLabel
              size="small"
              variant="filled"
              value={`${field.value}`}
            >
              {DateTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </FormField>
      {DATE_OFFSET_FROM_CREATION_LIST.includes(dateType) && (
        <FormField label="Date Offset From Creation">
          <Controller
            name="start_date_offset"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                id="type"
                fullWidth
                type="number"
                hiddenLabel
                size="small"
                variant="filled"
                value={`${field.value}`}
              />
            )}
          />
        </FormField>
      )}
      {DEFAULT_TIME_LIST.includes(dateType) && (
        <>
          <FormField label="Use Current Time">
            <Controller
              control={control}
              name="use_current"
              render={({ field }) => {
                return <CheckboxStyled {...field} checked={field.value} />;
              }}
            />
          </FormField>
          {!useCurrentTime && (
            <FormField label="Default Time">
              <Controller
                control={control}
                name="start_time"
                render={({ field }) => {
                  return (
                    <TimePicker
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" variant="filled" />
                      )}
                    />
                  );
                }}
              />
            </FormField>
          )}
        </>
      )}
      {END_DATE_OFFSET_FROM_CREATION_LIST.includes(dateType) && (
        <FormField label="End Date Offset From Creation">
          <Controller
            name="end_date_offset"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                id="type"
                fullWidth
                type="number"
                hiddenLabel
                size="small"
                variant="filled"
                value={`${field.value}`}
              />
            )}
          />
        </FormField>
      )}
      {DEFAULT_END_TIME_LIST.includes(dateType) && (
        <FormField label="Default Time">
          <Controller
            control={control}
            name="end_time"
            render={({ field }) => {
              return (
                <TimePicker
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              );
            }}
          />
        </FormField>
      )}
    </Stack>
  );
};

type ListItemType = {
  label?: string;
  color?: string;
  value?: string;
  id?: string;
};

const ListItems: React.FC<{
  items: ListItemType[];
  onChange(items: ListItemType[]): void;
}> = (props) => {
  const { items, onChange } = props;

  const [open, setOpen] = useState(false);
  const [modalValues, setModalValues] = useState<ListItemType>();
  const [mode, setMode] = useState<"add" | "edit">("add");

  const handleSave = () => {
    if (!modalValues) {
      return;
    }
    if (mode === "add") {
      onChange([...items, { ...modalValues, id: v4() }]);
    } else {
      onChange(
        items.map((item) =>
          item.id === modalValues.id ? { ...item, ...modalValues } : item
        )
      );
    }

    setOpen(false);
    setModalValues(undefined);
  };

  const updateValues = (values: Partial<ListItemType>) => {
    setModalValues((prev) => ({ ...prev, ...values }));
  };

  return (
    <Box>
      <List>
        {items.map((item) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <Box>
                    <Chip
                      label={item.color}
                      size="small"
                      sx={{ backgroundColor: item.color }}
                    />
                  </Box>
                }
                primary={
                  <>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {item.label}
                    </Typography>
                    {" — "}
                    {item.value}
                  </>
                }
                onClick={() => {
                  setModalValues(item);
                  setMode("edit");
                  setOpen(true);
                }}
              />
            </ListItem>
            <Divider sx={{ marginLeft: 0 }} variant="inset" component="li" />
          </>
        ))}
      </List>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          setMode("add");
          setOpen(true);
        }}
      >
        Add List Item
      </Button>
      <DialogWrap open={open} onClose={() => setOpen(false)}>
        <DialogTitle>List Item</DialogTitle>
        <Scrollbar className="form-scroller">
          <DialogContent>
            <Stack gap={2}>
              <FormField label="Item Label">
                <TextField
                  onChange={(e) => updateValues({ label: e.target.value })}
                  autoFocus
                  margin="dense"
                  id="title"
                  type="text"
                  fullWidth
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={modalValues?.label}
                />
              </FormField>
              <FormField label="Item Value">
                <TextField
                  onChange={(e) => updateValues({ value: e.target.value })}
                  autoFocus
                  margin="dense"
                  id="title"
                  type="text"
                  fullWidth
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={modalValues?.value}
                />
              </FormField>
              <FormField label="Item Color">
                <ColorPicker
                  arrow
                  color={modalValues?.color}
                  onChange={(value) => updateValues({ color: value as string })}
                />
              </FormField>
            </Stack>
          </DialogContent>
        </Scrollbar>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </DialogWrap>
    </Box>
  );
};

enum ListSource {
  Hardcoded = "hardcoded",
  RecordAssociation = "record_association",
}

const ListSourceOptions = [
  {
    label: "Hardcoded",
    value: ListSource.Hardcoded,
  },
  {
    label: "Record Association",
    value: ListSource.RecordAssociation,
  },
];

const ListTypeFields: React.FC<TypeFieldProps> = (props) => {
  const { control, watch } = props;
  const listSource = watch("list_source");
  const associatedDataset = watch("associated_document");

  const { data: datasetDesigns } = useListItems({
    modelName: "dataset-design",
  });
  const [fieldOptions, setFieldOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (associatedDataset) {
      const datasetDesign = datasetDesigns?.find(
        (d) => d.slug === associatedDataset
      );
      if (datasetDesign?.fields?.fields) {
        setFieldOptions(
          datasetDesign.fields.fields.map((f) => ({
            label: f.title,
            value: f.slug,
          }))
        );
      }
    }
  }, [associatedDataset, datasetDesigns]);

  return (
    <Stack gap={2.5} pt={2.5}>
      <FormField label="List Source">
        <Controller
          name="list_source"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              id="type"
              fullWidth
              select
              hiddenLabel
              size="small"
              variant="filled"
              value={`${field.value}`}
            >
              {ListSourceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </FormField>
      {listSource === ListSource.Hardcoded && (
        <FormField label="List Items">
          <Controller
            name="list_items"
            control={control}
            render={({ field }) => {
              return (
                <ListItems
                  items={field.value || []}
                  onChange={(items) => field.onChange(items)}
                />
              );
            }}
          />
        </FormField>
      )}
      {listSource === ListSource.RecordAssociation && (
        <>
          <FormField label="Association Document">
            <Controller
              name="associated_document"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  id="type"
                  fullWidth
                  select
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={`${field.value}`}
                >
                  {datasetDesigns?.map((item) => (
                    <MenuItem key={item.slug} value={item.slug}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormField>
          {associatedDataset && (
            <FormField label="Label Field">
              <Controller
                name="associated_document_label_field"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    id="type"
                    fullWidth
                    select
                    hiddenLabel
                    size="small"
                    variant="filled"
                    value={`${field.value}`}
                  >
                    <MenuItem key={"slug"} value={"slug"}>
                      Slug
                    </MenuItem>
                    {fieldOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormField>
          )}
        </>
      )}
    </Stack>
  );
};

type ImageSize = {
  label: string;
  alignment?: string;
  width?: number;
  height?: number;
  is_default?: boolean;
};

const alignmentOptions = [
  { label: "Scale to width", value: "scale_to_width" },
  { label: "Scale to height", value: "scale_to_height" },
  { label: "Crop Middle, Center", value: "crop_middle_center" },
  { label: "Crop Top, Center", value: "crop_top_center" },
  { label: "Crop Bottom, Center", value: "crop_bottom_center" },
];

const ImageSizeList: React.FC<{
  items: ImageSize[];
  onChange(items: ImageSize[]): void;
}> = (props) => {
  const { items, onChange } = props;

  const [open, setOpen] = useState(false);
  const [modalValues, setModalValues] = useState<ImageSize>();
  const [mode, setMode] = useState<"add" | "edit">("add");

  const handleSave = () => {
    if (!modalValues) {
      return;
    }
    if (mode === "add") {
      onChange([...items, modalValues]);
    } else {
      onChange(
        items.map((item) =>
          item.label === modalValues.label ? { ...item, ...modalValues } : item
        )
      );
    }

    setOpen(false);
    setModalValues(undefined);
  };

  const updateValues = (values: Partial<ImageSize>) => {
    setModalValues((prev) => ({ ...(prev as ImageSize), ...values }));
  };

  return (
    <Box>
      <List sx={{ padding: "0 0 20px" }}>
        {items.map((item) => (
          <>
            <ListItem alignItems="flex-start" sx={{ py: "4px" }}>
              <ListItemText
                primary={item.label}
                secondary={
                  <Typography>
                    {
                      alignmentOptions.find((o) => o.value === item.alignment)
                        ?.label
                    }
                    , {item.width} x {item.height},{" "}
                    {item.is_default ? "default" : ""}
                  </Typography>
                }
                onClick={() => {
                  setModalValues(item);
                  setMode("edit");
                  setOpen(true);
                }}
              />
            </ListItem>
            <Divider sx={{ marginLeft: 0 }} variant="inset" component="li" />
          </>
        ))}
      </List>
      <Button
        variant="outlined"
        fullWidth
        onClick={() => {
          setMode("add");
          setOpen(true);
        }}
      >
        Add Image Size
      </Button>
      <DialogWrap open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Image Size</DialogTitle>
        <Scrollbar className="form-scroller">
          <DialogContent>
            <Stack gap={2}>
              <FormField label="Label">
                <TextField
                  onChange={(e) => updateValues({ label: e.target.value })}
                  autoFocus
                  margin="dense"
                  id="title"
                  type="text"
                  fullWidth
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={modalValues?.label}
                />
              </FormField>
              <FormField label="Alignment">
                <TextField
                  onChange={(e) =>
                    updateValues({
                      alignment: e.target.value,
                    })
                  }
                  autoFocus
                  margin="dense"
                  id="title"
                  fullWidth
                  select
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={modalValues?.alignment}
                >
                  {alignmentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormField>
              <FormField label="Width (px)">
                <TextField
                  onChange={(e) =>
                    updateValues({ width: Number(e.target.value) })
                  }
                  autoFocus
                  margin="dense"
                  id="title"
                  type="number"
                  fullWidth
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={modalValues?.width}
                />
              </FormField>
              <FormField label="Height (px)">
                <TextField
                  onChange={(e) =>
                    updateValues({
                      height: Number(e.target.value),
                    })
                  }
                  autoFocus
                  margin="dense"
                  id="title"
                  type="number"
                  fullWidth
                  hiddenLabel
                  size="small"
                  variant="filled"
                  value={modalValues?.height}
                />
              </FormField>
              <FormField label="Default">
                <CheckboxStyled
                  checked={modalValues?.is_default}
                  onChange={(e) =>
                    updateValues({
                      is_default: e.target.checked,
                    })
                  }
                />
              </FormField>
            </Stack>
          </DialogContent>
        </Scrollbar>
        <DialogActions>
          <Button onClick={handleSave} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </DialogWrap>
    </Box>
  );
};

const TypeFields: React.FC<TypeFieldProps & { isEditMode: boolean }> = (
  props
) => {
  const { type, control, watch, isEditMode } = props;
  const { data: UserTypes } = useListItems({ modelName: ApiModels.UserType });
  const allowAllUserTypes = watch("user_types_allow_all");
  const multiImage = watch("multi");

  switch (type) {
    case DocumentElementType.Date:
      return <DateTypeField {...props} />;
    case DocumentElementType.RecordList:
    case DocumentElementType.SubRecord:
      if (isEditMode) {
        return <AssociatedSubFields {...props} />;
      }
      return null;
    case DocumentElementType.Select:
      return (
        <Box pt={2.5}>
          <FormField label="List Default Display Type">
            <Controller
              control={control}
              name="list_default_display_type"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    margin="dense"
                    id="type"
                    type="text"
                    fullWidth
                    select
                    hiddenLabel
                    size="small"
                    variant="filled"
                    value={`${field.value}`}
                  >
                    <MenuItem value={SelectTypes.Single}>
                      Single Drop Down
                    </MenuItem>
                    <MenuItem value={SelectTypes.Multiple}>
                      Multi Drop Down
                    </MenuItem>
                  </TextField>
                );
              }}
            />
          </FormField>
          <ListTypeFields {...props} />
        </Box>
      );
    case DocumentElementType.Checkbox:
    case DocumentElementType.Radio:
      return <ListTypeFields {...props} />;
    case DocumentElementType.User:
      return (
        <Stack gap={2.5} pt={2.5}>
          <FormField label="Make it multi user">
            <Controller
              control={control}
              name="multi_user"
              render={({ field }) => {
                return <CheckboxStyled {...field} checked={field.value} />;
              }}
            />
          </FormField>
          <FormField label="Allow All User Types">
            <Controller
              control={control}
              name="user_types_allow_all"
              render={({ field }) => {
                return <CheckboxStyled {...field} checked={field.value} />;
              }}
            />
          </FormField>
          {!allowAllUserTypes && (
            <FormField label="User Types">
              <Controller
                control={control}
                name="user_types"
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      margin="dense"
                      id="type"
                      type="text"
                      fullWidth
                      select
                      hiddenLabel
                      size="small"
                      variant="filled"
                      SelectProps={{ multiple: true }}
                      value={field.value || []}
                    >
                      {UserTypes?.map((opt) => {
                        return (
                          <MenuItem value={opt.slug} key={opt.slug}>
                            {opt.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  );
                }}
              />
            </FormField>
          )}
        </Stack>
      );
    case DocumentElementType.File:
      return (
        <Stack gap={2.5} pt={2.5}>
          <FormField label="Extensions to Allow (comma separated)">
            <Controller
              control={control}
              name="accept"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    id="title"
                    type="text"
                    fullWidth
                    hiddenLabel
                    size="small"
                    variant="filled"
                    placeholder=".jpg, .png, .pdf"
                  />
                );
              }}
            />
          </FormField>
          <FormField label="Max File Size (MB)">
            <Controller
              control={control}
              name="max_size"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    }
                    autoFocus
                    margin="dense"
                    id="title"
                    type="number"
                    fullWidth
                    placeholder="0"
                    hiddenLabel
                    size="small"
                    variant="filled"
                  />
                );
              }}
            />
          </FormField>
        </Stack>
      );
    case DocumentElementType.Image:
      return (
        <Stack gap={2.5} pt={2.5}>
          <FormField label="Max Upload Size (MB)">
            <Controller
              control={control}
              name="max_size"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    autoFocus
                    margin="dense"
                    id="title"
                    type="number"
                    fullWidth
                    placeholder="0"
                    onChange={(e) =>
                      field.onChange(
                        (e.target as HTMLInputElement).valueAsNumber
                      )
                    }
                    hiddenLabel
                    size="small"
                    variant="filled"
                  />
                );
              }}
            />
          </FormField>
          <FormField label="Allow Multiple">
            <Controller
              control={control}
              name="multi"
              render={({ field }) => {
                return <CheckboxStyled {...field} checked={field.value} />;
              }}
            />
          </FormField>
          {multiImage && (
            <FormField label="Max Upload Count">
              <Controller
                control={control}
                name="max_count"
                render={({ field }) => {
                  return (
                    <TextField
                      {...field}
                      autoFocus
                      margin="dense"
                      id="title"
                      type="number"
                      fullWidth
                      placeholder="0"
                      onChange={(e) =>
                        field.onChange(
                          (e.target as HTMLInputElement).valueAsNumber
                        )
                      }
                      hiddenLabel
                      size="small"
                      variant="filled"
                    />
                  );
                }}
              />
            </FormField>
          )}
          <FormField label="Image Size List">
            <Controller
              control={control}
              name="image_sizes"
              render={({ field }) => {
                return (
                  <ImageSizeList
                    items={field.value || []}
                    onChange={(items) => field.onChange(items)}
                  />
                );
              }}
            />
          </FormField>
        </Stack>
      );
    case DocumentElementType.AudioVideo:
      return (
        <Box sx={{ mt: 2 }}>
          <FormField label="File Type">
            <Controller
              control={control}
              name="file_type"
              render={({ field }) => {
                return (
                  <RadioGroup
                    {...field}
                    value={field.value ?? "video"}
                    defaultValue="video"
                  >
                    <FormControlLabel
                      value="audio"
                      control={<Radio />}
                      label="Audio"
                    />
                    <FormControlLabel
                      value="video"
                      control={<Radio />}
                      label="Video"
                    />
                  </RadioGroup>
                );
              }}
            />
          </FormField>
        </Box>
      );
    case DocumentElementType.Number:
      return (
        <Stack gap={2.5} pt={2.5}>
          <FormField label="Number Type">
            <Controller
              control={control}
              name="number_type"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    margin="dense"
                    disabled={isEditMode}
                    fullWidth
                    value={`${field.value}`}
                    hiddenLabel
                    size="small"
                    variant="filled"
                    select
                  >
                    {NumericTypesOptions.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
          </FormField>
        </Stack>
      );
    default:
      return null;
  }
};

const imageSizeSchema = z.object({
  label: z.string(),
  alignment: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  is_default: z.boolean().optional(),
});

const listItemSchema = z.object({
  label: z.string(),
  color: z.string().optional(),
  value: z.string().optional(),
  id: z.string().optional(),
});

const baseFieldsSchema = z.object({
  title: z.string(),
  slug: z.string(),
  type: z.string(),
  tooltip: z.string().optional(),
  list_default_display_type: z
    .enum([SelectTypes.Single, SelectTypes.Multiple])
    .optional(),
  multi_user: z.boolean().optional(),
  user_types_allow_all: z.boolean().optional(),
  user_types: z.array(z.string()).optional(),
  accept: z.string().optional(),
  max_size: z.number().optional(),
  multi: z.boolean().optional(),
  max_count: z.number().optional(),
  image_sizes: z.array(imageSizeSchema).optional(),
  list_source: z
    .enum([ListSource.RecordAssociation, ListSource.Hardcoded])
    .optional(),
  date_type: z.string().optional(),
  start_date_offset: z.number().optional(),
  use_current: z.boolean().optional(),
  start_time: z.string().optional(),
  end_date_offset: z.number().optional(),
  end_time: z.string().optional(),
  associated_document: z.string().optional(),
  associated_document_label_field: z.string().optional(),
  list_items: z.array(listItemSchema).optional(),
  default_value: z.any().optional(),
  require_for_user: z.boolean().optional(),
  include_in_activation: z.boolean().optional(),
  hidden: z.boolean().default(false),
  file_type: z.string().optional(),
  number_type: z.string().optional(),
  is_required: z.boolean().optional(),
  is_active: z.boolean().optional(),
  description: z.string().optional(),
});

const fieldsSchema: z.ZodType<DataField> = baseFieldsSchema.extend({
  id: z.string(),
  fields: z.lazy(() => fieldsSchema.array()).optional(),
});

const addAssociatedFieldFormSchema = baseFieldsSchema.extend({
  fields: z.array(fieldsSchema).optional(),
});

export type AddAssociatedFieldFormType = z.infer<
  typeof addAssociatedFieldFormSchema
>;

const AddAssociatedField: React.FC<{
  onBackClick?(): void;
  onSubmit(data: AddAssociatedFieldFormType): void;
  onAddClick?(data: AddAssociatedFieldFormType): void;
  onFieldClick?(field: DataField, data: AddAssociatedFieldFormType): void;
  dataField?: Partial<DataField>;
  allowDefault?: boolean;
  extraFields?: {
    requireForUse?: boolean;
    includeInActivation?: boolean;
    includeHidden?: boolean;
    isActive?: boolean;
    isRequired?: boolean;
    description?: boolean;
  };
}> = (props) => {
  const {
    onBackClick,
    onSubmit,
    onAddClick,
    onFieldClick,
    dataField,
    allowDefault = false,
    extraFields = {},
  } = props;

  const theme = useTheme();
  const refFormActionIsEdit = useRef(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<AddAssociatedFieldFormType>({
    mode: "onBlur",
    resolver: zodResolver(addAssociatedFieldFormSchema),
  });

  const fieldType = watch("type");
  const isEditMode = !!dataField?.id && !!dataField?.type;

  useEffect(() => {
    if (dataField) {
      if (dataField.slug) refFormActionIsEdit.current = true;
      reset(dataField as unknown as any);
    }
  }, [dataField]);

  return (
    <AddNewFieldContainer>
      <SidebarSection
        title="Add New Field"
        rightIcon={false}
        leftIcon={<ArrowBackOutlinedIcon />}
        onLeftIconClick={() => onBackClick?.()}
      >
        <Stack spacing={2.5}>
          <FormField
            label="Field Type"
            error={!!dirtyFields.type ? errors.type : undefined}
          >
            <Controller
              control={control}
              name="type"
              render={({ field }) => {
                return (
                  <TextField
                    {...field}
                    margin="dense"
                    id="type"
                    type="text"
                    fullWidth
                    hiddenLabel
                    size="small"
                    variant="filled"
                    select
                    value={`${field.value}`}
                    disabled={refFormActionIsEdit.current}
                  >
                    {FormElements.map((el) => {
                      const Icon =
                        FieldIcon[el.type as keyof typeof FieldIcon] ||
                        LocalOfferOutlined;
                      return (
                        <MenuItem value={el.type}>
                          <Box display={"flex"}>
                            <Icon sx={{ mr: 1 }} />
                            <Box>{el.name}</Box>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </TextField>
                );
              }}
            />
          </FormField>
          <FormField
            label="Field Title"
            error={!!dirtyFields.title ? errors.title : undefined}
          >
            <TextField
              {...register("title")}
              autoFocus
              margin="dense"
              id="title"
              type="text"
              hiddenLabel
              size="small"
              variant="filled"
              fullWidth
            />
          </FormField>
          <FormField
            label="Field Slug"
            error={!!dirtyFields.slug ? errors.slug : undefined}
          >
            <TextField
              {...register("slug")}
              autoFocus
              margin="dense"
              id="slug"
              type="text"
              fullWidth
              hiddenLabel
              size="small"
              variant="filled"
              disabled={refFormActionIsEdit.current}
            />
          </FormField>
          {extraFields.description && (
            <FormField
              label="Description"
              error={
                !!dirtyFields.description
                  ? (errors.description as FieldError)
                  : undefined
              }
            >
              <TextField
                {...register("description")}
                autoFocus
                margin="dense"
                id="description"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                maxRows={2}
                rows={2}
                fullWidth
                multiline
              />
            </FormField>
          )}
          <FormField
            label="Field Tooltip"
            error={!!dirtyFields.tooltip ? errors.tooltip : undefined}
          >
            <TextField
              {...register("tooltip")}
              autoFocus
              margin="dense"
              id="tooltip"
              type="text"
              fullWidth
              hiddenLabel
              size="small"
              variant="filled"
            />
          </FormField>
          {allowDefault && fieldType !== DocumentElementType.RecordList && (
            <FormField
              label="Default Value"
              error={
                !!dirtyFields.default_value
                  ? (errors.default_value as FieldError)
                  : undefined
              }
            >
              <TextField
                {...register("default_value")}
                autoFocus
                margin="dense"
                id="default_value"
                type="text"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
              />
            </FormField>
          )}
        </Stack>
      </SidebarSection>
      <FieldSettingsContainer>
        <TypeFields
          type={fieldType}
          control={control}
          onAddClick={() => onAddClick?.(getValues())}
          onFieldClick={(field) => onFieldClick?.(field, getValues())}
          watch={watch}
          isEditMode={isEditMode}
        />
      </FieldSettingsContainer>
      {extraFields.requireForUse && (
        <FormField
          label="Require For Use"
          error={
            !!dirtyFields.require_for_user
              ? (errors.require_for_user as FieldError)
              : undefined
          }
        >
          <Controller
            control={control}
            name="require_for_user"
            render={({ field }) => (
              <CheckboxStyled
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value ?? false}
              />
            )}
          />
        </FormField>
      )}
      {extraFields.includeInActivation && (
        <FormField
          label="Include in Activation"
          error={
            !!dirtyFields.include_in_activation
              ? (errors.include_in_activation as FieldError)
              : undefined
          }
        >
          <Controller
            control={control}
            name="include_in_activation"
            render={({ field }) => (
              <CheckboxStyled
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value ?? false}
              />
            )}
          />
        </FormField>
      )}
      {extraFields.includeHidden && (
        <FormField
          label="Hidden"
          error={!!dirtyFields.hidden ? errors.hidden : undefined}
        >
          <Controller
            control={control}
            name="hidden"
            render={({ field }) => (
              <CheckboxStyled
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </FormField>
      )}
      {extraFields.isRequired && (
        <FormField
          label="Required"
          error={
            !!dirtyFields.is_required
              ? (errors.is_required as FieldError)
              : undefined
          }
        >
          <Controller
            control={control}
            name="is_required"
            render={({ field }) => (
              <CheckboxStyled
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value ?? false}
              />
            )}
          />
        </FormField>
      )}
      {extraFields.isActive && (
        <FormField
          label="Active"
          error={
            !!dirtyFields.is_active
              ? (errors.is_active as FieldError)
              : undefined
          }
        >
          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <CheckboxStyled
                onChange={(e) => field.onChange(e.target.checked)}
                checked={field.value ?? false}
              />
            )}
          />
        </FormField>
      )}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => onBackClick?.()}
        >
          Back
        </Button>
        <Button
          color="inherit"
          sx={{
            bgcolor: theme.palette.primary.main,
          }}
          onClick={handleSubmit(onSubmit, (e) => {
            console.error(e);
          })}
        >
          Save
        </Button>
      </CardActions>
    </AddNewFieldContainer>
  );
};

export default AddAssociatedField;
