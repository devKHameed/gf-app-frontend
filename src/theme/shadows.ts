// @mui
import { alpha } from "@mui/material/styles";
//

// ----------------------------------------------------------------------

const LIGHT_MODE = "#000000";
const DARK_MODE = "#000000";
const createShadow = (color: string) => {
  const transparent3 = alpha(color, 0.2);
  const transparent2 = alpha(color, 0.14);
  const transparent1 = alpha(color, 0.12);
  return [
    "none",
    `0px 2px 1px -1px ${transparent1},0px 1px 1px 0px ${transparent2},0px 1px 3px 0px ${transparent3}`,
    `0px 3px 1px -2px ${transparent1},0px 2px 2px 0px ${transparent2},0px 1px 5px 0px ${transparent3}`,
    `0px 3px 3px -2px ${transparent1},0px 3px 4px 0px ${transparent2},0px 1px 8px 0px ${transparent3}`,
    `0px 2px 4px -1px ${transparent1},0px 4px 5px 0px ${transparent2},0px 1px 10px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 5px 8px 0px ${transparent2},0px 1px 14px 0px ${transparent3}`,
    `0px 3px 5px -1px ${transparent1},0px 6px 10px 0px ${transparent2},0px 1px 18px 0px ${transparent3}`,
    `0px 4px 5px -2px ${transparent1},0px 7px 10px 1px ${transparent2},0px 2px 16px 1px ${transparent3}`,
    `0px 5px 5px -3px ${transparent1},0px 8px 10px 1px ${transparent2},0px 3px 14px 2px ${transparent3}`,
    `0px 5px 6px -3px ${transparent1},0px 9px 12px 1px ${transparent2},0px 3px 16px 2px ${transparent3}`,
    `0px 6px 6px -3px ${transparent1},0px 10px 14px 1px ${transparent2},0px 4px 18px 3px ${transparent3}`,
    `0px 6px 7px -4px ${transparent1},0px 11px 15px 1px ${transparent2},0px 4px 20px 3px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 12px 17px 2px ${transparent2},0px 5px 22px 4px ${transparent3}`,
    `0px 7px 8px -4px ${transparent1},0px 13px 19px 2px ${transparent2},0px 5px 24px 4px ${transparent3}`,
    `0px 7px 9px -4px ${transparent1},0px 14px 21px 2px ${transparent2},0px 5px 26px 4px ${transparent3}`,
    `0px 8px 9px -5px ${transparent1},0px 15px 22px 2px ${transparent2},0px 6px 28px 5px ${transparent3}`,
    `0px 8px 10px -5px ${transparent1},0px 16px 24px 2px ${transparent2},0px 6px 30px 5px ${transparent3}`,
    `0px 8px 11px -5px ${transparent1},0px 17px 26px 2px ${transparent2},0px 6px 32px 5px ${transparent3}`,
    `0px 9px 11px -5px ${transparent1},0px 18px 28px 2px ${transparent2},0px 7px 34px 6px ${transparent3}`,
    `0px 9px 12px -6px ${transparent1},0px 19px 29px 2px ${transparent2},0px 7px 36px 6px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 20px 31px 3px ${transparent2},0px 8px 38px 7px ${transparent3}`,
    `0px 10px 13px -6px ${transparent1},0px 21px 33px 3px ${transparent2},0px 8px 40px 7px ${transparent3}`,
    `0px 10px 14px -6px ${transparent1},0px 22px 35px 3px ${transparent2},0px 8px 42px 7px ${transparent3}`,
    `0px 11px 14px -7px ${transparent1},0px 23px 36px 3px ${transparent2},0px 9px 44px 8px ${transparent3}`,
    `0px 11px 15px -7px ${transparent1},0px 24px 38px 3px ${transparent2},0px 9px 46px 8px ${transparent3}`,
  ];
};
const createCustomShadow = (color: string) => {
  const transparent1 = alpha(color, 0.12);
  const transparent2 = alpha(color, 0.14);
  const transparent3 = alpha(color, 0.2);
  return {
    "1": {
      boxShadow: `0px 1px 3px ${transparent1}, 0px 1px 1px ${transparent2}, 0px 2px 1px ${transparent3}`,
    },
    "2": {
      boxShadow: `0px 1px 5px ${transparent1}, 0px 2px 2px ${transparent2}, 0px 3px 1px ${transparent3}`,
    },
    "3": {
      boxShadow: `0px 1px 8px ${transparent1}, 0px 3px 4px ${transparent2}, 0px 3px 3px ${transparent3}`,
    },
    "4": {
      boxShadow: `0px 1px 10px ${transparent1}, 0px 4px 5px ${transparent2}, 0px 2px 4px ${transparent3}`,
    },
    "5": {
      boxShadow: `0px 1px 14px ${transparent1}, 0px 5px 8px ${transparent2}, 0px 3px 5px ${transparent3}`,
    },
    "6": {
      boxShadow: `0px 1px 18px ${transparent1}, 0px 6px 10px ${transparent2}, 0px 3px 5px ${transparent3}`,
    },
    "7": {
      boxShadow: `0px 2px 16px ${transparent1}, 0px 7px 10px ${transparent2}, 0px 4px 5px ${transparent3}`,
    },
    "8": {
      boxShadow: `0px 3px 14px ${transparent1}, 0px 8px 10px ${transparent2}, 0px 5px 5px ${transparent3}`,
    },
    "9": {
      boxShadow: `0px 3px 16px ${transparent1}, 0px 9px 12px ${transparent2}, 0px 5px 6px ${transparent3}`,
    },
    "10": {
      boxShadow: `0px 4px 18px ${transparent1}, 0px 10px 14px ${transparent2}, 0px 6px 6px ${transparent3}`,
    },
    "11": {
      boxShadow: `0px 4px 20px ${transparent1}, 0px 11px 15px ${transparent2}, 0px 6px 7px ${transparent3}`,
    },
    "12": {
      boxShadow: `0px 5px 22px ${transparent1}, 0px 12px 17px ${transparent2}, 0px 7px 8px ${transparent3}`,
    },
    "13": {
      boxShadow: `0px 5px 24px ${transparent1}, 0px 13px 19px ${transparent2}, 0px 7px 8px ${transparent3}`,
    },
    "14": {
      boxShadow: `0px 5px 26px ${transparent1}, 0px 14px 21px ${transparent2}, 0px 7px 9px ${transparent3}`,
    },
    "15": {
      boxShadow: `0px 6px 28px ${transparent1}, 0px 15px 22px ${transparent2}, 0px 8px 9px ${transparent3}`,
    },
    "16": {
      boxShadow: `0px 6px 30px ${transparent1}, 0px 16px 24px ${transparent2}, 0px 8px 10px ${transparent3}`,
    },
    "17": {
      boxShadow: `0px 6px 32px ${transparent1}, 0px 17px 26px ${transparent2}, 0px 8px 11px ${transparent3}`,
    },
    "18": {
      boxShadow: `0px 7px 34px ${transparent1}, 0px 18px 28px ${transparent2}, 0px 9px 11px ${transparent3}`,
    },
    "19": {
      boxShadow: `0px 7px 36px ${transparent1}, 0px 19px 29px ${transparent2}, 0px 9px 12px ${transparent3}`,
    },
    "20": {
      boxShadow: `0px 8px 38px ${transparent1}, 0px 20px 31px ${transparent2}, 0px 10px 13px ${transparent3}`,
    },
    "21": {
      boxShadow: `0px 8px 40px ${transparent1}, 0px 21px 33px ${transparent2}, 0px 10px 13px ${transparent3}`,
    },
    "22": {
      boxShadow: `0px 8px 42px ${transparent1}, 0px 22px 35px ${transparent2}, 0px 10px 14px ${transparent3}`,
    },
    "23": {
      boxShadow: `0px 9px 44px ${transparent1}, 0px 23px 36px ${transparent2}, 0px 11px 14px ${transparent3}`,
    },
    "24": {
      boxShadow: `0px 9px 46px ${transparent1}, 0px 24px 38px ${transparent2}, 0px 11px 15px ${transparent3}`,
    },
    "Outlined Light": {
      boxShadow: `0px 0px 0px rgba(224, 224, 224, 1)`,
    },
    "Outlined Dark": {
      boxShadow: `0px 0px 0px rgba(255, 255, 255, 0.12)`,
    },
    "Image Dropshadow": {
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
    },
  };
};

export type CustomShadowType = ReturnType<typeof createCustomShadow>;
export const customShadows = {
  light: createCustomShadow(LIGHT_MODE),
  dark: createCustomShadow(DARK_MODE),
};

const shadows = {
  light: createShadow(LIGHT_MODE),
  dark: createShadow(DARK_MODE),
};

export default shadows;
