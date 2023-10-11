import {
  Calendar,
  CheckBox,
  Code,
  FiberSmartRecord,
  File,
  Image,
  Label,
  Number as NumberIcon,
  Play,
  Progress,
  RadioList,
  Rating,
  RecordList,
  SelectList,
  TextArea,
  TextFields,
  User,
  UserType,
} from "assets/icons";
import { DocumentElementType } from "enums/Form";

const FieldIcon = {
  [DocumentElementType.Checkbox]: CheckBox,
  [DocumentElementType.CodeEditor]: Code,
  [DocumentElementType.SubRecord]: FiberSmartRecord,
  [DocumentElementType.File]: File,
  [DocumentElementType.Label]: Label,
  [DocumentElementType.Number]: NumberIcon,
  [DocumentElementType.AudioVideo]: Play,
  [DocumentElementType.Progress]: Progress,
  [DocumentElementType.Radio]: RadioList,
  [DocumentElementType.Rating]: Rating,
  [DocumentElementType.RecordList]: RecordList,
  [DocumentElementType.Select]: SelectList,
  [DocumentElementType.TextArea]: TextArea,
  [DocumentElementType.TextField]: TextFields,
  [DocumentElementType.User]: User,
  [DocumentElementType.UserType]: UserType,
  [DocumentElementType.Date]: Calendar,
  [DocumentElementType.Image]: Image,
};

export default FieldIcon;
