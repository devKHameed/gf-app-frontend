import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as RedoSvg } from '../svg/redo.svg';

const Redo: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={RedoSvg}
      className='redo-icon'
    />
  );
};

export default Redo;
