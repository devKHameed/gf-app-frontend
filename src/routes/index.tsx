import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";

import SecureLayout from "layouts/SecureLayout";
import Layout from "layouts/SimpleLayout";

import AppLayout from "layouts/AppLayout";
import SystemLayout from "layouts/SystemLayout";
import AccountUser from "views/app-view/account-user";
import DatacardDesign from "views/app-view/datacard-design";
import FlowDesigner from "views/app-view/flow-designer";
import OauthCallback from "views/app-view/flow-designer/oauth-callback";
import FusionAction from "views/app-view/fusion-actions";
import Fusions from "views/app-view/fusions";
import Gui from "views/app-view/gui";
import GuiDocumentListEditor from "views/app-view/gui-dataset";

import Icons from "views/app-view/icons";
import Sample from "views/app-view/Sample";
import LoginPage from "views/auth-view/Login";

import Database from "assets/icons/nav-route/Database";
import DeveloperIcon from "assets/icons/nav-route/Developer";
import FusionIcon from "assets/icons/nav-route/Fusion";
import GuiIcon from "assets/icons/nav-route/Gui";
import MediaIcon from "assets/icons/nav-route/Media";
import UserIcon from "assets/icons/nav-route/User";
import SylerUILayout from "layouts/SylerUILayout";
import ChatBoart from "views/app-view/ChatBoart";
import FinetuneKnowledgebase from "views/app-view/finetune-knowledgebase";
import FusionsView from "views/app-view/FuisionView";
import FusionLogs from "views/app-view/fusions/FusionLogs";
import GFDashboard from "views/app-view/gui-dashboard";
import Skills from "views/app-view/Skills";
import TranscriptionEditor from "views/app-view/TranscriptionEditor";
import UploadDesign from "views/app-view/upload-design";
import VectorKnowledgebase from "views/app-view/vector-knowledgebase";
import Home from "views/Home";

const Loadable =
  (Component: React.ComponentType<any>) => (props: JSX.IntrinsicAttributes) =>
    (
      <Suspense fallback={<div>Suspense Loading..</div>}>
        <Component {...props} />
      </Suspense>
    );

// const RegisterPage = Loadable(lazy(() => import('../pages/register.page')));
const UnauthorizePage = Loadable(
  lazy(() => import("views/auth-view/UnauthorizePage"))
);
const Profile = Loadable(lazy(() => import("views/app-view/profile")));
const Presentation = Loadable(
  lazy(() => import("views/app-view/presentation"))
);
const Presentations = Loadable(
  lazy(() => import("views/app-view/presentation/Presentations"))
);
// const FusionAction = Loadable(
//   lazy(() => import("views/app-view/fusion-actions"))
// );

const authRoutes: RouteObject = {
  path: "*",
  children: [
    {
      path: "login",
      element: <LoginPage />,
    },
    // {
    //   path: 'register',
    //   element: <RegisterPage />,
    // },
  ],
};

