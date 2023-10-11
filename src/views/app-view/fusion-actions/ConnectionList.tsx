import { List } from "components/List";
import useList3pSubmodule from "queries/3p-app-submodules/useList3pSubmodule";
import { ThreePAppSubModels } from "queries/apiModelMapping";
import React from "react";
import { useParams } from "react-router-dom";

type Props = {
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
  onEdit?: (_?: ThreePAppConnection) => void;
};

const ConnectionList = ({ onAdd, onEdit }: Props) => {
  const { slug: threePAppSlug } =
    useParams<{ slug: string; datasetSlug: string }>();
  const { data: threePAppsConnections } = useList3pSubmodule(
    ThreePAppSubModels.ThreePAppConnection,
    { app: threePAppSlug! }
  );

  return (
    <div>
      <List
        data={threePAppsConnections}
        keyBinding={{
          title: "label",
          createdAt: "created_at",
          updatedAt: "updated_at",
        }}
        addButtonProps={{ onClick: onAdd }}
        onEditHandler={onEdit}
        addButtonTitle={"Create a new Connection"}
        inlineSearch={true}
      />
    </div>
  );
};

export default ConnectionList;
