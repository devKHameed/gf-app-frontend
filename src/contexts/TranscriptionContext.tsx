import { createContext, useCallback, useRef, useState } from "react";
export type TranscriptionContextType = {
  waveSurferRef: React.MutableRefObject<WFPlayer | null>;
  totalDuration: number;
  setTotalDuration: (isloaded: number) => any;
};
const TranscriptionContext = createContext<Partial<TranscriptionContextType>>(
  {}
);
const TranscriptionProvider = ({ children }: any) => {
  const wavesurfer = useRef<WFPlayer | null>(null);
  const [totalDuration, setDuration] = useState(0);
  const setTotalDuration = useCallback(
    (duration: number) => {
      setDuration(duration);
    },
    [setDuration]
  );
  return (
    <TranscriptionContext.Provider
      value={{
        waveSurferRef: wavesurfer,
        totalDuration,
        setTotalDuration,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
export { TranscriptionContext };
export default TranscriptionProvider;
