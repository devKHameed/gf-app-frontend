import { useCallback, useState } from "react";

const useOpenClose = (
  d: any = false
): [boolean, () => void, () => void, () => void] => {
  const [open, setOpen] = useState(d);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen(!open), []);
  return [open, onOpen, onClose, onToggle];
};

export default useOpenClose;
