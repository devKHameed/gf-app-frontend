import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import CodeEditorField from "components/CodeEditor/CodeEditorField";
import FormField from "components/FormField";
import GenericIcon from "components/util-components/Icon";
import useAppNavigate from "hooks/useAppNavigate";
import InnerPageLayout from "layouts/inner-app-layout";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import ActionList from "./ActionList";
import AppFlowComponent from "./AppFlowComponent";
import BaseComponent from "./BaseComponent";
import ConnectionList from "./ConnectionList";
import GeneralComponent from "./GeneralComponent";
import GroupComponent from "./GroupComponent";
import RemoteProcedureList from "./RemoteProcedureList";
import WebhookList from "./WebhookList";
type threePModels =
  | typeof ThreePAppSubModels[keyof typeof ThreePAppSubModels]
  | null;
type InnerPageLayoutProps = React.ComponentProps<typeof InnerPageLayout>;
type TabListProps = {
  tabLists: InnerPageLayoutProps["tabList"];
  handleTabChange: InnerPageLayoutProps["onChange"];
  handleActiveModelChange: (_: threePModels) => void;
  activeTab: InnerPageLayoutProps["value"];
  register: UseFormRegister<Partial<ThreePApp>>;
  errors: FieldErrors<Partial<ThreePApp>>;
  control: Control<Partial<ThreePApp>, any>;
  onConnectionEdit?: React.ComponentProps<typeof ConnectionList>["onEdit"];
  onModuleEdit?: React.ComponentProps<typeof ActionList>["onEdit"];
  onWebhookEdit?: React.ComponentProps<typeof WebhookList>["onEdit"];
  onRemoteProcedureEdit?: React.ComponentProps<
    typeof RemoteProcedureList
  >["onEdit"];
  onAdd: (_: threePModels) => void;
  threePApp?: ThreePApp;
};
const ItemWrapper = styled(Stack)(() => {
  return {
    marginBottom: "30px",
  };
});
export const CollapseHolder = styled(Box)(({ theme }) => ({
  ".MuiButtonBase-root ": {
    padding: "6px 7px",
    minWidth: "53px",
    border: `1px solid ${theme.palette.background.GF20}`,
    background: theme.palette.background.GF7,

    ".plus": {
      width: "20px",
      height: "20px",

      svg: {
        width: "100%",
        height: "auto",
        display: "block",
      },
    },

    ".MuiButton-endIcon": {
      marginLeft: "1px",
      color: theme.palette.background.GF60,

      svg: {
        fontSize: "16px",
      },
    },
  },
}));

export const MenuWrap = styled(Menu)(({ theme }) => ({
  ".MuiList-root ": {
    background: theme.palette.background.GFRightNavBackground,

    ".MuiButtonBase-root": {
      color: theme.palette.background.GF70,
      padding: "5px 13px",
    },

    ".MuiSvgIcon-root": {
      width: "20px",
      height: "20px",
      marginRight: "4px",
      color: theme.palette.text.primary,
    },
  },
}));

const InnerAppLayout = styled(Box)(() => {
  return {
    ".MuiCardContent-root": {
      marginBottom: "0",
    },
  };
});

function ActionDropDown({ onSelect }: { onSelect: (_: threePModels) => void }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <CollapseHolder>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
        variant="outlined"
        color="inherit"
      >
        <Box className="plus">
          <AddIcon />
        </Box>
      </Button>
      <MenuWrap
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            onSelect(ThreePAppSubModels.ThreePAppConnection);
            handleClose();
          }}
        >
          <AddIcon /> Create a new Connection
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSelect(ThreePAppSubModels.ThreePAppWebhook);
            handleClose();
          }}
        >
          <AddIcon /> Create a new Webhook
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSelect(ThreePAppSubModels.ThreePAppAction);
            handleClose();
          }}
        >
          <AddIcon /> Create a new Module
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSelect(ThreePAppSubModels.ThreePAppRemoteProcedure);
            handleClose();
          }}
        >
          <AddIcon /> Create a new Remote Procedure
        </MenuItem>
      </MenuWrap>
    </CollapseHolder>
  );
}

