type Transcript = {
  transcript: string;
};

type SgmentsItem = {
  start_time: string;
  speaker_label: string;
  end_time: string;
};
type SpeakerSegment = {
  start_time: string;
  speaker_label: string;
  end_time: string;
  items: SgmentsItem[];
};
type Alternative = {
  confidence: string;
  content: string;
};
type AlternativeContent = {
  start_time: string;
  speaker_label: string;
  end_time: string;
  alternatives: Alternative[];
  index: number;
  id?: string;
  type: string;
  content?: string;
};
type items = {
  start_time: string;
  speaker_label: string;
  end_time: string;
  alternatives: Alternative[];
  index: number;
  id?: string;
  type: string;
  content?: string;
};
type SpeakerLabels = {
  channel_label: string;
  speakers: number;
  segments: SpeakerSegment[];
};

type Result = {
  transcripts: Transcript[];
  speaker_labels: SpeakerLabels;
  items: items[];
};

type TranscriptionsData = {
  jobName: string;
  accountId: string;
  results: Result;
  status: string;
};
