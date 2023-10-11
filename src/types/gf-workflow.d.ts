type GFWorkflow = {
  id: string;
  slug: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  child_fields: { fields?: DataField[] };
  child_roles: { roles: Role[] };
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};

type Role = { name: string; id: string; icon?: string };

type GFWorkflowStage = {
  id: string;
  slug: string;
  parent_workflow_id: string;
  parent_stage_id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  stage_fusions: {
    buttons?: FusionButton[];
  };
  stage_fusion_events: Record<string, { fusion_slug: string }>;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};

type FusionButton = {
  name: string;
  fusion_slug?: string;
  icon?: string;
  id: string;
};

type GFWorkflowSession = {
  id: string;
  slug: string;
  name?: string;
  icon?: string;
  description?: string;
  session_body: string;
  session_stage: string;
  session_fields?: Record<string, unknown>;
  session_history: Record<string, unknown>;
  session_roles?: Record<string, string | undefined>;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  is_deleted: number;
};
