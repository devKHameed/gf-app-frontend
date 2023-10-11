import { Add } from "@mui/icons-material";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, ButtonProps, Stack, styled } from "@mui/material";
import SearchInput from "components/SearchInput";
import { debounce } from "lodash";
import React, { ReactElement, useMemo, useState } from "react";
import BaseList, { BaseListProps, defaultBindingKey } from "./BaseList";
type Props<T> = {
  extra?: ReactElement;
  addButtonProps?: Partial<ButtonProps>;
  hideSearch?: boolean;
  onEditHandler?: (_: T) => void;
  onDeleteClick?: (_: T) => void;
  showAddButton?: boolean;
  handleSearch?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  inlineSearch?: boolean;
  showLoadMoreButton?: boolean;
  onLoadMore?: () => void;
  loading?: boolean;
  addButtonTitle?: string | ReactElement;
  type?: "default" | "card";
} & Omit<BaseListProps<T>, "onEdit">;

const AddButton = styled(Button)(({ theme }) => ({
  fontSize: "13px",
  fontWeight: "600",
  padding: "8px 11px 8px 8px",
  gap: "8px",

  // "&:hover": {
  // background: `rgba(${theme.palette.orange.GFOrange} / 0.6)`,
  //   color: theme.palette.background.GF80,
  // },

  ".MuiSvgIcon-root": {
    width: "18px",
    height: "18px",
  },
}));

const ViewButton = styled(LoadingButton)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.background.GF60,
  height: "40px",
  borderColor: theme.palette.action.selected,

  "&:hover": {
    color: theme.palette.background.GF80,
    borderColor: theme.palette.background.GF60,
    background: "none",
  },

  ".MuiButton-startIcon": {
    marginRight: "6px",
    width: "24px",

    svg: {
      width: "100%",
      height: "auto",
    },
  },
}));

export const RStack = styled(Stack)(({ theme }) => ({
  marginBottom: "24px",

  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "16px",
  },
}));

const List = <
  T extends { slug: string; [key: string]: any } = {
    slug: string;
    [key: string]: any;
  }
>({
  extra,
  showAddButton = true,
  addButtonProps,
  onEditHandler,
  data,
  keyBinding,
  handleSearch,
  showLoadMoreButton,
  addButtonTitle,
  onLoadMore,
  loading,
  hideSearch,
  inlineSearch = false,
  type = "default",
  onDeleteClick,
  ...rest
}: Props<T>) => {
  const [searchValue, setSearchValue] = useState<string | undefined>();

  const searchHandler: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    if (inlineSearch) {
      debounce(() => setSearchValue(e.target.value), 200)();
    } else {
      handleSearch?.(e);
    }
  };
  const filterValue = useMemo(() => {
    if (!inlineSearch || !searchValue?.length) return data;

    const bindingKey = keyBinding?.title || defaultBindingKey.title;
    return data?.filter((item) => {
      const title = item[bindingKey as keyof typeof item] as unknown as string;
      if (title && title.startsWith(searchValue)) return true;
      return false;
    });
  }, [data, inlineSearch, keyBinding?.title, searchValue]);
  return (
    <Box>
      <RStack direction="row" justifyContent="space-between">
        {!hideSearch && (
          <Box sx={{ maxWidth: "192px" }}>
            <SearchInput
              id="outlined-adornment-password"
              placeholder="Search..."
              size="small"
              sx={{ m: 0 }}
              onChange={searchHandler}
            />
          </Box>
        )}
        {extra ? (
          extra
        ) : (
          <React.Fragment>
            {showAddButton && (
              <AddButton variant="contained" {...addButtonProps} size="small">
                <Add /> {addButtonTitle || "New Records"}
              </AddButton>
            )}
          </React.Fragment>
        )}
      </RStack>
      <Stack gap={1.25}>
        <BaseList
          data={filterValue}
          keyBinding={keyBinding}
          onEdit={onEditHandler}
          onDeleteClick={onDeleteClick}
          type={type}
          {...rest}
        />
        {showLoadMoreButton && (
          <ViewButton
            fullWidth
            variant="outlined"
            size="large"
            disableRipple
            startIcon={<ArrowDropDown />}
            onClick={onLoadMore}
            loading={loading}
            disabled={loading}
          >
            View more
          </ViewButton>
        )}
      </Stack>
    </Box>
  );
};

export default List;
