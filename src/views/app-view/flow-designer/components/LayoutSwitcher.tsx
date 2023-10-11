import { Button, ButtonGroup, styled } from "@mui/material";
import FlowFree from "assets/icons/FlowFree";
import FlowVert from "assets/icons/FlowVert";
import React, { useState } from "react";

const StyledButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-contained": {
    backgroundColor: theme.palette.primary.shades?.["30p"],
  },
}));

export type FlowLayout = "horizontal" | "vertical" | "free";

type Props = {
  onChange?(value: FlowLayout): void;
};

const LayoutSwitcher: React.FC<Props> = (props) => {
  const { onChange } = props;

  const [selectedLayout, setSelectedLayout] = useState<FlowLayout>("vertical");

  const handleClick = (value: FlowLayout) => {
    onChange?.(value);
    setSelectedLayout(value);
  };

  return (
    <ButtonGroup size="small">
      {/* <StyledButton
        key="horizontal"
        variant={selectedLayout === "horizontal" ? "contained" : "outlined"}
        onClick={() => handleClick("horizontal")}
      >
        <FlowHoriz />
      </StyledButton> */}
      <StyledButton
        key="vertical"
        variant={selectedLayout === "vertical" ? "contained" : "outlined"}
        onClick={() => handleClick("vertical")}
      >
        <FlowVert />
      </StyledButton>
      <StyledButton
        key="free"
        variant={selectedLayout === "free" ? "contained" : "outlined"}
        onClick={() => handleClick("free")}
      >
        <FlowFree />
      </StyledButton>
    </ButtonGroup>
  );
};

export default LayoutSwitcher;
