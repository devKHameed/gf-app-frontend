// const lightPallete = lightTheme.palette;
import Appthemes from "theme/palette";
import tinycolor from "tinycolor2";
// export const colorPresets = [
//   // DEFAULT
//   // {
//   //   name: "default",
//   //   ...lightPallete.primary,
//   // },
//   // PURPLE
//   // {
//   //   name: "purple",
//   //   lighter: "#EBD6FD",
//   //   light: "#B985F4",
//   //   main: "#7635dc",
//   //   dark: "#431A9E",
//   //   darker: "#200A69",
//   //   contrastText: "#fff",
//   // },
//   // // CYAN
//   // {
//   //   name: "cyan",
//   //   lighter: "#D1FFFC",
//   //   light: "#76F2FF",
//   //   main: "#1CCAFF",
//   //   dark: "#0E77B7",
//   //   darker: "#053D7A",
//   //   contrastText: lightPallete.grey[800],
//   // },
//   // // BLUE
//   // {
//   //   name: "blue",
//   //   lighter: "#D1E9FC",
//   //   light: "#76B0F1",
//   //   main: "#2065D1",
//   //   dark: "#103996",
//   //   darker: "#061B64",

//   //   contrastText: "#fff",
//   // },
//   // // ORANGE
//   // {
//   //   name: "orange",
//   //   lighter: "#FEF4D4",
//   //   light: "#FED680",
//   //   main: "#fda92d",
//   //   dark: "#B66816",
//   //   darker: "#793908",
//   //   contrastText: lightPallete.grey[800],
//   // },
//   // // RED
//   // {
//   //   name: "red",
//   //   lighter: "#FFE3D5",
//   //   light: "#FFC1AC",
//   //   main: "#FF3030",
//   //   dark: "#B71833",
//   //   darker: "#7A0930",
//   //   contrastText: "#fff",
//   // },
// ];

export const getSystemRouteModule = (route: string) => {
  switch (route) {
    case "/dataset-design":
      return "dataset-design-module";
    case "/vector-knowledgebase-module":
      return "vector-knowledgebase-module";
    case "/finetune-knowledgebase-module":
      return "finetune-knowledgebase-module";
    case "/import-module":
      return "import-module";
    case "/gui-module":
      return "gui-module";
    case "/fusion":
      return "fusion-module";
    case "/skill-design":
      return "skill-design-module";
    case "/datacard-design-module":
      return "datacard-design-module";
    case "/presentation":
      return "presentation-module";
    case "/portal-module":
      return "portal-module";
    case "/icons":
      return "icon-module";
    case "/fusion-action-module":
      return "fusion-action-module";
    case "/account-user-module":
      return "account-user-module";
    case "/user-type-module":
      return "user-type-module";
    case "/settings":
    case "/chat":
      return "sylar-module";
    case "/skills":
      return "skill-module";
  }
};

export const getRouteColor = (routeModule?: string) => {
  let color = tinycolor("rgba(140, 59, 45, 1)");

  switch (routeModule) {
    case "fusion-action-module": {
      color = tinycolor("#3B1D66");
      break;
    }
    case "dataset-design-module":
    case "vector-knowledgebase-module":
    case "import-module": {
      color = tinycolor("#6B2013");
      break;
    }
    case "datacard-design-module": {
      color = tinycolor("#568216");
      break;
    }
    case "fusion-module":
    case "skill-design-module": {
      color = tinycolor("#A87C14");
      break;
    }
    case "gui-dashboard-module":
    case "gui-module": {
      color = tinycolor("#97461A");
      break;
    }
    case "presentation-module":
    case "portal-module":
    case "icon-module": {
      color = tinycolor("#20745E");
      break;
    }
    case "account-user-module":
    case "user-type-module": {
      color = tinycolor("#631A58");
      break;
    }
    case "skill-module": {
      color = tinycolor("#112672");
      break;
    }
    case "sylar-module": {
      color = tinycolor("#881838");
      break;
    }
  }

  return color;
};

export const appThemeModes = [
  {
    name: "dark",
    theme: Appthemes["dark"],
    value: "#343434",
  },
  { name: "light", theme: Appthemes["light"], value: "#FAF9F6" },
  {
    name: "blue",
    value: "#8A8AFF",
    theme: Appthemes["blue"],
  },
];
export const lighttheme = appThemeModes[0];
export const darktheme = appThemeModes[1];
export const bluetheme = appThemeModes[2];
export default function getThemeMode(presetsKey: string, routeModule?: string) {
  const colorIndex = appThemeModes.findIndex((p) => p.name === presetsKey);
  let themeModes = appThemeModes[0];
  if (colorIndex !== -1) {
    themeModes = appThemeModes[colorIndex];
  }

  const color = getRouteColor(routeModule);

  // console.log(color.setAlpha(0.08).toRgbString());
  themeModes.theme.palette.primary.main = color.toRgbString();
  themeModes.theme.palette.primary.light = color
    .clone()
    .lighten(10)
    .toRgbString();
  themeModes.theme.palette.primary.dark = color
    .clone()
    .darken(10)
    .toRgbString();
  themeModes.theme.palette.primary.shades = {
    "8p": color.clone().setAlpha(0.08).toRgbString(),
    "12p": color.clone().setAlpha(0.12).toRgbString(),
    "16p": color.clone().setAlpha(0.16).toRgbString(),
    "30p": color.clone().setAlpha(0.3).toRgbString(),
    "50p": color.clone().setAlpha(0.5).toRgbString(),
  };
  return themeModes;
  // return {
  //   light: lighttheme,
  //   dark: darktheme,
  //   blue: bluetheme,
  //   default: lighttheme,
  // };
}

// export const defaultPreset = colorPresets[0];
// export const purplePreset = colorPresets[1];
// export const cyanPreset = colorPresets[2];
// export const bluePreset = colorPresets[3];
// export const orangePreset = colorPresets[4];
// export const redPreset = colorPresets[5];

// export default function getColorPresets(presetsKey: string) {
//   const colorIndex = colorPresets.findIndex((p) => p.name === presetsKey);
//   if (colorIndex !== -1) {
//     return colorPresets[colorIndex];
//   }

//   return {
//     purple: purplePreset,
//     cyan: cyanPreset,
//     blue: bluePreset,
//     orange: orangePreset,
//     red: redPreset,
//     default: defaultPreset,
//   };
// }
