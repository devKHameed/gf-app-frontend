import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as MouseArrowSvg } from '../svg/mouseArrow.svg';

const MouseArrow: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={MouseArrowSvg}
      className='mouseArrow-icon'
    />
  );
};

export default MouseArrow;
