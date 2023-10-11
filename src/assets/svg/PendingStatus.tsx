import { SVGProps } from 'react';

const PendingStatus: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
    >
      <rect width='10' height='10' rx='3' fill='#0A8CA4' />
    </svg>
  );
};

export default PendingStatus;
