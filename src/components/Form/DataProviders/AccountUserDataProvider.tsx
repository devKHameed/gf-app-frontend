import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import React, { PropsWithChildren, useMemo } from "react";

const AccountUserDataProvider: React.FC<
  PropsWithChildren<{ allowAllUserType?: boolean; userTypes?: string[] }>
> = ({ children, allowAllUserType, userTypes }) => {
  const { data: AccountUsers } = useListItems({
    modelName: ApiModels.AccountUser,
  });

  const options = useMemo(() => {
    //const users=[];
    // TODO: Implement Usertype filter
    return AccountUsers?.map((user) => ({
      title: user.first_name,
      id: user.slug,
      subtitle: user.email,
      image: user.image,
    }));
  }, [AccountUsers]);

  if (React.isValidElement(children)) {
    return (
      <React.Fragment>
        {React.cloneElement(children, {
          ...children.props,
          options,
        })}
      </React.Fragment>
    );
  }
  return <React.Fragment>{children}</React.Fragment>;
};
export default AccountUserDataProvider;
