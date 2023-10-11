import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import GfLogo from "assets/icons/GfLogo";
import useAccountSlug from "hooks/useAccountSlug";
import { queryClient } from "queries";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "store";

type Props = {};

const AccountSellector = (props: Props) => {
  const accounts = useStore.useAccounts?.();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedAccount = useAccountSlug();
  const setSelectedAccount = useStore.useSetSelectedAccount();

  const handleChange = (e: SelectChangeEvent<string>) => {
    const pathAfterAccount = location.pathname.split("/").slice(2).join("/");
    setSelectedAccount(e.target.value);
    queryClient.clear();
    setTimeout(() => navigate(`/${e.target.value}/${pathAfterAccount}`), 0);
  };
  return (
    <div className="account-selector">
      <GfLogo fontSize="large" className="logo-image" />
      <Select
        IconComponent={ExpandMoreIcon}
        id="accountSelletion"
        onChange={handleChange}
        variant={"standard"}
        value={selectedAccount || ""}
      >
        {accounts?.map((acct) => (
          <MenuItem value={acct.slug}>{acct.name}</MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default AccountSellector;
