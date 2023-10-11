type IBGVariant = {
  colors?: string[];
  duration?: number;
  ease?: string;
};
type IBounceVariant = {
  durationIn?: number;
  durationOut?: number;
  easeIn?: string;
  easeOut?: string;
};
type IContainerVariant = {
  staggerIn?: number;
};
type IFadeVariant = IBounceVariant & {
  distance?: number | string;
};
type IFlipVariant = IBounceVariant;
type IZoomVariant = IFadeVariant;
type IRotateVariant = IBounceVariant;
type IScaleVariant = IBounceVariant;
type ISlideVariant = IFadeVariant;
type ITransitionVariant = {
  durationIn?: number;
  durationOut?: number;
  easeIn?: string;
  easeOut?: string;
  ease?: string;
  duration?: number;
};
