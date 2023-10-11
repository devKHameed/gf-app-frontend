import { APP_NAME } from 'configs/AppConfig';
import React from 'react';

export const Logo: React.FC<any> = ({ url }) => {
  return (
    <div className="site-logo">
      <img
        src={url}
        alt={`${APP_NAME} logo`}
        width={100}
        height={50}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default Logo;
