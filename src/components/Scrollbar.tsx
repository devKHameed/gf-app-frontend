import { styled, useTheme } from "@mui/material/styles";
import React, { ReactElement, ReactNode, useEffect, useRef } from "react";
import { ScrollbarProps, Scrollbars } from "react-custom-scrollbars-2";
import Measure, { MeasuredComponentProps } from "react-measure";
import { useLocation } from "react-router-dom";

type Props = Omit<ScrollbarProps, "as"> & {
  children?: ReactNode;
  as?: any;
};

const StyledScrollbar = styled(Scrollbars)<ScrollbarProps>(({ theme }) => ({
  ".thumb-vertical ": {
    borderRadius: "6px",
    background: theme.palette.background.GF40,
    /* added this index as it was going behind the menu items */
    zIndex: "10000000000",
  },

  ".thumb-horizontal": {
    borderRadius: "6px",
    background: theme.palette.background.GF40,
  },
}));

export default React.forwardRef<Scrollbars | undefined, Props>(
  function Scrollbar({ children, ...rest }, refProp): ReactElement {
    let dir: string = useTheme()?.direction;
    if (rest.dir) {
      dir = rest.dir;
    }
    const ref = useRef<Scrollbars>(null);
    const location = useLocation();

    useEffect(() => {
      setTimeout(() => {
        ref?.current?.forceUpdate();
      }, 700);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, ref?.current]);

    React.useImperativeHandle(refProp, () => ref.current as any, []);

    return (
      <StyledScrollbar
        className={`customscrollbar ${rest.className} ${
          dir === "rtl" ? "rtlSide" : ""
        }`}
        autoHide
        renderThumbVertical={(props) => (
          <div {...props} className="thumb-vertical" />
        )}
        renderThumbHorizontal={(props) => (
          <div {...props} className="thumb-horizontal" />
        )}
        {...rest}
        ref={ref}
      >
        <Measure
          bounds
          onResize={() => {
            ref?.current?.forceUpdate();
          }}
        >
          {({ measureRef }: MeasuredComponentProps) => (
            <div ref={measureRef} className="rc-scollbar">
              {children}
            </div>
          )}
        </Measure>
      </StyledScrollbar>
    );
  }
);
