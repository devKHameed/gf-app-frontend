import useAccountSlug from "hooks/useAccountSlug";
import React from "react";
import { Link } from "react-router-dom";

type Props = {} & React.ComponentProps<typeof Link>;

const AccountLink = (props: Props) => {
  const accountSlug = useAccountSlug();
  if (props.to?.toString()?.[0] === "/") {
    return <Link {...props} to={`${accountSlug}${props.to}`} />;
  }
 return <Link {...props} />;
};

export default AccountLink;
