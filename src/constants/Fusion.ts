import { ModuleType, ParameterType } from "enums/3pApp";
import { FusionType, ScheduleType, SystemModuleType } from "enums/Fusion";
import moment from "moment";
import { getOpenIteratorOptions } from "utils";

export const WIDGET_START_NODE_MODULE = "widget-start-operator";
export const SYSTEM_NODE_APP = "system";

export const NODE_WIDTH = 100;
export const NODE_HEIGHT = 100;
export const RANK_SEP = 85;

export const FUSION_TYPE_OPTIONS = [
  {
    label: "Core",
    value: FusionType.Core,
  },
  {
    label: "Skills",
    value: FusionType.Skills,
  },
];

export const WeekDayOptions = moment.weekdays().map((day, idx) => ({
  label: day,
  value: `${idx}`,
}));

export const DateOptions = Array(31)
  .fill(null)
  .map((_, idx) => ({
    label: `${idx + 1}`,
    value: `${idx + 1}`,
  }));

export const MonthOptions = moment.months().map((month, idx) => ({
  label: month,
  value: `${idx}`,
}));

export const WidgetEditorFields: { [key: string]: MappableParameter[] } = {
  stat: [
    {
      name: "value",
      label: "Value",
      type: ParameterType.Text,
    },
    {
      name: "status",
      label: "Status",
      type: ParameterType.Number,
    },
    {
      name: "subtitle",
      label: "Subtitle",
      type: ParameterType.Text,
    },
  ],
  pie: [
    {
      name: "dataset",
      label: "Dataset",
      type: ParameterType.Text,
    },
    {
      name: "label_key",
      label: "Labels Key",
      type: ParameterType.Text,
    },
    {
      name: "data_keys",
      label: "Data Key",
      type: ParameterType.Array,
      labels: {
        field: "key",
      },
    },
  ],
  bar: [
    {
      name: "dataset",
      label: "Dataset",
      type: ParameterType.Text,
    },
    {
      name: "label_key",
      label: "Labels Key",
      type: ParameterType.Text,
    },
    {
      name: "data_keys",
      label: "Data Key",
      type: ParameterType.Array,
      labels: {
        field: "key",
      },
    },
  ],
  line: [
    {
      name: "dataset",
      label: "Dataset",
      type: ParameterType.Text,
    },
    {
      name: "label_key",
      label: "Labels Key",
      type: ParameterType.Text,
    },
    {
      name: "data_keys",
      label: "Data Key",
      type: ParameterType.Array,
      labels: {
        field: "key",
      },
    },
  ],
};

export const WebhookResponseFieldsSpec: MappableParameter[] = [
  {
    name: "status",
    type: ParameterType.UInteger,
    label: "Status",
    default: 200,
    help: "Must be higher than or equal to 100.",
    validation: {
      min: 100,
    },
  },
  {
    name: "body",
    type: ParameterType.Text,
    label: "Body",
    // spec: [
    //   {
    //     name: 'key',
    //     label: 'Key',
    //     type: ParameterType.Text,
    //     required: true,
    //     help: 'Must be at most 256 characters long.',
    //     validation: {
    //       max: 256,
    //     },
    //   },
    //   {
    //     name: 'value',
    //     label: 'Value',
    //     type: ParameterType.Text,
    //     required: true,
    //     help: 'Must be at most 4096 characters long.',
    //     validation: {
    //       max: 4096,
    //     },
    //   },
    // ],
  },
  {
    name: "headers",
    type: ParameterType.Array,
    label: "Custom Headers",
    spec: [
      {
        name: "key",
        label: "Key",
        type: ParameterType.Text,
        required: true,
        help: "Must be at most 256 characters long.",
        validation: {
          max: 256,
        },
      },
      {
        name: "value",
        label: "Value",
        type: ParameterType.Text,
        required: true,
        help: "Must be at most 4096 characters long.",
        validation: {
          max: 4096,
        },
      },
    ],
    help: "Can contain at most 16 item(s).",
  },
];

export const SendMessageFields: MappableParameter[] = [
  {
    name: "type",
    type: ParameterType.Select,
    label: "Type",
    options: [
      { value: "all", label: "All Subscribers" },
      {
        value: "specific",
        label: "Specific Subscribers",
        nested: [
          {
            name: "subscribers",
            label: "Subscribers",
            type: ParameterType.Array,
            labels: {
              field: "Subscriber ID",
            },
          },
        ],
      },
    ],
  },
  {
    name: "message",
    type: ParameterType.Text,
    label: "Message",
    required: true,
  },
];

export const SubscriberFields: MappableParameter[] = [
  {
    name: "user_id",
    type: ParameterType.Text,
    label: "User ID",
    required: true,
  },
];

