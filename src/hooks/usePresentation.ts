import {
  PresentationContext,
  PresentationContextType,
} from "contexts/PresentationContext";
import { useContext } from "react";

// ----------------------------------------------------------------------

const usePresentation = () =>
  useContext(PresentationContext) as PresentationContextType;

export default usePresentation;
