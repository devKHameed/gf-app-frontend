import {
  TranscriptionContext,
  TranscriptionContextType,
} from "contexts/TranscriptionContext";
import { useContext } from "react";

// ----------------------------------------------------------------------

const useTranscriptionRef = () =>
  useContext(TranscriptionContext) as TranscriptionContextType;

export default useTranscriptionRef;