const MainComponent = ({
  tabLists,
  activeTab,
  handleTabChange,
  handleActiveModelChange,
  register,
  errors,
  control,
  onConnectionEdit,
  onModuleEdit,
  onWebhookEdit,
  onRemoteProcedureEdit,
  onAdd,
  threePApp,
}: TabListProps) => {
  const appNavigate = useAppNavigate();
  return (
    <InnerAppLayout>
      <InnerPageLayout
        title={
          <span>
            <span>{threePApp?.app_label || ""}</span>
            <EditOutlinedIcon
              onClick={() => {
                appNavigate(
                  "/fusion-action-module/sdfasf:8e2ce624-656c-4e3d-9ece-2078684d0c38?t=9"
                );
              }}
              sx={{
                height: "21px",
                width: "21px",
                marginLeft: "26px",
                color: "text.secondary",
                cursor: "pointer",

                "&:hover": {
                  color: "text.primary",
                },
              }}
            />
          </span>
        }
        icon={
          <GenericIcon
            iconName={threePApp?.app_logo_image?.url || "Menu"}
            key={threePApp?.app_logo_image?.url || "Menu"}
          />
        }
        tabList={tabLists}
        value={activeTab}
        onChange={handleTabChange}
        tags={true}
        extra={
          <Box sx={{ display: "flex" }}>
            <ActionDropDown onSelect={onAdd} />
            <Button sx={{ marginLeft: 1 }} variant="contained">
              Publish
            </Button>
            {/* <DevTool control={control} /> */}
          </Box>
        }
      >
        {activeTab === 0 && (
          <BaseComponent
            register={register}
            errors={errors}
            control={control}
          />
        )}
        {activeTab === 1 && (
          <ConnectionList
            onAdd={() =>
              handleActiveModelChange(ThreePAppSubModels.ThreePAppConnection)
            }
            onEdit={onConnectionEdit}
          />
        )}
        {activeTab === 2 && (
          <WebhookList
            onAdd={() =>
              handleActiveModelChange(ThreePAppSubModels.ThreePAppWebhook)
            }
            onEdit={onWebhookEdit}
          />
        )}
        {activeTab === 3 && (
          <ActionList
            onAdd={() =>
              handleActiveModelChange(ThreePAppSubModels.ThreePAppAction)
            }
            onEdit={onModuleEdit}
          />
        )}
        {activeTab === 4 && (
          <RemoteProcedureList
            onAdd={() =>
              handleActiveModelChange(
                ThreePAppSubModels.ThreePAppRemoteProcedure
              )
            }
            onEdit={onRemoteProcedureEdit}
          />
        )}
        {activeTab === 5 && (
          <GroupComponent
            register={register}
            errors={errors}
            control={control}
          />
        )}
        {activeTab === 6 && <div>Review</div>}
        {activeTab === 7 && (
          <div>
            <Box>
              <ItemWrapper gap={2.5}>
                <Box>
                  <Typography variant="h6">Readme</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Powered by Github-Flavored Markdown.
                  </Typography>
                </Box>
                <FormField>
                  <Controller
                    name="read_me"
                    control={control}
                    render={({ field }) => (
                      <CodeEditorField
                        {...field}
                        value={field.value!}
                        mode="markdown"
                      />
                    )}
                  />
                </FormField>
              </ItemWrapper>
            </Box>
          </div>
        )}
        {activeTab === 8 && <AppFlowComponent />}
        {activeTab === 9 && (
          <GeneralComponent
            register={register}
            errors={errors}
            control={control}
          />
        )}
      </InnerPageLayout>
    </InnerAppLayout>
  );
};

export default MainComponent;