export const RestClientFields: MappableParameter[] = [
  {
    name: "method",
    type: ParameterType.Select,
    label: "Method",
    options: [
      { value: "get", label: "GET" },
      { value: "put", label: "PUT" },
      { value: "post", label: "POST" },
      { value: "delete", label: "DELETE" },
      { value: "patch", label: "PATCH" },
    ],
    default: "get",
    required: true,
  },
  {
    name: "url",
    type: ParameterType.Url,
    label: "URL",
    required: true,
  },
  {
    name: "headers",
    type: ParameterType.Array,
    label: "Custom Headers",
    spec: [
      {
        name: "key",
        label: "Key",
        type: ParameterType.Text,
      },
      {
        name: "value",
        label: "Value",
        type: ParameterType.Text,
      },
    ],
  },
  {
    name: "body",
    type: ParameterType.JSON,
    label: "Body",
  },
];

export const SetVariableFields: MappableParameter[] = [
  {
    name: "name",
    type: ParameterType.Text,
    label: "Name",
    required: true,
  },
  {
    name: "value",
    type: ParameterType.Text,
    label: "Value",
    required: true,
  },
];

export const GetVariableFields: MappableParameter[] = [
  {
    name: "name",
    type: ParameterType.Text,
    label: "Name",
    required: true,
  },
];

export const SetMultipleVariableFields: MappableParameter[] = [
  {
    name: "variables",
    type: ParameterType.Array,
    label: "Variables",
    spec: [
      {
        name: "name",
        type: ParameterType.Text,
        label: "Name",
        required: true,
      },
      {
        name: "value",
        type: ParameterType.Text,
        label: "Value",
        required: true,
      },
    ],
  },
];

export const GetMultipleVariableFields: MappableParameter[] = [
  {
    name: "variables",
    type: ParameterType.Array,
    label: "Variables",
  },
];

export const ArrayIteratorFields: MappableParameter[] = [
  {
    name: "array",
    type: ParameterType.Text,
    label: "Array",
    required: true,
  },
];

export const ArrayAggregatorFields: MappableParameter[] = [
  {
    name: "iterator_slug",
    type: ParameterType.Select,
    label: "Source Iterator",
    required: true,
    options: getOpenIteratorOptions,
  },
  {
    name: "aggregated_fields",
    type: ParameterType.Custom,
    label: "Aggregated Fields",
  },
];

export const LoopFields: MappableParameter[] = [
  // {
  //   name: "iterator_slug",
  //   type: ParameterType.Select,
  //   label: "Source Iterator",
  //   required: true,
  //   options: getOpenIteratorOptions,
  // },
];

export const MapChartDataFields: MappableParameter[] = [
  {
    name: "data",
    type: ParameterType.Text,
    label: "Data",
    required: true,
  },
  {
    name: "keys",
    type: ParameterType.Array,
    label: "Data Arrays To Map",
    required: true,
    labels: {
      field: "Array Key",
    },
  },
  {
    name: "property",
    type: ParameterType.Text,
    label: "Data Property To Map",
    required: true,
  },
];

export const SocialMediaAutomationFields: {
  [SystemModuleType.GetNextTask]: MappableParameter[];
  [SystemModuleType.CompleteTask]: MappableParameter[];
} = {
  [SystemModuleType.GetNextTask]: [
    {
      name: "account_id",
      type: ParameterType.Text,
      label: "Account ID",
      required: true,
    },
  ],
  [SystemModuleType.CompleteTask]: [
    {
      name: "task_id",
      type: ParameterType.Text,
      label: "Task ID",
      required: true,
    },
    {
      name: "device_id",
      type: ParameterType.Text,
      label: "Device ID",
    },
    {
      name: "task_status",
      type: ParameterType.Text,
      label: "Task Status",
    },
    {
      name: "task_results",
      type: ParameterType.Text,
      label: "Task Results",
    },
  ],
};

export const TriggerFusionFields: MappableParameter[] = [];
export const AskQuestionFields: MappableParameter[] = [
  {
    name: "question_type",
    type: ParameterType.Select,
    label: "Question Type",
    options: [
      {
        label: "Open-Ended",
        value: "open_ended",
        nested: [
          {
            name: "question",
            type: ParameterType.Text,
            label: "Question",
            multiline: true,
          },
        ],
      },
      {
        label: "Yes/No",
        value: "yes_no",
        nested: [
          {
            name: "question",
            type: ParameterType.Text,
            label: "Question",
          },
        ],
      },
      {
        label: "Single Item from List",
        value: "single_item_from_list",
        nested: [
          {
            name: "question",
            type: ParameterType.Text,
            label: "Question",
          },
          {
            name: "options",
            type: ParameterType.Array,
            label: "Options",
            spec: {
              label: "Option",
              type: ParameterType.Text,
              required: true,
              name: "value",
            },
          },
        ],
      },
      {
        label: "Multiple Items from List",
        value: "multiple_items_from_list",
        nested: [
          {
            name: "question",
            type: ParameterType.Text,
            label: "Question",
          },
          {
            name: "options",
            type: ParameterType.Array,
            label: "Options",
            spec: {
              label: "Option",
              type: ParameterType.Text,
              required: true,
              name: "value",
            },
          },
        ],
      },
    ],
  },
];
export const CollectSlotsFields: MappableParameter[] = [
  {
    name: "slots",
    type: ParameterType.Array,
    label: "Slots",
    spec: [
      {
        name: "name",
        type: ParameterType.Text,
        label: "Name",
      },
      {
        name: "slug",
        type: ParameterType.Text,
        label: "Slug",
      },
      {
        name: "description",
        type: ParameterType.Text,
        label: "Description",
      },
      {
        name: "input_type",
        type: ParameterType.Select,
        label: "Input Type",
        options: [
          {
            label: "Strict",
            value: "strict",
          },
          {
            label: "Open",
            value: "open",
          },
        ],
      },
      {
        name: "required",
        type: ParameterType.Boolean,
        label: "Required",
        default: false,
        required: true,
      },
      {
        name: "parent_slug",
        type: ParameterType.Text,
        label: "Parent Slug",
      },
      {
        name: "enable_multiple_answers",
        type: ParameterType.Boolean,
        label: "Enable Multiple Answers",
        default: false,
        required: true,
      },
      {
        name: "options",
        type: ParameterType.Array,
        label: "Options",
        spec: [
          {
            name: "value",
            type: ParameterType.Text,
            label: "Option",
          },
        ],
      },
    ],
  },
];

