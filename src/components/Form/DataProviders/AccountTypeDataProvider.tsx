import moment from "moment";
import { ApiModels } from "queries/apiModelMapping";
import useListItems from "queries/useListItems";
import React, { PropsWithChildren, useMemo } from "react";

const AccountTypeDataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: UserTypes } = useListItems({
    modelName: ApiModels.UserType,
  });

  const options = useMemo(() => {
    return UserTypes?.map((type) => ({
      title: type.name,
      id: type.slug,
      subtitle: moment(type.created_at).format(),
    }));
  }, [UserTypes]);

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
export default AccountTypeDataProvider;
