import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import Scrollbar from "components/Scrollbar";
import React, { useEffect, useState } from "react";
import { useModalOpenStore } from "store/stores/presentation/modal";
import useStyleSelector from "../hook/useStyleSelector";

const PopUpFrame = styled(Stack)(({ theme }) => ({
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
}));

const PopUpWrapper = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.GFTopNav,
  padding: "15px",
  gap: "10px",
  maxWidth: "400px",
  width: "100%",
}));

type Props = {};
const useStore = createSelectorFunctions(useModalOpenStore);

const HyperLinkModal: React.FC<Props> = (props: any) => {
  const store = useStore();
  const [hyperLinkValue, setHyperLinkValue] = useState({
    text: "",
    url: "",
  });
  useEffect(() => {
    if (!!store?.items) {
      setHyperLinkValue(() => {
        return {
          text: store?.items?.text,
          url: store?.items?.url,
        };
      });
    }
  }, []);
  const { onUpdateHyperLink } = useStyleSelector();
  const handleChange = (e: any, field: string) => {
    setHyperLinkValue((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  return (
    <Dialog
      open={store.isOpen}
      onClose={() => store.setIsModalOpen(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <DialogTitle>Edit Link</DialogTitle>
      <Scrollbar className='form-scroller'>
        <DialogContent>
          <Stack direction='column' spacing={1} component='form'>
            <TextField
              size='small'
              variant='filled'
              placeholder='Name'
              value={hyperLinkValue.text}
              onChange={(e) => handleChange(e, "text")}
            />
            <TextField
              size='small'
              variant='filled'
              placeholder='URL'
              value={hyperLinkValue.url}
              onChange={(e) => handleChange(e, "url")}
            />
          </Stack>
        </DialogContent>
      </Scrollbar>

      <DialogActions>
        <LoadingButton
          onClick={() => {
            store.setIsModalOpen(false);
          }}
        >
          Cancel
        </LoadingButton>
        <LoadingButton
          variant='contained'
          onClick={() => {
            store.setIsModalOpen(false);
            onUpdateHyperLink(hyperLinkValue);
          }}
        >
          Update Link
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
export default HyperLinkModal;