export const CreateJobFields: MappableParameter[] = [
  {
    name: "title",
    type: ParameterType.Text,
    label: "Title",
  },
  {
    name: "note",
    type: ParameterType.Text,
    label: "Note",
  },
  {
    name: "html",
    type: ParameterType.Code,
    label: "HTML",
    mode: "html",
  },
  {
    name: "css",
    type: ParameterType.Code,
    label: "CSS",
    mode: "css",
  },
  {
    name: "js",
    type: ParameterType.Code,
    label: "JavaScript",
    mode: "javascript",
  },
];

export const UpdateDisplayFields: MappableParameter[] = [
  {
    name: "js",
    type: ParameterType.Code,
    label: "JavaScript",
    mode: "javascript",
  },
  {
    name: "html",
    type: ParameterType.Code,
    label: "HTML",
    mode: "html",
  },
  {
    name: "css",
    type: ParameterType.Code,
    label: "CSS",
    mode: "css",
  },
  {
    name: "libraries",
    type: ParameterType.Array,
    label: "Libraries",
    spec: [
      {
        name: "url",
        type: ParameterType.Text,
        label: "Url",
      },
    ],
  },
  {
    name: "gfml_inputs",
    type: ParameterType.Array,
    label: "GFML Inputs",
    spec: [
      {
        name: "input",
        type: ParameterType.Text,
        label: "GFML",
      },
    ],
  },
];

export const ChargeCreditFields: MappableParameter[] = [
  {
    name: "title",
    type: ParameterType.Text,
    label: "Title",
  },
  {
    name: "description",
    type: ParameterType.Text,
    label: "Description",
  },
  {
    name: "chits",
    type: ParameterType.UInteger,
    label: "Chits",
    // TODO: apply validation for upto 4 decimal places
  },
];
export const Search3PListFields: MappableParameter[] = [
  {
    name: "keywords",
    type: ParameterType.Array,
    label: "Keywords",
    spec: [
      {
        name: "keyword",
        type: ParameterType.Text,
        label: "Keyword",
      },
    ],
  },
];

export const GetTemporaryS3LinkFields: MappableParameter[] = [
  {
    name: "s3_file_key",
    type: ParameterType.Text,
    label: "S3 File Key",
    required: true,
  },
];

export const SplitAudioFields = [
  {
    name: "audio_filename",
    type: ParameterType.Filename,
    label: "Audio File Name",
    semantic: "file:name",
  },
  {
    name: "file_data",
    type: ParameterType.Buffer,
    label: "Audio Data",
    semantic: "file:data",
  },
  {
    name: "start_time",
    type: ParameterType.Text,
    label: "Start Time",
  },
  {
    name: "end_time",
    type: ParameterType.Text,
    label: "End Time",
  },
];

export const RunPodExtractFacesFields: MappableParameter[] = [
  {
    name: "filename",
    type: ParameterType.Filename,
    label: "File Name",
    semantic: "file:name",
  },
  {
    name: "file_data",
    type: ParameterType.Buffer,
    label: "Audio Data",
    semantic: "file:data",
  },
];

export const DeleteTranscriptionJobFields: MappableParameter[] = [
  {
    name: "job_name",
    type: ParameterType.Text,
    label: "Job Name",
  },
];

export const GetTranscriptionJobFields: MappableParameter[] = [
  {
    name: "job_name",
    type: ParameterType.Text,
    label: "Job Name",
  },
];

export const ListTranscriptionJobs: MappableParameter[] = [
  {
    name: "max_results",
    type: ParameterType.UInteger,
    label: "Max Results",
  },
  {
    name: "job_name_contains",
    type: ParameterType.Text,
    label: "Job Name Contains",
  },
  {
    name: "job_status",
    type: ParameterType.Select,
    label: "Job Status",
    options: [
      {
        value: "COMPLETED",
        label: "COMPLETED",
      },
      {
        value: "FAILED",
        label: "FAILED",
      },
      {
        value: "IN_PROGRESS",
        label: "IN_PROGRESS",
      },
    ],
  },
];

