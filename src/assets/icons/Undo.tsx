import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as UndoSvg } from '../svg/undo.svg';

const Undo: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={UndoSvg}
      className='undo-icon'
    />
  );
};

export default Undo;
