import React from "react";

import GuiSidebar from "./GuiSidebar";

const DatacardDesignSetting = ({
  disableScrollbar,
}: {
  disableScrollbar?: boolean;
}) => {
  return (
    <React.Fragment>
      <GuiSidebar />,
    </React.Fragment>
  );
};

export default DatacardDesignSetting;
