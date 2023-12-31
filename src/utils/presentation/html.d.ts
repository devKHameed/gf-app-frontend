import Konva from "konva";
import { HTMLAttributes, PropsWithChildren } from "react";
export type HtmlTransformAttrs = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  skewX: number;
  skewY: number;
};
export type HtmlProps = PropsWithChildren<{
  groupProps?: Konva.ContainerConfig;
  divProps?: HTMLAttributes<HTMLDivElement>;
  transform?: boolean;
  transformFunc?: (attrs: HtmlTransformAttrs) => HtmlTransformAttrs;
}>;
export declare const Html: ({
  children,
  groupProps,
  divProps,
  transform,
  transformFunc,
}: HtmlProps) => JSX.Element;
