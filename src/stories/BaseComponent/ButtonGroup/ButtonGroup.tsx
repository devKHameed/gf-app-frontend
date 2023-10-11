import Button from "@mui/material/Button";
import BTNGroup, { ButtonGroupProps } from "@mui/material/ButtonGroup";

type Props = ButtonGroupProps;

const ButtonGroup = (props: Props) => {
  return (
    <BTNGroup aria-label="outlined primary button group" {...props}>
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </BTNGroup>
  );
};

export default ButtonGroup;