export const CreateTranscriptionJobFields: MappableParameter[] = [
  {
    name: "job_name",
    type: ParameterType.Text,
    label: "Job Name",
  },
  {
    name: "file_url",
    type: ParameterType.Url,
    label: "Media File URI",
  },
  {
    name: "language_code",
    options: [
      {
        value: "af-ZA",
        label: "Afrikaans (South Africa)",
      },
      {
        value: "ar-AE",
        label: "Arabic (UAE)",
      },
      {
        value: "ar-SA",
        label: "Arabic (Saudi Arabia)",
      },
      {
        value: "da-DK",
        label: "Danish (Denmark)",
      },
      {
        value: "de-CH",
        label: "German (Switzerland)",
      },
      {
        value: "de-DE",
        label: "German (Germany)",
      },
      {
        value: "en-AB",
        label: "English (Alberta)",
      },
      {
        value: "en-AU",
        label: "English (Australia)",
      },
      {
        value: "en-GB",
        label: "English (United Kingdom)",
      },
      {
        value: "en-IE",
        label: "English (Ireland)",
      },
      {
        value: "en-IN",
        label: "English (India)",
      },
      {
        value: "en-US",
        label: "English (United States)",
      },
      {
        value: "en-WL",
        label: "English (Wales)",
      },
      {
        value: "es-ES",
        label: "Spanish (Spain)",
      },
      {
        value: "es-US",
        label: "Spanish (United States)",
      },
      {
        value: "fa-IR",
        label: "Persian (Iran)",
      },
      {
        value: "fr-CA",
        label: "French (Canada)",
      },
      {
        value: "fr-FR",
        label: "French (France)",
      },
      {
        value: "he-IL",
        label: "Hebrew (Israel)",
      },
      {
        value: "hi-IN",
        label: "Hindi (India)",
      },
      {
        value: "id-ID",
        label: "Indonesian (Indonesia)",
      },
      {
        value: "it-IT",
        label: "Italian (Italy)",
      },
      {
        value: "ja-JP",
        label: "Japanese (Japan)",
      },
      {
        value: "ko-KR",
        label: "Korean (South Korea)",
      },
      {
        value: "ms-MY",
        label: "Malay (Malaysia)",
      },
      {
        value: "nl-NL",
        label: "Dutch (Netherlands)",
      },
      {
        value: "pt-BR",
        label: "Portuguese (Brazil)",
      },
      {
        value: "pt-PT",
        label: "Portuguese (Portugal)",
      },
      {
        value: "ru-RU",
        label: "Russian (Russia)",
      },
      {
        value: "ta-IN",
        label: "Tamil (India)",
      },
      {
        value: "te-IN",
        label: "Telugu (India)",
      },
      {
        value: "tr-TR",
        label: "Turkish (Turkey)",
      },
      {
        value: "zh-CN",
        label: "Chinese (China)",
      },
      {
        value: "zh-TW",
        label: "Chinese (Taiwan)",
      },
      {
        value: "th-TH",
        label: "Thai (Thailand)",
      },
      {
        value: "en-ZA",
        label: "English (South Africa)",
      },
      {
        value: "en-NZ",
        label: "English (New Zealand)",
      },
      {
        value: "vi-VN",
        label: "Vietnamese (Vietnam)",
      },
      {
        value: "sv-SE",
        label: "Swedish (Sweden)",
      },
    ],
    label: "Language Code",
    type: ParameterType.Select,
  },
  {
    name: "settings",
    label: "Settings",
    type: ParameterType.Collection,
    spec: [
      {
        name: "vocabulary_name",
        type: ParameterType.Text,
      },
      {
        name: "show_speaker_labels",
        type: ParameterType.Boolean,
      },
      {
        name: "max_speaker_labels",
        type: ParameterType.Number,
      },
      {
        name: "channel_identification",
        type: ParameterType.Boolean,
      },
      {
        name: "show_alternatives",
        type: ParameterType.Boolean,
      },
      {
        name: "max_alternatives",
        type: ParameterType.Number,
      },
    ],
  },
];

export const DetectIntentFields: MappableParameter[] = [
  {
    name: "input_string",
    type: ParameterType.Text,
    label: "Input String",
  },
  {
    name: "intents",
    type: ParameterType.Array,
    label: "Intents",
    labels: {
      add: "Add Intent",
      field: "Intent",
    },
  },
];

