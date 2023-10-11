import PresentationProvider from "contexts/PresentationContext";
import Presentation from "./Presentation";

type Props = {};

const Index = (props: Props) => {
  return (
    <PresentationProvider>
      <Presentation />
    </PresentationProvider>
  );
};

export default Index;
