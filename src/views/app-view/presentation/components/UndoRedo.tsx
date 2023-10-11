import { ListItem, ListItemIcon } from "@mui/material";
import Redo from "assets/icons/Redo";
import Undo from "assets/icons/Undo";
import useWorkHistory from "../hook/useWorkHistory";

type Props = {};

const UndoRedo = (props: Props) => {
  const { goToPast, goToFuture } = useWorkHistory();
  return (
    <>
      <ListItem>
        <ListItemIcon onClick={goToPast}>
          <Undo sx={{ width: "16px" }} />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon onClick={goToFuture}>
          <Redo sx={{ width: "16px" }} />
        </ListItemIcon>
      </ListItem>
    </>
  );
};

export default UndoRedo;
