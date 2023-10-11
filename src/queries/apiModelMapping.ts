import AccountUserModel from "models/AccountUser";
import Datacard from "models/Datacard";
import DatacardDesignModel from "models/DatacardDesign";
import DatasetModel from "models/Dataset";
import DatasetDesignModel from "models/DatasetDesign";
import FinetuneKnowledgebaseModel from "models/FinetuneKnowledgebase";
import FinetuneKnowledgebaseTopicModel from "models/FinetuneKnowledgebaseTopic";
import FolderModel from "models/Folder";
import FusionModel from "models/Fusion";
import GFMLFunctionModel from "models/GFMLFunction";
import GuiModel from "models/Gui";
import GuiDashboardWidgetModel from "models/GuiDashboardWidget";
import PortalModel from "models/Portal";
import PresentationModel from "models/Presentation";
import PresentationSlideModel from "models/PresentationSlide";
import PresentationSlideSortModel from "models/PresentationSlideSort";
import SkillDataModel from "models/SkillData";
import SkillIntentModel from "models/SkillIntent";
import TagModel from "models/Tag";
import ThreePAppModel from "models/ThreePApp";
import ThreePAppActionModel from "models/ThreePAppAction";
import ThreePAppConnectionModel from "models/ThreePAppConnection";
import ThreePAppRemoteProcedureModel from "models/ThreePAppRemoteProcedure";
import ThreePAppWebhookModel from "models/ThreePAppWebhook";
import UniversalEventModel from "models/UniversalEvent";
import UniversalNotesModel from "models/UniversalNotes";
import UploadDesignModel from "models/UploadDesign";
import UserTypeModel from "models/UserType";
import VectorKnowledgebaseModel from "models/VectorKnowledgebase";
import VectorKnowledgebaseTopicModel from "models/VectorKnowledgebaseTopic";
import { Edge, Node, Viewport } from "reactflow";

export const ApiModels = {
  DatasetDesign: "dataset-design",
  Presentation: "presentation",
  PresentationSlide: "presentation-slide",
  PresentationSlideSort: "presentation-slide-sort",
  Dataset: "dataset",
  DatacardDesign: "datacard-design",
  Datacard: "datacard",
  UniversalEvent: "universal-event",
  AccountUser: "account-user",
  UserType: "user-type",
  ThreePApp: "3p-app",
  Fusion: "fusion",
  GFMLFunctions: "gfml-functions",
  Folder: "folder",
  Tag: "tag",
  UniversalNote: "universal-note",
  Gui: "gui",
  Portal: "portal",
  GuiDashboard: "gui-dashboard",
  GuiDashboardWidget: "gui-dashboard-widget",
  VectorKnowledgebase: "vector-knowledgebase",
  VectorKnowledgebaseTopic: "vector-knowledgebase-topic",
  FinetuneKnowledgebase: "finetune-knowledgebase",
  FinetuneKnowledgebaseTopic: "finetune-knowledgebase-topic",
  UploadDesign: "upload-design",
  SkillData: "skill-data",
  SkillIntent: "skill-intent",
} as const;

export const ThreePAppSubModels = {
  ThreePAppConnection: "3p-app-connections",
  ThreePAppWebhook: "3p-app-webhooks",
  ThreePAppAction: "3p-app-actions",
  ThreePAppRemoteProcedure: "3p-app-remote-procedure",
} as const;

