import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as LinearScaleSvg } from '../svg/linear_scale.svg';

const LinearScale: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={LinearScaleSvg}
      className='plus-icon'
    />
  );
};

export default LinearScale;
