import { List } from "components/List";
import useList3pSubmodule from "queries/3p-app-submodules/useList3pSubmodule";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import React from "react";
import { useParams } from "react-router-dom";

type Props = {
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
  onEdit?: (_?: ThreePAppRemoteProcedure) => void;
};

const RemoteProcedureList = ({ onAdd, onEdit }: Props) => {
  const { slug: threePAppSlug } =
    useParams<{ slug: string; datasetSlug: string }>();
  const { data: threePAppsRemoteProcedure } = useList3pSubmodule(
    ThreePAppSubModels.ThreePAppRemoteProcedure,
    { app: threePAppSlug! }
  );
  return (
    <div>
      <List
        data={threePAppsRemoteProcedure}
        keyBinding={{
          title: "label",
          createdAt: "created_at",
          updatedAt: "updated_at",
        }}
        addButtonProps={{ onClick: onAdd }}
        onEditHandler={onEdit}
        addButtonTitle={"Create a new Remote Procedure"}
        inlineSearch={true}
      />
    </div>
  );
};

export default RemoteProcedureList;
