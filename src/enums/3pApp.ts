export enum ModuleType {
  Action = "action",
  Search = "search",
  Trigger = "trigger",
  InstantTrigger = "instant_trigger",
  Responder = "responder",
  Universal = "universal",
}

export enum ParameterType {
  Array = "array",
  Boolean = "boolean",
  Buffer = "buffer",
  Cert = "cert",
  Collection = "collection",
  Color = "color",
  Date = "date",
  Email = "email",
  File = "file",
  Filename = "filename",
  Filter = "filter",
  Folder = "folder",
  Hidden = "hidden",
  Integer = "integer",
  JSON = "json",
  Number = "number",
  Path = "path",
  PKey = "pkey",
  Port = "port",
  Select = "select",
  Text = "text",
  Time = "time",
  Timestamp = "timestamp",
  Timezone = "timezone",
  UInteger = "uinteger",
  Url = "url",
  UUID = "uuid",
  Custom = "custom",
  Code = "code",
}
export enum UniversalSubtype {
  Rest = "rest",
  GraphQL = "graphql",
}

export enum ActionType {
  Create = "create",
  Update = "update",
  Delete = "delete",
  Read = "read",
}
