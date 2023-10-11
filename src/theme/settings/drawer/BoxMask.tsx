// import PropTypes from 'prop-types';
// @mui
import { FormControlLabel, Radio } from "@mui/material";

// ----------------------------------------------------------------------

// BoxMask.propTypes = {
//   value: PropTypes.string,
// };
type IBoxMaskProps = {
  value: string;
};
export default function BoxMask({ value }: IBoxMaskProps) {
  return (
    <FormControlLabel
      label=""
      value={value}
      control={<Radio sx={{ display: "none" }} />}
      sx={{
        m: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: "absolute",
      }}
    />
  );
}
