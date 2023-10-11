import { useMemo, useState } from "react";

import useTranscriptionRef from "./useTranscriptionRef";
interface Props extends Partial<WFPlayer> {
  url: string;
}
const useWFPlayer = (
  containerRef: React.RefObject<HTMLDivElement>,
  options: Props
): WFPlayer | null => {
  const [wavesurfer, setWavesurfer] = useState<WFPlayer | null>(null);
  const { waveSurferRef } = useTranscriptionRef();

  const wfPlayerProps = useMemo(() => {
    return options;
  }, [options]);
  const ctnRef = useMemo(() => {
    return containerRef;
  }, [containerRef?.current]);

  // useEffect(() => {
  //   if (!containerRef.current || !options?.url) return;
  //   const wf = new WFPlayer({
  //     ...wfPlayerProps.config,
  //     container: ctnRef?.current as HTMLDivElement,
  //   });

  //   if (!!wf) {
  //     wf?.load(wfPlayerProps?.url);
  //     waveSurferRef.current = wf;
  //     setWavesurfer(wf);
  //     wf?.on("grabbing", (currentTime: any) => {
  //       wf?.seek(currentTime);
  //       console.log(wf);
  //     });
  //   }
  //   return () => {
  //     wf?.destroy();
  //   };
  // }, [wfPlayerProps?.url, ctnRef?.current]);

  return wavesurfer;
};
export default useWFPlayer;
