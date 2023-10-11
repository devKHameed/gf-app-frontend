import BTN, { ButtonProps } from "@mui/material/Button";

type Props = ButtonProps;

const Button = (props: Props) => {
  return <BTN {...props} />;
};

export default Button;
