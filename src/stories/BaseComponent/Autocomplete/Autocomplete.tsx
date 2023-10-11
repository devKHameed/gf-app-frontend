import Autoc, { AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

type Props = AutocompleteProps<any, any, any, any>;

const Autocomplete = (props: Props) => {
  const {
    renderInput = (params: any) => <TextField {...params} label="Movie" />,

    ...rest
  } = props;
  return (
    <Autoc
      disablePortal
      id="combo-box-demo"
      sx={{ width: 300 }}
      renderInput={renderInput}
      {...rest}
    />
  );
};

export default Autocomplete;
