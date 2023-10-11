import AddIcon from "@mui/icons-material/Add";
import MFab, { FabProps } from "@mui/material/Fab";

type Props = FabProps;

const Fab = (props: Props) => {
  return (
    <MFab color="primary" aria-label="add" {...props}>
      <AddIcon />
    </MFab>
  );
};

export default Fab;
