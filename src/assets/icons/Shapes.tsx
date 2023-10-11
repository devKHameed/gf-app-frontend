import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as ShapesSvg } from '../svg/shapes.svg';

const Shapes: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={ShapesSvg}
      className='plus-icon'
    />
  );
};

export default Shapes;
