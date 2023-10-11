export const POINTS_TO_INCHES = 1 / 72;

export const layoutToInches = (
  layout:
    | "16x9"
    | "16x10"
    | "4x3"
    | "wide"
    | "custom"
    | { width: number; height: number }
): [number, number] => {
  switch (layout) {
    case "16x10":
      return [10, 6.25];
    case "16x9":
      return [10, 5.625];
    case "4x3":
      return [10, 7.5];
    case "wide":
      return [13.3, 7.5];
    default:
      return typeof layout === "object" && Object.keys(layout).length > 0
        ? [layout.width, layout.height]
        : [0, 0];
  }
};
