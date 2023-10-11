import useOpenClose from "hooks/useOpenClose";
import React from "react";

const OpenCloseElement = ({
  children,
}: {
  children: (_: {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
  }) => React.ReactElement;
}) => {
  const [open, onOpen, onClose] = useOpenClose();
  return <React.Fragment>{children({ open, onOpen, onClose })}</React.Fragment>;
};

export default OpenCloseElement;
