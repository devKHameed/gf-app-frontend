import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import {
  Box,
  IconButton,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { SortableList } from "components/SortableList";
import { ParameterType } from "enums/3pApp";
import { AnimatePresence, motion } from "framer-motion";
import isArray from "lodash/isArray";
import React, { useEffect, useRef } from "react";
import { useFieldArray } from "react-hook-form";
import { v4 } from "uuid";
import FlowFieldWrapper, { FlowFieldWrapperRef } from "../FlowFieldWrapper";
import { BaseParamFieldProps, ParamField } from "../NodeEditorFields";

type Props = {
  mappable?: boolean;
} & BaseParamFieldProps;

const BoxWrapper = styled(Box)(({ theme }) => ({
  ".SortableItem": {
    marginTop: "0",

    "&:last-child .border-holder:before": {
      // bottom: "10px",
      // top: "0",
    },
  },

  ".add-item": {
    ".border-holder": {
      "&:before": {
        bottom: "10px",
        top: "0",
      },
    },
  },

  ".border-holder": {
    position: "relative",

    "&:hover": {
      "&:before": {
        borderLeftStyle: "solid",
      },

      "&:after": {
        borderTopStyle: "solid",
      },
    },

    "&:before": {
      position: "absolute",
      left: "-12px",
      top: "-4px",
      bottom: "-13px",
      borderLeft: `1px dotted ${theme.palette.primary.main}`,
      content: '""',
      width: "1px",
    },

    "&:after": {
      position: "absolute",
      right: "calc(100% + 2px)",
      top: "10px",
      height: "1px",
      borderTop: `1px dotted ${theme.palette.primary.main}`,
      content: '""',
      width: "9px",
    },
  },
}));

type ArrayListItemProps = {
  label: string;
  onRemoveClick(): void;
  spec: MappableParameter[];
  mappable?: boolean;
  name: string;
  isDragging?: boolean;
  labels?: Record<string, string>;
};

const ArrayListItem: React.FC<ArrayListItemProps> = React.memo(
  (props) => {
    const { onRemoveClick, spec, mappable, name, label, isDragging, labels } =
      props;

    const theme = useTheme();

    const fieldRef = useRef<FlowFieldWrapperRef>();
    const prevCollapsed = useRef<boolean>();

    useEffect(() => {
      if (fieldRef.current) {
        if (isDragging) {
          prevCollapsed.current = fieldRef.current.collapsed;
          fieldRef.current.setCollapsed(true);
        } else {
          fieldRef.current.setCollapsed(prevCollapsed.current ?? false);
        }
      }
    }, [isDragging]);

    return (
      <motion.div
        initial={{ height: 0, opacity: 0, scaleY: 0 }}
        animate={{ height: "auto", opacity: 1, scaleY: 1 }}
        exit={{ height: 0, opacity: 0, scaleY: 0 }}
        style={{ position: "relative", transformOrigin: "top" }}
        className="animated-block"
      >
        <Box className="border-holder" sx={{ mb: 2.25 }}>
          <FlowFieldWrapper
            label={label}
            ref={fieldRef}
            extra={
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                <SortableList.DragHandle>
                  <IconButton sx={{ p: 0 }}>
                    <DragIndicatorOutlinedIcon
                      sx={{ color: theme.palette.primary.main }}
                      fontSize="small"
                    />
                  </IconButton>
                </SortableList.DragHandle>
                <IconButton sx={{ p: 0 }} onClick={onRemoveClick}>
                  <CloseOutlinedIcon
                    sx={{ color: theme.palette.primary.main }}
                    fontSize="small"
                  />
                </IconButton>
              </Stack>
            }
          >
            {spec?.length === 0 && (
              <Box sx={{ ml: 2.5 }}>
                <ParamField
                  field={{
                    type: ParameterType.Text,
                    label: labels?.field ?? "Value",
                    name: "value",
                  }}
                  mappable={mappable}
                  parentNamePath={name}
                />
              </Box>
            )}
            {spec.map((specField) => (
              <Box sx={{ ml: 2.5 }}>
                <ParamField
                  key={specField.name}
                  field={specField}
                  mappable={mappable}
                  parentNamePath={name}
                />
              </Box>
            ))}
          </FlowFieldWrapper>
        </Box>
      </motion.div>
    );
  },
  (prev, next) =>
    prev.name === next.name &&
    prev.spec === next.spec &&
    prev.mappable === next.mappable &&
    prev.label === next.label &&
    prev.isDragging === next.isDragging
);

const ArrayFields: React.FC<Props> = (props) => {
  const { field, mappable, control, parentNamePath, watch } = props;
  const { name: fieldName, spec: fieldSpec, labels } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;
  const spec = React.useMemo(
    () => (isArray(fieldSpec) ? fieldSpec : [fieldSpec]).filter(Boolean),
    [fieldSpec]
  );

  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name,
  });

  const set = useRef<boolean>();

  const arrayData = watch(name);

  useEffect(() => {
    if (!set.current && arrayData && arrayData?.length > 0) {
      replace(arrayData);
      set.current = true;
    }
  }, [arrayData]);

  const handleAddClick = () => {
    const index = fields.length;
    append({
      id: v4(),
      _label:
        !isArray(fieldSpec) && fieldSpec
          ? `${fieldSpec.label} ${index + 1}`
          : `Item ${index + 1}`,
    });
  };

  return (
    <Box sx={{ ml: 2.5, position: "relative" }}>
      <BoxWrapper>
        <AnimatePresence>
          <SortableList
            items={fields || []}
            onMove={(activeIndex, overIndex) => {
              move(activeIndex, overIndex);
            }}
            strategy={verticalListSortingStrategy}
            dndContextProps={{
              modifiers: [restrictToVerticalAxis],
            }}
            renderItem={({ id, ...item }, index) => (
              <SortableList.Item id={id} handle>
                {({ isDragging }) => {
                  return (
                    <ArrayListItem
                      label={(item as any)._label}
                      spec={spec}
                      mappable={mappable}
                      name={`${name}.${index}`}
                      onRemoveClick={() => {
                        remove(index);
                      }}
                      isDragging={isDragging}
                      labels={labels}
                    />
                  );
                }}
              </SortableList.Item>
            )}
          />
        </AnimatePresence>
        <Box className="add-item">
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: "-4px" }}
            className="border-holder"
          >
            <IconButton sx={{ p: 0, ml: "-3px" }} onClick={handleAddClick}>
              <AddBoxIcon sx={{ fontSize: 20, color: "#4b4a4f" }} />
            </IconButton>
            <Typography
              variant="body2"
              onClick={handleAddClick}
              sx={{ cursor: "pointer" }}
            >
              {labels?.add ? labels.add : "Add item"}
            </Typography>
          </Stack>
        </Box>
      </BoxWrapper>
    </Box>
  );
};

export default ArrayFields;