export const SystemFields = {
  [SystemModuleType.WebhookResponse]: WebhookResponseFieldsSpec,
  [SystemModuleType.Webhook]: [],
  [SystemModuleType.Create]: [],
  [SystemModuleType.Update]: [],
  [SystemModuleType.Read]: [],
  [SystemModuleType.ReadOne]: [],
  [SystemModuleType.AddTag]: [],
  [SystemModuleType.RemoveTag]: [],
  [SystemModuleType.SendMessage]: SendMessageFields,
  [SystemModuleType.AddSubscriber]: SubscriberFields,
  [SystemModuleType.RemoveSubscriber]: SubscriberFields,
  [SystemModuleType.CloseThread]: [],
  [SystemModuleType.SetVariable]: SetVariableFields,
  [SystemModuleType.GetVariable]: GetVariableFields,
  [SystemModuleType.SetMultipleVariables]: SetMultipleVariableFields,
  [SystemModuleType.GetMultipleVariables]: GetMultipleVariableFields,
  [SystemModuleType.ArrayIterator]: ArrayIteratorFields,
  [SystemModuleType.Loop]: [],
  [SystemModuleType.ArrayAggregator]: ArrayAggregatorFields,
  [SystemModuleType.MapChartData]: MapChartDataFields,
  [SystemModuleType.SocialMediaAutomation]: [],
  [SystemModuleType.GetNextTask]: SocialMediaAutomationFields["get_next_task"],
  [SystemModuleType.CompleteTask]: SocialMediaAutomationFields["complete_task"],
  [SystemModuleType.RestClient]: RestClientFields,
  [SystemModuleType.Import]: [],
  [SystemModuleType.ChargePayment]: [],
  [SystemModuleType.TriggerFusion]: TriggerFusionFields,
  [SystemModuleType.AskQuestion]: AskQuestionFields,
  [SystemModuleType.CollectSlots]: CollectSlotsFields,
  // [SystemModuleType.UpdateDisplay]: UpdateDisplayFields,
  [SystemModuleType.CreateJob]: CreateJobFields,
  [SystemModuleType.ChargeCredit]: ChargeCreditFields,
  [SystemModuleType.Search3PList]: Search3PListFields,
  [SystemModuleType.GetTemporaryS3Link]: GetTemporaryS3LinkFields,
  [SystemModuleType.SplitAudio]: SplitAudioFields,
  [SystemModuleType.TranscriptionJobTrigger]: [],
  [SystemModuleType.CreateTranscriptionJob]: CreateTranscriptionJobFields,
  [SystemModuleType.ListTranscriptionJobs]: ListTranscriptionJobs,
  [SystemModuleType.GetTranscriptionJob]: GetTranscriptionJobFields,
  [SystemModuleType.DeleteTranscriptionJob]: DeleteTranscriptionJobFields,
  [SystemModuleType.RunPodExtractFaces]: RunPodExtractFacesFields,
  [SystemModuleType.DetectIntent]: DetectIntentFields,
};

