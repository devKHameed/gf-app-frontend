import { ActionType, ModuleType, UniversalSubtype } from "../enums/3pApp";

export const ModuleTypeOptions = [
  {
    label: "Action",
    value: ModuleType.Action,
  },
  {
    label: "Search",
    value: ModuleType.Search,
  },
  {
    label: "Trigger (Polling)",
    value: ModuleType.Trigger,
  },
  {
    label: "Instant Trigger (Webhook)",
    value: ModuleType.InstantTrigger,
  },
  {
    label: "Responder",
    value: ModuleType.Responder,
  },
  {
    label: "Universal",
    value: ModuleType.Universal,
  },
];

export const UniversalSubtypeOptions = [
  {
    label: "REST",
    value: UniversalSubtype.Rest,
  },
  {
    label: "GraphQL",
    value: UniversalSubtype.GraphQL,
  },
];

export const ActionTypeOptions = [
  {
    label: "Create",
    value: ActionType.Create,
  },
  {
    label: "Read",
    value: ActionType.Read,
  },
  {
    label: "Update",
    value: ActionType.Update,
  },
  {
    label: "Delete",
    value: ActionType.Delete,
  },
];
