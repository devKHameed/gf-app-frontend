import useAccountSlug from "hooks/useAccountSlug";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  const accountSlug = useAccountSlug();
  const navigate = useNavigate();
  if (accountSlug) navigate(`${accountSlug}/app`);

  return <div>Home</div>;
};

export default Home;
