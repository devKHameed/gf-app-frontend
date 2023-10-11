import MChip, { ChipProps } from "@mui/material/Chip";

type Props = ChipProps & {
  [key: string]: any;
};

const Chip = (props: Props) => {
  return <MChip {...props} />;
};

export default Chip;
