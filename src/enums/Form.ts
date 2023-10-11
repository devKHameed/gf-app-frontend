export enum DocumentElementType {
  Label = "label",
  TextField = "text-field",
  TextArea = "textarea",
  Checkbox = "checkbox",
  Radio = "radio",
  Select = "select",
  Date = "date",
  Progress = "progress-display",
  CodeEditor = "code-editor",
  File = "file",
  Image = "image",
  AudioVideo = "audio_video",
  Location = "location",
  Number = "input-number",
  User = "user-select",
  UserType = "user-type",
  Rating = "rating",
  SubRecord = "sub-record",
  RecordList = "record-list",
  Boolean = "boolean",
  Color = "color",
}

export enum DateType {
  DateOnly = "Date Only",
  TimeOnly = "Time Only",
  DateTime = "Date Time",
}
export const DocumentElementTypeArray = Object.keys(DocumentElementType).map(
  (i) => DocumentElementType[i as keyof typeof DocumentElementType]
);

export enum ListSource {
  Hardcoded = "hardcoded",
  RecordAssociation = "record_association",
}
export enum SelectTypes {
  Single = "single_drop_down",
  Multiple = "multi_drop_down",
}

export const ValidationMessages = {
  required: "This field is required.",
};
