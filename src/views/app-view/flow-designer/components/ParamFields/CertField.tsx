import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Controller } from "react-hook-form";
import FlowFieldWrapper from "../FlowFieldWrapper";
import FlowPopover, { FlowPopoverRef } from "../FlowPopover";
import { BaseParamFieldProps } from "../NodeEditorFields";

type ExtractFieldsRef = {
  formData?: {
    extractType?: "cert" | "pkey";
    file?: File;
    password?: string;
  };
};

const ExtractFields = forwardRef<
  ExtractFieldsRef | undefined,
  { type: "cert" | "pkey" }
>((props, ref) => {
  const { type } = props;
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<ExtractFieldsRef["formData"]>({
    extractType: type,
  });

  useImperativeHandle(ref, () => ({
    formData,
  }));

  return (
    <Box>
      <FlowFieldWrapper label="Extract">
        <Select
          fullWidth
          size="small"
          id="extract-select"
          defaultValue="cert"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              extractType: e.target.value as "cert" | "pkey",
            }))
          }
        >
          <MenuItem key="cert" value="cert">
            Certificate
          </MenuItem>
          <MenuItem key="pkey" value="pkey">
            Private Key
          </MenuItem>
        </Select>
      </FlowFieldWrapper>
      <FlowFieldWrapper label="P12, PFX or PEM file">
        <TextField
          type="file"
          size="small"
          fullWidth
          variant="filled"
          onChange={(e: any) => {
            setFormData((prev) => ({
              ...prev,
              file: e.target.files?.[0],
            }));
          }}
        />
      </FlowFieldWrapper>
      <FlowFieldWrapper label="Password">
        <TextField
          type={showPassword ? "text" : "password"}
          size="small"
          fullWidth
          variant="filled"
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ height: "100%" }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(event) => event.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FlowFieldWrapper>
    </Box>
  );
});

type CertFieldProps = {
  type: "cert" | "pkey";
} & BaseParamFieldProps;

const CertField: React.FC<CertFieldProps> = (props) => {
  const { field, type, control, parentNamePath, setValue } = props;
  const { name: fieldName } = field;

  const name = parentNamePath ? `${parentNamePath}.${fieldName}` : fieldName;

  const extractFieldRef = useRef<ExtractFieldsRef>();
  const flowPopoverRef = useRef<FlowPopoverRef>();

  const handleSaveClick = () => {
    const data = extractFieldRef.current?.formData;

    if (!data) {
      // TODO: show error
      return;
    }

    if (!data.extractType || !data.file) {
      // TODO: show error
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      setValue(name, e.target?.result);
      flowPopoverRef.current?.close();
    };

    fileReader.readAsText(data.file);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            value={field.value || ""}
            variant="filled"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ height: "100%" }}>
                  <FlowPopover
                    ref={flowPopoverRef}
                    onSaveClick={handleSaveClick}
                    content={
                      <Box sx={{ p: 2 }}>
                        <ExtractFields type={type} ref={extractFieldRef} />
                      </Box>
                    }
                    containerProps={{
                      title: "Create a connection",
                    }}
                    // onSaveClick={handleSubmit}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      sx={{ p: "0", minWidth: "inherit" }}
                    >
                      Extract
                    </Button>
                  </FlowPopover>
                </InputAdornment>
              ),
            }}
          />
        );
      }}
    />
  );
};

export default CertField;
