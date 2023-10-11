import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Scrollbar from "components/Scrollbar";
import { AnimatePresence, motion, Variants } from "framer-motion";
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { setSearchParams } from "utils";

export enum LAYOUT_VIEW {
  Left = "left",
  Right = "right",
}

const mountVariants: Variants = {
  enter: ({ direction, active }: { direction: number; active: boolean }) => {
    return {
      position: "absolute",
      left: active ? "0" : direction > 0 ? "100%" : "-100%",
      opacity: 0,
      width: "100%",
      zIndex: 0,
      top: 0,
    };
  },
  center: ({ direction, active }: { direction: number; active: boolean }) => ({
    position: "absolute",
    zIndex: 1,
    left: active ? "0" : direction > 0 ? "100%" : "-100%",
    opacity: active ? 1 : 0,
    width: "100%",
    top: 0,
  }),
};
const variants: Variants = {
  enter: (direction: number) => {
    return {
      position: "absolute",
      left: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      width: "100%",
      zIndex: 0,
      top: 0,
    };
  },
  center: {
    position: "absolute",
    zIndex: 1,
    left: "0",
    opacity: 1,
    width: "100%",
    top: 0,
  },
  exit: (direction: number) => {
    return {
      position: "absolute",
      left: direction > 0 ? "-100%" : "100%",
      zIndex: 0,
      opacity: 0,
      width: "100%",
      top: 0,
    };
  },
};

const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  position: "relative",
}));

export type AnimationLayoutProps = {
  config: Config;
  enableScrollbar?: boolean;
  urlQueryKey?: string;
  dontUnmount?: boolean;
} & Pick<React.ComponentProps<typeof Container>, "sx">;

export type GotoComponentOptions = {
  updateHistory?: boolean;
  updateQuery?: { name?: boolean };
};

export type Config = {
  getComponents(
    gotoComponent: (
      component: TransitionComponent,
      options?: GotoComponentOptions
    ) => void,
    goBack: () => void
  ): Record<`${LAYOUT_VIEW}`, React.ReactElement>;
  initialComponent: keyof ReturnType<Config["getComponents"]>;
};

export type TwoPanelLayoutRef = {
  reset: () => void;
  gotoComponent: (
    component: TransitionComponent,
    options?: GotoComponentOptions
  ) => void;
};

export type TransitionComponent = keyof ReturnType<Config["getComponents"]>;

const TwoPanelLayout = React.forwardRef<
  TwoPanelLayoutRef,
  AnimationLayoutProps
>((props, ref) => {
  const {
    config,
    enableScrollbar,
    urlQueryKey = "c",
    dontUnmount = false,
    sx,
  } = props;
  const { getComponents, initialComponent } = config;

  const [selectedComponent, setSelectedComponent] =
    useState<TransitionComponent | null>(initialComponent);
  const [direction, setDirection] = useState(1);
  const transitionHistory = useRef<TransitionComponent[]>(
    selectedComponent ? [selectedComponent] : []
  );
  const scrollbarRef = useRef<Scrollbars>();

  const reset = useCallback(() => {
    transitionHistory.current = [initialComponent];
    setTimeout(() => {
      setSelectedComponent((state) => {
        if (state !== initialComponent) return initialComponent;
        return state;
      });
      scrollbarRef.current?.scrollToTop();
    }, 0);
  }, [initialComponent]);

  useImperativeHandle(
    ref,
    () => ({
      reset,
      gotoComponent,
      goBack,
      setTransitionHistory,
      getTransitionHistory,
    }),
    [reset]
  );

  const setTransitionHistory = (value: TransitionComponent[]) => {
    transitionHistory.current = value;
  };

  const getTransitionHistory = () => {
    return transitionHistory.current;
  };

  const gotoComponent = React.useCallback(
    (component: TransitionComponent, options?: GotoComponentOptions) => {
      const updateHistory = options?.updateHistory ?? true;
      const updateQueryName = options?.updateQuery?.name ?? true;
      setDirection(component === "left" ? 1 : 0);
      if (updateHistory) {
        transitionHistory.current.push(component);
      }
      setTimeout(() => {
        updateQuery(component, updateQueryName);
        setSelectedComponent(component);
        scrollbarRef.current?.scrollToTop();
      }, Infinity - 1);
    },
    [urlQueryKey]
  );

  const updateQuery = (
    component: TransitionComponent,
    updateQueryName: boolean
  ) => {
    if (updateQueryName) {
      setSearchParams((prev) => {
        const newParams = { ...prev };

        if (updateQueryName) {
          newParams[`${urlQueryKey}_name`] = component;
        }

        return newParams;
      });
    }
  };

  const goBack = React.useCallback(() => {
    setDirection(0);
    transitionHistory.current.pop();
    const comp =
      transitionHistory.current[transitionHistory.current.length - 1];
    setTimeout(() => {
      setSearchParams((prev) => {
        return {
          ...prev,
          [`${urlQueryKey}_name`]: comp,
        };
      });
      setSelectedComponent(comp);
      scrollbarRef.current?.scrollToTop();
    }, Infinity - 1);
  }, [urlQueryKey]);

  const components = React.useMemo(() => {
    return getComponents(gotoComponent, goBack);
  }, [goBack, gotoComponent, getComponents]);

  if (dontUnmount)
    return (
      <Container sx={sx}>
        <motion.div
          custom={{ direction, active: selectedComponent === LAYOUT_VIEW.Left }}
          variants={mountVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            mass: 0.2,
            duration: 0.4,
          }}
          key={LAYOUT_VIEW.Left}
        >
          {components[LAYOUT_VIEW.Left]}
        </motion.div>
        <motion.div
          custom={{
            direction,
            active: selectedComponent === LAYOUT_VIEW.Right,
          }}
          variants={mountVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            mass: 0.2,
            duration: 0.4,
          }}
          key={LAYOUT_VIEW.Right}
        >
          {components[LAYOUT_VIEW.Right]}
        </motion.div>
      </Container>
    );

  if (enableScrollbar)
    return (
      <Container>
        <Scrollbar ref={scrollbarRef}>
          <AnimatePresence initial={false}>
            <motion.div
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                mass: 0.2,
                duration: 0.4,
              }}
              key={selectedComponent}
            >
              {selectedComponent ? components[selectedComponent] : null}
            </motion.div>
          </AnimatePresence>
        </Scrollbar>
      </Container>
    );
  return (
    <Container>
      <AnimatePresence initial={false}>
        <motion.div
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            mass: 0.2,
            duration: 0.4,
          }}
          key={selectedComponent}
        >
          {selectedComponent ? components[selectedComponent] : null}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
});

export default TwoPanelLayout;
