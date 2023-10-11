import TranscriptionProvider from "contexts/TranscriptionContext";
import TranscriptionEditor from "./TranscriptionEditor";

type Props = {};

const Index = (props: Props) => {
  return (
    <TranscriptionProvider>
      <TranscriptionEditor />
    </TranscriptionProvider>
  );
};

export default Index;