export const ApiModelMapping = {
  [ApiModels.DatasetDesign]: {
    model: DatasetDesignModel,
  },
  [ApiModels.PresentationSlideSort]: {
    model: PresentationSlideSortModel,
  },
  [ApiModels.PresentationSlide]: {
    model: PresentationSlideModel,
  },
  [ApiModels.Presentation]: {
    model: PresentationModel,
  },
  [ApiModels.Dataset]: {
    model: DatasetModel,
  },
  [ApiModels.DatacardDesign]: {
    model: DatacardDesignModel,
  },
  [ApiModels.Datacard]: {
    model: Datacard,
  },
  [ApiModels.UniversalEvent]: {
    model: UniversalEventModel,
  },
  [ApiModels.AccountUser]: {
    model: AccountUserModel,
  },
  [ApiModels.UserType]: {
    model: UserTypeModel,
  },
  [ApiModels.ThreePApp]: {
    model: ThreePAppModel,
  },
  [ApiModels.Fusion]: {
    model: FusionModel,
  },
  [ApiModels.GFMLFunctions]: {
    model: GFMLFunctionModel,
  },
  [ApiModels.Folder]: {
    model: FolderModel,
  },
  [ApiModels.Tag]: {
    model: TagModel,
  },
  [ApiModels.UniversalNote]: {
    model: UniversalNotesModel,
  },
  [ApiModels.Gui]: {
    model: GuiModel,
  },
  [ApiModels.Portal]: {
    model: PortalModel,
  },
  [ApiModels.GuiDashboardWidget]: {
    model: GuiDashboardWidgetModel,
  },
  [ApiModels.VectorKnowledgebase]: {
    model: VectorKnowledgebaseModel,
  },
  [ApiModels.VectorKnowledgebaseTopic]: {
    model: VectorKnowledgebaseTopicModel,
  },
  [ApiModels.FinetuneKnowledgebase]: {
    model: FinetuneKnowledgebaseModel,
  },
  [ApiModels.FinetuneKnowledgebaseTopic]: {
    model: FinetuneKnowledgebaseTopicModel,
  },
  [ApiModels.UploadDesign]: {
    model: UploadDesignModel,
  },
  [ApiModels.SkillData]: {
    model: SkillDataModel,
  },
  [ApiModels.SkillIntent]: {
    model: SkillIntentModel,
  },
} as const;

export const ThreePAppSubModelMapping = {
  [ThreePAppSubModels.ThreePAppConnection]: {
    model: ThreePAppConnectionModel,
  },
  [ThreePAppSubModels.ThreePAppWebhook]: {
    model: ThreePAppWebhookModel,
  },
  [ThreePAppSubModels.ThreePAppAction]: {
    model: ThreePAppActionModel,
  },
  [ThreePAppSubModels.ThreePAppRemoteProcedure]: {
    model: ThreePAppRemoteProcedureModel,
  },
};

export type ApiModelDataTypes = {
  [ApiModels.DatasetDesign]: DatasetDesign;
  [ApiModels.Dataset]: Dataset;
  [ApiModels.Presentation]: Presentation;
  [ApiModels.PresentationSlide]: PresentationSlide;
  [ApiModels.PresentationSlideSort]: PresentationSlideSort[];
  [ApiModels.DatacardDesign]: DatacardDesign;
  [ApiModels.Datacard]: Datacard;
  [ApiModels.UniversalEvent]: UniversalEvent;
  [ApiModels.AccountUser]: User;
  [ApiModels.UserType]: UserType;
  [ApiModels.ThreePApp]: ThreePApp;
  [ApiModels.Fusion]: Fusion<Node<FusionOperator>, Edge, Viewport>;
  [ApiModels.GFMLFunctions]: GFMLFunction;
  [ApiModels.Folder]: Folder;
  [ApiModels.Tag]: UniversalTag;
  [ApiModels.UniversalNote]: UniversalNote;
  [ApiModels.Gui]: GfGui;
  [ThreePAppSubModels.ThreePAppConnection]: ThreePAppConnection;
  [ThreePAppSubModels.ThreePAppWebhook]: ThreePAppWebhook;
  [ThreePAppSubModels.ThreePAppAction]: ThreePAppAction;
  [ThreePAppSubModels.ThreePAppRemoteProcedure]: ThreePAppRemoteProcedure;
  [ApiModels.Portal]: Portal;
  [ApiModels.GuiDashboardWidget]: GuiDashboardWidget;
  [ApiModels.VectorKnowledgebase]: VectorKnowledgebase;
  [ApiModels.VectorKnowledgebaseTopic]: VectorKnowledgebaseTopic;
  [ApiModels.FinetuneKnowledgebase]: FinetuneKnowledgebase;
  [ApiModels.FinetuneKnowledgebaseTopic]: FinetuneKnowledgebaseTopic;
  [ApiModels.UploadDesign]: UploadDesign;
  [ApiModels.SkillData]: SkillData;
  [ApiModels.SkillIntent]: SkillIntent;
};

export type RequestOptions = {
  query?: Record<string, any>;
  path?: string | undefined;
};
