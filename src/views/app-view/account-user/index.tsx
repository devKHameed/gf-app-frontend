import { Box, styled, useMediaQuery } from "@mui/material";
import { Stack, useTheme } from "@mui/system";
import { useQueryClient } from "@tanstack/react-query";
import Scrollbar from "components/Scrollbar";
import RenameModel from "components/share-components/RenameModel";
import useAppNavigate from "hooks/useAppNavigate";
import AnimationLayout, {
  AnimationLayoutRef,
  Config,
  TransitionComponent,
} from "layouts/AnimationLayout";
import { kebabCase } from "lodash";
import { ApiModels } from "queries/apiModelMapping";
import useGetItem from "queries/useGetItem";
import useListItems from "queries/useListItems";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSystemLayoutStore from "store";
import { getSearchParams } from "utils";
import EditUniversalNote from "../universal-note/EditUniversalNote";
import AccountUserSetting from "./AccountUserSetting";
import AddAccountUserModalModal from "./AddAccountUserModal";
import MiddleComponent from "./MiddleComponent";

const AddModel = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  useSystemLayoutStore.useSetButtonProps()({
    onClick: () => setAddModalOpen(true),
  });

  return (
    <AddAccountUserModalModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSubmit={(data) => {}}
    />
  );
};

const CenterBox = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
  height: "calc(100vh - 60px)",
}));

const RightSideBox = styled(Box)(({ theme }) => ({
  width: "420px",
  height: "calc(100vh - 60px)",
}));
const getInitialComponent = () => {
  return getSearchParams().get("c_name") || "main";
};

const AccountUsers = () => {
  const { slug: accountUserSlug } = useParams<{ slug: string }>();
  const appNavigate = useAppNavigate();
  const goToRightView = useSystemLayoutStore.useGoToRightView();
  const [initialComponent, setInitialComponent] = useState<string>("");
  const layoutRef = useRef<AnimationLayoutRef>(null);

  const queryClient = useQueryClient();
  const theme = useTheme();
  const xlScreen = useMediaQuery(theme.breakpoints.up("xl"));

  const setMenu = useSystemLayoutStore.useSetMenu();
  const menuItemProps = useSystemLayoutStore.useSetItemProps();
  const historyIsSet = useRef(false);

  const { data: accountUsers, isFetched } = useListItems({
    modelName: ApiModels.AccountUser,
  });

  const { data: accountUser } = useGetItem({
    modelName: ApiModels.AccountUser,
    slug: accountUserSlug,
  });

  useEffect(() => {
    if (!accountUserSlug && accountUsers && accountUsers?.length > 0) {
      appNavigate(`/account-user-module/${accountUsers[0]?.slug}?t=0`, {
        replace: true,
      });
    }
  }, [appNavigate, accountUserSlug, accountUsers]);

  useEffect(() => {
    useSystemLayoutStore.setState({
      buttonOptions: { addFolder: false, addItem: true },
      layout: "search",
    });
    return () => {
      useSystemLayoutStore.setState({
        buttonOptions: { addFolder: true, addItem: true },
        layout: "default",
      });
    };
  }, []);

  useEffect(() => {
    menuItemProps({
      onClick: (item) => {
        layoutRef.current?.reset();
        goToRightView();
        const data = queryClient.getQueryData<User[]>([ApiModels.AccountUser]);
        const designItem = data?.find((d) => d.slug === item.key);
        if (designItem) {
          queryClient.setQueryData(
            [ApiModels.AccountUser, item.key],
            designItem
          );

          appNavigate(`/account-user-module/${designItem.slug}?t=0`);
        }
      },
      isActive: (item) => item.key === accountUserSlug,
    });
    setInitialComponent(getInitialComponent());
  }, [accountUserSlug]);

  useLayoutEffect(() => {
    if (!historyIsSet.current) {
      const c = getSearchParams().get("c_name");
      if (c && accountUser && layoutRef.current) {
        const transitionHistory: TransitionComponent[] = [
          { name: "main", id: "main" },
          { name: c, id: c },
        ];

        layoutRef.current.setTransitionHistory(transitionHistory);

        historyIsSet.current = true;
      }
    }
  }, [accountUser, xlScreen]);

  useEffect(() => {
    if (isFetched && accountUsers && accountUsers.length > 0) {
      setMenu(
        accountUsers.map((design) => ({
          title: `${design.first_name} ${design.last_name}`,
          key: design.slug,
          icon: design.image?.url,
        }))
      );
    }
  }, [accountUsers, isFetched]);

  const getComponentMiddleComponent: Config["getComponents"] =
    React.useCallback(
      (gotoComponent, goBack) => {
        return {
          main: (
            <MiddleComponent
              onNoteEdit={(item) => {
                if (item?.slug) {
                  appNavigate(`note/${item.slug}`);
                  gotoComponent({
                    name: "edit-note",
                    id: "edit-note",
                  });
                }
              }}
            />
          ),
          "edit-note": (
            <EditUniversalNote
              onBackClick={() => {
                goBack();
                appNavigate(`/account-user-module/${accountUserSlug}?t=2`);
              }}
              noteType={kebabCase(accountUserSlug)!}
            />
          ),
        };
      },
      [accountUserSlug, appNavigate]
    );
  return (
    <React.Fragment>
      {accountUser && (
        <Stack direction="row">
          <CenterBox>
            <Scrollbar>
              <Box>
                {accountUser?.slug && initialComponent && (
                  <AnimationLayout
                    ref={layoutRef}
                    config={{
                      getComponents: getComponentMiddleComponent,
                      initialComponent,
                    }}
                  />
                )}
              </Box>
            </Scrollbar>
          </CenterBox>
          {xlScreen && (
            <RightSideBox
              sx={{ background: theme.palette.background.GFRightNavBackground }}
            >
              <AccountUserSetting />
            </RightSideBox>
          )}
        </Stack>
      )}
      <AddModel />
      <RenameModel module={ApiModels.AccountUser} title="AccountUser" />
    </React.Fragment>
  );
};

export default AccountUsers;
