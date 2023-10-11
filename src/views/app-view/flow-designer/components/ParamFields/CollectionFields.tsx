import { Box } from "@mui/material";
import isArray from "lodash/isArray";
import React from "react";
import { BaseParamFieldProps, ParamField } from "../NodeEditorFields";

type Props = {
  mappable?: boolean;
} & BaseParamFieldProps;

const CollectionFields: React.FC<Props> = (props) => {
  const { field, mappable, parentNamePath } = props;
  const name = parentNamePath ? `${parentNamePath}.${field.name}` : field.name;

  return (
    <Box sx={{ ml: 2.5 }}>
      {(isArray(field.spec) ? field.spec : [field.spec])
        .filter(Boolean)
        .map((specField) => (
          <ParamField
            key={specField.name}
            field={specField}
            mappable={mappable}
            parentNamePath={name}
          />
        ))}
    </Box>
  );
};

export default CollectionFields;