export const ScheduleEditorField = {
  name: "type",
  label: "Run Scenario",
  default: "immediately",
  type: ParameterType.Select,
  options: [
    {
      label: "At regular intervals",
      value: ScheduleType.Indefinitely,
      nested: [
        {
          name: "interval",
          label: "Minutes",
          type: ParameterType.UInteger,
          help: "The time interval in which the scenario should be repeated (in minutes).",
          validation: {
            min: 15,
          },
          default: 15,
        },
        {
          name: "restrict",
          label: "Advanced Scheduling",
          type: ParameterType.Array,
          spec: [
            {
              name: "from",
              label: "Time from",
              type: ParameterType.Time,
            },
            {
              name: "to",
              label: "Time to",
              type: ParameterType.Time,
            },
            {
              name: "days",
              label: "Days",
              type: ParameterType.Select,
              options: WeekDayOptions,
              multiple: true,
            },
            {
              name: "months",
              label: "Months",
              type: ParameterType.Select,
              options: MonthOptions,
              multiple: true,
            },
          ],
          help: "You can define specific time intervals during which your scenario is to run. You can specify time-of-day intervals, weekdays or months. This function works only with a paid subscription.",
        },
        {
          name: "start",
          label: "Start",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
        {
          name: "end",
          label: "End",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
      ],
    },
    {
      label: "Once",
      value: ScheduleType.Once,
      nested: [
        {
          name: "date",
          label: "Date",
          type: ParameterType.Date,
          time: true,
        },
      ],
    },
    {
      label: "Every Day",
      value: ScheduleType.Daily,
      nested: [
        {
          name: "time",
          label: "Time",
          type: ParameterType.Time,
        },
        {
          name: "start",
          label: "Start",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
        {
          name: "end",
          label: "End",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
      ],
    },
    {
      label: "Days of the week",
      value: ScheduleType.Weekly,
      nested: [
        {
          name: "days",
          label: "Days",
          type: ParameterType.Select,
          options: WeekDayOptions,
          multiple: true,
        },
        {
          name: "time",
          label: "Time",
          type: ParameterType.Time,
        },
        {
          name: "start",
          label: "Start",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
        {
          name: "end",
          label: "End",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
      ],
    },
    {
      label: "Days of the month",
      value: ScheduleType.Monthly,
      nested: [
        {
          name: "dates",
          label: "Days",
          type: ParameterType.Select,
          options: DateOptions,
          multiple: true,
        },
        {
          name: "time",
          label: "Time",
          type: ParameterType.Time,
        },
        {
          name: "start",
          label: "Start",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
        {
          name: "end",
          label: "End",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
      ],
    },
    {
      label: "Specified Date",
      value: ScheduleType.Yearly,
      nested: [
        {
          name: "months",
          label: "Months",
          type: ParameterType.Select,
          options: MonthOptions,
          multiple: true,
        },
        {
          name: "dates",
          label: "Days",
          type: ParameterType.Select,
          options: DateOptions,
          multiple: true,
        },
        {
          name: "time",
          label: "Time",
          type: ParameterType.Time,
        },
        {
          name: "start",
          label: "Start",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
        {
          name: "end",
          label: "End",
          type: ParameterType.Date,
          time: true,
          help: "Fill in only if you want the scenario to be run from a specific date.",
          advanced: true,
        },
      ],
    },
  ],
};

export const SystemWebhookModules = [
  {
    module_name: SystemModuleType.Webhook,
    label: "Webhook",
    module_type: ModuleType.InstantTrigger,
    slug: SystemModuleType.Webhook,
    description: "Webhook Trigger",
    icon: "ThunderboltOutlined",
  },
  {
    module_name: SystemModuleType.WebhookResponse,
    label: "Webhook Response",
    module_type: ModuleType.Responder,
    slug: SystemModuleType.WebhookResponse,
    description: "Webhook Trigger",
    icon: "ThunderboltOutlined",
  },
];

export const SystemCrudModules = [
  {
    module_name: SystemModuleType.Create,
    label: "Create",
    module_type: ModuleType.Action,
    slug: SystemModuleType.Create,
    description: "Create a new record",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.Update,
    label: "Update",
    module_type: ModuleType.Action,
    slug: SystemModuleType.Update,
    description: "Update an existing record",
    icon: "FormOutlined",
  },
  {
    module_name: SystemModuleType.Read,
    label: "Search",
    module_type: ModuleType.Search,
    slug: SystemModuleType.Read,
    description: "Search Records",
    icon: "EyeOutlined",
  },
  {
    module_name: SystemModuleType.ReadOne,
    label: "Read",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ReadOne,
    description: "Read a Record",
    icon: "EyeOutlined",
  },
  // {
  //   module_name: SystemModuleType.AddTag,
  //   label: "Add Tag",
  //   module_type: ModuleType.Action,
  //   slug: SystemModuleType.AddTag,
  //   description: "Add tag to a record",
  //   icon: "EyeOutlined",
  // },
  // {
  //   module_name: SystemModuleType.RemoveTag,
  //   label: "Remove Tag",
  //   module_type: ModuleType.Action,
  //   slug: SystemModuleType.RemoveTag,
  //   description: "Read a Record",
  //   icon: "EyeOutlined",
  // },
];

export const SystemChatModules = [
  {
    module_name: SystemModuleType.SendMessage,
    label: "Send Message",
    module_type: ModuleType.Action,
    slug: SystemModuleType.SendMessage,
    description: "Send message to subscribers",
    icon: "ThunderboltOutlined",
  },
  {
    module_name: SystemModuleType.AddSubscriber,
    label: "Add Subscriber",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AddSubscriber,
    description: "Add a subscriber",
    icon: "ThunderboltOutlined",
  },
  {
    module_name: SystemModuleType.RemoveSubscriber,
    label: "Remove Subscriber",
    module_type: ModuleType.Action,
    slug: SystemModuleType.RemoveSubscriber,
    description: "Remove a subscriber",
    icon: "ThunderboltOutlined",
  },
  {
    module_name: SystemModuleType.CloseThread,
    label: "Close Chat Thread",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CloseThread,
    description: "Close a chat thread",
    icon: "ThunderboltOutlined",
  },
];

export const SystemBasicModules = [
  {
    module_name: SystemModuleType.SetVariable,
    label: "Set Variable",
    module_type: ModuleType.Action,
    slug: SystemModuleType.SetVariable,
    description: "Set a variable",
    icon: "ToolOutlined",
  },
  {
    module_name: SystemModuleType.GetVariable,
    label: "Get Variable",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetVariable,
    description: "Get a variable",
    icon: "ToolOutlined",
  },
  {
    module_name: SystemModuleType.SetMultipleVariables,
    label: "Set Multiple Variables",
    module_type: ModuleType.Action,
    slug: SystemModuleType.SetMultipleVariables,
    description: "Set multiple variables",
    icon: "ToolOutlined",
  },
  {
    module_name: SystemModuleType.GetMultipleVariables,
    label: "Get Multiple Variables",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetMultipleVariables,
    description: "Get multiple variables",
    icon: "ToolOutlined",
  },
  {
    module_name: SystemModuleType.UpdateInputVariables,
    label: "Update Input Variables",
    module_type: ModuleType.Action,
    slug: SystemModuleType.UpdateInputVariables,
    description: "Update input variables for current session",
    icon: "ToolOutlined",
  },
];

export const SystemFlowControlModules = [
  // {
  //   module_name: SystemModuleType.ArrayIterator,
  //   label: "Array Iterator",
  //   module_type: ModuleType.Action,
  //   slug: SystemModuleType.ArrayIterator,
  //   description: "Iterate over an array",
  //   icon: "ApartmentOutlined",
  // },
  // {
  //   module_name: SystemModuleType.ArrayAggregator,
  //   label: "Array Aggregator",
  //   module_type: ModuleType.Action,
  //   slug: SystemModuleType.ArrayAggregator,
  //   description: "Aggregate an array",
  //   icon: "ApartmentOutlined",
  // },
  {
    module_name: SystemModuleType.Loop,
    label: "Loop",
    module_type: ModuleType.Action,
    slug: SystemModuleType.Loop,
    description: "Loop an array",
    icon: "ApartmentOutlined",
  },
];

export const SocialMediaAutomationModules = [
  {
    module_name: SystemModuleType.SocialMediaAutomation,
    label: "Social Media Automation",
    module_type: ModuleType.Action,
    slug: SystemModuleType.SocialMediaAutomation,
    description: "Social Media Automation",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.GetNextTask,
    label: "Get Next Task",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetNextTask,
    description: "Get Next Task",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.CompleteTask,
    label: "Complete Task",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CompleteTask,
    description: "Complete Task",
    icon: "PlusSquareOutlined",
  },
];

export const SkillsOperators: SystemModule[] = [
  {
    module_name: SystemModuleType.TriggerFusion,
    label: "Trigger a Fusion",
    module_type: ModuleType.Action,
    slug: SystemModuleType.TriggerFusion,
    description: "Trigger a Fusion",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.AskQuestion,
    label: "Ask a Question",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AskQuestion,
    description: "Ask a question",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.CollectSlots,
    label: "Collect Slots",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CollectSlots,
    description: "Collect Slots",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.UpdateDisplay,
    label: "Update Display",
    module_type: ModuleType.Action,
    slug: SystemModuleType.UpdateDisplay,
    description: "Update Display",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.ChargeCredit,
    label: "Charge a Credit",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ChargeCredit,
    description: "Charge a Credit",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.Search3PList,
    label: "Search 3P List",
    module_type: ModuleType.Action,
    slug: SystemModuleType.Search3PList,
    description: "Search 3P List",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.UpdateSkillUser,
    label: "Update Skill User Variables",
    module_type: ModuleType.Action,
    slug: SystemModuleType.UpdateSkillUser,
    description: "Update Skill User Variables",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.UpdateSkillSession,
    label: "Update Skill Session Variables",
    module_type: ModuleType.Action,
    slug: SystemModuleType.UpdateSkillSession,
    description: "Update Skill Session Variables",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.DetectIntent,
    label: "Detect Intent",
    module_type: ModuleType.Action,
    slug: SystemModuleType.DetectIntent,
    description: "Detect Intent",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.CreateJob,
    label: "Create Job",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CreateJob,
    description: "Create Job",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.ChangeSelectedDisplay,
    label: "Change Selected Display",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ChangeSelectedDisplay,
    description: "Change Selected Display",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.ExitSkill,
    label: "Exit Skill",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ExitSkill,
    description: "Exit Skill",
    icon: "PlusSquareOutlined",
  },
];

export const AWSSystemModules: SystemModule[] = [
  {
    module_name: SystemModuleType.GetTemporaryS3Link,
    label: "Get S3 Temporary Link",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetTemporaryS3Link,
    description: "Get S3 Temporary Link",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.SplitAudio,
    label: "Split Audio",
    module_type: ModuleType.Action,
    slug: SystemModuleType.SplitAudio,
    description: "Split Audio",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.TranscriptionJobTrigger,
    label: "Poll Transcription Job",
    module_type: ModuleType.Trigger,
    slug: SystemModuleType.TranscriptionJobTrigger,
    description: "Poll Transcription Job",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.CreateTranscriptionJob,
    label: "Create Transcription Job",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CreateTranscriptionJob,
    description: "Create Transcription Job",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.ListTranscriptionJobs,
    label: "List Transcription Job",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ListTranscriptionJobs,
    description: "List Transcription Job",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.GetTranscriptionJob,
    label: "Get Transcription Job",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetTranscriptionJob,
    description: "Get Transcription Job",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.DeleteTranscriptionJob,
    label: "Delete Transcription Job",
    module_type: ModuleType.Action,
    slug: SystemModuleType.DeleteTranscriptionJob,
    description: "Delete Transcription Job",
    icon: "PlusSquareOutlined",
  },
];

export const FusionDesignModules: SystemModule[] = [
  {
    module_name: SystemModuleType.ActivateDisplay,
    label: "Activate Display",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ActivateDisplay,
    description: "Activate Display",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.CreateOperator,
    label: "Create Operator",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CreateOperator,
    description: "Create Operator",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.GetAllOperators,
    label: "Get All Operators",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetAllOperators,
    description: "Get All Operators",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.GetOperatorSlots,
    label: "Get Operator Slots",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetOperatorSlots,
    description: "Get Operator Slots",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.DeleteOperator,
    label: "Delete Operator",
    module_type: ModuleType.Action,
    slug: SystemModuleType.DeleteOperator,
    description: "Delete Operator",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.UpdateOperatorSlots,
    label: "Update Operator Slots",
    module_type: ModuleType.Action,
    slug: SystemModuleType.UpdateOperatorSlots,
    description: "Update Operator Slots",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.GetAllPopupVariables,
    label: "Get All Popup Variables",
    module_type: ModuleType.Action,
    slug: SystemModuleType.GetAllPopupVariables,
    description: "Get All Popup Variables",
    icon: "PlusSquareOutlined",
  },
];

export const DataDesignModules: SystemModule[] = [
  {
    module_name: SystemModuleType.CreateTable,
    label: "Create Table",
    module_type: ModuleType.Action,
    slug: SystemModuleType.CreateTable,
    description: "Create Table",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.AlterTable,
    label: "Alter Table",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AlterTable,
    description: "Alter Table",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.AddColumn,
    label: "Add column",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AddColumn,
    description: "Add Column",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.AlterColumn,
    label: "Alter Column",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AlterColumn,
    description: "Alter Column",
    icon: "PlusSquareOutlined",
  },
];

export const SystemModules: SystemModule[] = [
  ...SystemCrudModules,
  ...SystemWebhookModules,
  ...SystemBasicModules,
  ...SystemFlowControlModules,
  {
    module_name: SystemModuleType.Import,
    label: "Import",
    module_type: ModuleType.Action,
    slug: SystemModuleType.Import,
    description: "Import Module",
    icon: "ThunderboltOutlined",
  },
  {
    module_name: SystemModuleType.ChargePayment,
    label: "Charge Payment",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ChargePayment,
    description: "Charge Payment",
    icon: "PayCircleOutlined",
  },
  {
    module_name: SystemModuleType.RestClient,
    label: "Rest Client",
    module_type: ModuleType.Action,
    slug: SystemModuleType.RestClient,
    description: "Make Rest API Calls",
    icon: "ApiOutlined",
  },
  ...SkillsOperators,
  ...AWSSystemModules,
  {
    module_name: SystemModuleType.AuthenticationRequest3P,
    label: "Authentication Request",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AuthenticationRequest3P,
    description: "Authentication Request",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.RunPodExtractFaces,
    label: "RunPod Extract Faces",
    module_type: ModuleType.Action,
    slug: SystemModuleType.RunPodExtractFaces,
    description: "RunPod Extract Faces",
    icon: "PlusSquareOutlined",
  },
  ...SocialMediaAutomationModules,
  ...DataDesignModules,
  ...FusionDesignModules,
];

export const BaseSystemModules: SystemModule[] = [
  ...SystemCrudModules,
  ...SystemWebhookModules,
  ...SystemBasicModules,
  ...SystemFlowControlModules,
  {
    module_name: SystemModuleType.Import,
    label: "Import",
    module_type: ModuleType.Action,
    slug: SystemModuleType.Import,
    description: "Import Module",
    icon: "ThunderboltOutlined",
  },
  {
    module_name: SystemModuleType.ChargePayment,
    label: "Charge Payment",
    module_type: ModuleType.Action,
    slug: SystemModuleType.ChargePayment,
    description: "Charge Payment",
    icon: "PayCircleOutlined",
  },
  {
    module_name: SystemModuleType.RestClient,
    label: "Rest Client",
    module_type: ModuleType.Action,
    slug: SystemModuleType.RestClient,
    description: "Make Rest API Calls",
    icon: "ApiOutlined",
  },
  {
    module_name: SystemModuleType.AuthenticationRequest3P,
    label: "Authentication Request",
    module_type: ModuleType.Action,
    slug: SystemModuleType.AuthenticationRequest3P,
    description: "Authentication Request",
    icon: "PlusSquareOutlined",
  },
  {
    module_name: SystemModuleType.RunPodExtractFaces,
    label: "RunPod Extract Faces",
    module_type: ModuleType.Action,
    slug: SystemModuleType.RunPodExtractFaces,
    description: "RunPod Extract Faces",
    icon: "PlusSquareOutlined",
  },
];

export const SystemModuleGroups: { name: string; modules: SystemModule[] }[] = [
  {
    name: "System Modules",
    modules: BaseSystemModules,
  },
  {
    name: "Social Media Automation",
    modules: SocialMediaAutomationModules,
  },
  {
    name: "AWS Modules",
    modules: AWSSystemModules,
  },
  {
    name: "Skills Operators",
    modules: SkillsOperators,
  },
  {
    name: "Fusion Design",
    modules: FusionDesignModules,
  },
  {
    name: "Data Design",
    modules: DataDesignModules,
  },
];
