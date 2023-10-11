import * as MaterialIcons from "@mui/icons-material";
import { styled } from "@mui/material";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import * as CustomIcons from "assets/icons";
import { GFIconsNames, Icons } from "constants/index";
import React, { memo, useMemo } from "react";
import { isValidUrl } from "utils";

const MaterialIconsMap = new Map(Object.entries(MaterialIcons));

const ImageIconHolder = styled("div")(() => ({}));
const GenericIcon: React.FC<{ iconName: Icons | string } & SvgIconProps> = (
  props
) => {
  const { iconName, ...rest } = props;

  const CustomIcon = useMemo(() => {
    if (MaterialIconsMap.get(iconName)) {
      return MaterialIconsMap.get(iconName) as any;
    } else if (CustomIcons[iconName as unknown as GFIconsNames]) {
      return CustomIcons[iconName as unknown as GFIconsNames];
    } else if (isValidUrl(iconName)) {
      return () => (
        <ImageIconHolder>
          <img src={iconName} alt="logo" />
        </ImageIconHolder>
      );
    }
    return () => <SvgIcon>{iconName}</SvgIcon>;
  }, [iconName]);

  return <CustomIcon {...rest} key={iconName} />;
};

export default memo(GenericIcon);
