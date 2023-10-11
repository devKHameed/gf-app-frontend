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

const mountVariants: Variants = {
  enter: ({ direction, active }: { direction: number; active: boolean }) => {
    return {
      position: "absolute",
      left: "-100%",
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
  updateQuery?: { id?: boolean; name?: boolean };
};

export type Config = {
  getComponents(
    gotoComponent: (
      component: TransitionComponent,
      options?: GotoComponentOptions
    ) => void,
    goBack: () => void
  ): Record<string, React.ReactElement>;
  initialComponent: keyof ReturnType<Config["getComponents"]>;
};

export type AnimationLayoutRef = {
  reset: () => void;
  gotoComponent: (
    component: TransitionComponent,
    options?: GotoComponentOptions
  ) => void;
  goBack: () => void;
  setTransitionHistory: (value: TransitionComponent[]) => void;
  getTransitionHistory: () => TransitionComponent[];
};

export type TransitionComponent = {
  name: keyof ReturnType<Config["getComponents"]>;
  id: string;
};

const AnimationLayout = React.forwardRef<
  AnimationLayoutRef,
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
    useState<TransitionComponent | null>(
      initialComponent ? { name: initialComponent, id: initialComponent } : null
    );
  const [direction, setDirection] = useState(1);
  const transitionHistory = useRef<TransitionComponent[]>(
    selectedComponent ? [selectedComponent] : []
  );
  const scrollbarRef = useRef<Scrollbars>();

  const reset = useCallback(() => {
    transitionHistory.current = [
      { name: initialComponent, id: initialComponent },
    ];
    setTimeout(() => {
      setSelectedComponent((state) => {
        if (state?.name !== initialComponent)
          return { name: initialComponent!, id: initialComponent };
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
      const updateQueryId = options?.updateQuery?.id ?? true;
      const updateQueryName = options?.updateQuery?.name ?? true;
      setDirection(1);
      if (updateHistory) {
        transitionHistory.current.push(component);
      }
      setTimeout(() => {
        updateQuery(component, updateQueryId, updateQueryName);
        setSelectedComponent(component);
        scrollbarRef.current?.scrollToTop();
      }, Infinity - 1);
    },
    [urlQueryKey]
  );

  const updateQuery = (
    component: TransitionComponent,
    updateQueryId: boolean,
    updateQueryName: boolean
  ) => {
    if (updateQueryId || updateQueryName) {
      setSearchParams((prev) => {
        const newParams = { ...prev };
        if (updateQueryId) {
          newParams[urlQueryKey] = component.id;
        }

        if (updateQueryName) {
          newParams[`${urlQueryKey}_name`] = component.name;
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
          [urlQueryKey]: comp.id,
          [`${urlQueryKey}_name`]: comp.name,
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
      <Container sx={sx} className="animation-parent">
        {Object.keys(components).map((key: string) => {
          return (
            <motion.div
              custom={{ direction, active: key === selectedComponent?.name }}
              variants={mountVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                mass: 0.2,
                duration: 0.4,
              }}
              key={key}
            >
              {components[key]}
            </motion.div>
          );
        })}
      </Container>
    );

  if (enableScrollbar)
    return (
      <Container className="animation-parent">
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
              key={`${selectedComponent?.id}:${selectedComponent?.name}`}
            >
              {selectedComponent ? components[selectedComponent.name] : null}
            </motion.div>
          </AnimatePresence>
        </Scrollbar>
      </Container>
    );
  return (
    <Container className="animation-parent">
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
          key={`${selectedComponent?.id}:${selectedComponent?.name}`}
        >
          {selectedComponent ? components[selectedComponent.name] : null}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
});

export default AnimationLayout;