const normalRoutes: RouteObject = {
  path: "",
  element: <Layout />,
  children: [
    {
      path: "",
      element: <SecureLayout />,
      children: [
        {
          path: "",
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },

            {
              path: ":accountSlug",
              children: [
                {
                  index: true,
                  element: <Navigate to="/app" />,
                },
                {
                  path: "app",
                  element: <Sample />,
                },
                {
                  path: "gui-module-public/:slug/dashboard",
                  element: <GFDashboard editable={false} />,
                },
                {
                  path: "gui-module-public/:slug/dashboard/:tabSlug",
                  element: <GFDashboard editable={false} />,
                },
                {
                  path: "gui-module-public/:slug/document-list/:datasetDesignSlug",
                  element: <GuiDocumentListEditor publicAccess={true} />,
                },
                {
                  path: "gui-module-public/:slug/document-list/:datasetDesignSlug/:datasetSlug",
                  element: <GuiDocumentListEditor publicAccess={true} />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "unauthorized",
      element: <UnauthorizePage />,
    },
  ],
};

const systemRoutes: RouteObject = {
  path: "/:accountSlug",
  element: <Layout />,
  children: [
    {
      path: "",
      element: <SecureLayout />,
      children: [
        {
          path: "",
          element: <SystemLayout />,
          children: [
            {
              path: "dataset-design",
              element: <Profile />,
            },
            {
              path: "dataset-design/:slug",
              element: <Profile />,
            },
            {
              path: "dataset-design/:slug/:datasetSlug",
              element: <Profile />,
            },
            {
              path: "icons",
              element: <Icons />,
            },
            {
              path: "fusion",
              element: <Fusions type="fusion" />,
            },
            {
              path: "fusion/:fusionSlug",
              element: <Fusions type="fusion" />,
            },
            {
              path: "skill-design-module",
              element: <Fusions type="skill_design" />,
            },
            {
              path: "skill-design-module/:fusionSlug",
              element: <Fusions type="skill_design" />,
            },
            {
              path: "fusion-action-module",
              element: <FusionAction />,
            },
            {
              path: "fusion-action-module/:slug",
              element: <FusionAction />,
            },
            {
              path: "fusion-action-module/:slug/connection/:connectionSlug",
              element: <FusionAction />,
            },
            {
              path: "fusion-action-module/:slug/module/:moduleSlug",
              element: <FusionAction />,
            },
            {
              path: "fusion-action-module/:slug/webhook/:webhookSlug",
              element: <FusionAction />,
            },
            {
              path: "fusion-action-module/:slug/remote-procedure/:remoteProcedureSlug",
              element: <FusionAction />,
            },
            {
              path: "datacard-design-module",
              element: <DatacardDesign />,
            },
            {
              path: "datacard-design-module/:slug",
              element: <DatacardDesign />,
            },

            {
              path: "gui-module",
              element: <Gui />,
            },
            {
              path: "gui-module/:slug",
              element: <Gui />,
            },
            {
              path: "gui-module/:slug/note/:noteSlug",
              element: <Gui />,
            },
            {
              path: "gui-module/:slug/document-list/:datasetDesignSlug",
              element: <GuiDocumentListEditor />,
            },
            {
              path: "gui-module/:slug/document-list/:datasetDesignSlug/:datasetSlug",
              element: <GuiDocumentListEditor />,
            },

            {
              path: "gui-module/:slug/dashboard",
              element: <GFDashboard />,
            },
            {
              path: "gui-module/:slug/dashboard/:tabSlug",
              element: <GFDashboard />,
            },
            {
              path: "account-user-module",
              element: <AccountUser />,
            },
            {
              path: "account-user-module/:slug",
              element: <AccountUser />,
            },
            {
              path: "vector-knowledgebase-module",
              element: <VectorKnowledgebase />,
            },
            {
              path: "vector-knowledgebase-module/:slug",
              element: <VectorKnowledgebase />,
            },
            {
              path: "finetune-knowledgebase-module",
              element: <FinetuneKnowledgebase />,
            },
            {
              path: "finetune-knowledgebase-module/:slug",
              element: <FinetuneKnowledgebase />,
            },
            {
              path: "import-module",
              element: <UploadDesign />,
            },
            {
              path: "import-module/:slug",
              element: <UploadDesign />,
            },
          ],
        },
        {
          path: "",
          element: <SystemLayout sideNav={false} />,
          children: [
            {
              path: "fusion/flow-designer/:fusionSlug",
              element: <FlowDesigner />,
            },
            {
              path: "skills/:slug",
              element: <Skills />,
            },
            {
              path: "fusion/logs",
              element: <FusionLogs />,
            },
          ],
        },
        {
          path: "",
          element: <SystemLayout sideNav={false} RcAccountMenu={false} />,
          children: [
            {
              path: "presentations",
              element: <Presentations />,
            },
            {
              path: "presentations/:slug",
              element: <Presentation />,
            },
          ],
        },
        {
          path: "transcript",
          element: <SystemLayout sideNav={false} RcAccountMenu={false} />,
          children: [
            {
              path: "",
              element: <TranscriptionEditor />,
            },
          ],
        },
        {
          path: "",
          element: <SystemLayout sideNav={false} />,
          children: [
            {
              path: "settings",
              element: (
                <SylerUILayout>
                  <FusionsView />
                </SylerUILayout>
              ),
            },
            {
              path: "chat",
              element: (
                <SylerUILayout rightMenu={false}>
                  <ChatBoart />
                </SylerUILayout>
              ),
            },
            {
              path: "skills",
              element: (
                <SylerUILayout>
                  <Skills />
                </SylerUILayout>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "unauthorized",
      element: <UnauthorizePage />,
    },
    {
      path: "oauth_callback",
      element: <OauthCallback />,
    },
  ],
};

const routes: RouteObject[] = [authRoutes, systemRoutes, normalRoutes];

export const SystemNavRoutes = [
  {
    name: "Data",
    path: "/dataset-design",
    description:
      "Manage your team member permissions, user experiences and access levels.",
    icon: <Database />,
    children: [
      {
        name: "Dataset Designs",
        path: "/dataset-design",
      },
      {
        name: "Vector Knowledgebase",
        path: "/vector-knowledgebase-module",
      },
      {
        name: "Finetune Knowledgebase",
        path: "/finetune-knowledgebase-module",
      },
      {
        name: "Importer",
        path: "/import-module",
      },
    ],
  },
  {
    name: "Gui's",
    path: "/gui-module",
    icon: <GuiIcon />,
    description:
      "Manage custom workspaces that you and your team can use to manage content, projects and data.",
    children: [
      {
        name: "Gui's",
        path: "/gui-module",
      },
    ],
  },
  {
    name: "Fusions's",
    path: "/fusion",
    icon: <FusionIcon />,
    description:
      "Create custom workflows and automatons for contacts, projects or any other business process.",
    children: [
      {
        name: "Fusions",
        path: "/fusion",
      },
      {
        name: "Skill Designs",
        path: "/skill-design-module",
      },
    ],
  },
  {
    name: "Media",
    path: "/presentation",
    icon: <MediaIcon />,
    description:
      "Design custom data structures for your contacts, documents, analytics and projects.",
    children: [
      {
        name: "Presentation",
        path: "/presentation",
      },
      {
        name: "Portals",
        path: "/portal-module",
      },
      {
        name: "Icons",
        path: "/icons",
      },
    ],
  },
  {
    name: "Developer",
    path: "/fusion-action-module",
    icon: <DeveloperIcon />,
    description:
      "Manage your team member permissions, user experiences and access levels.",
    children: [
      {
        name: "Fusion Actions",
        path: "/fusion-action-module",
      },
    ],
  },
  {
    name: "Users",
    path: "/account-user-module",
    icon: <UserIcon />,
    description:
      "Manage your team member permissions, user experiences and access levels.",
    children: [
      {
        name: "Users",
        path: "/account-user-module",
      },
      {
        name: "User Types",
        path: "/user-type-module",
      },
    ],
  },
  {
    name: "Sylar",
    path: "/settings",
    description:
      "Manage your team member permissions, user experiences and access levels.",
    children: [],
  },
];

export default routes;
