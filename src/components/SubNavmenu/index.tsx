import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import { List, ListItem, styled } from "@mui/material";
import classNames from "classnames";
import { ReactNode, useEffect, useRef, useState } from "react";
import { NavLink, RouteProps } from "react-router-dom";
const MenuList = styled(List)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0 13px 0 0",
  fontSize: "15px",
  lineHeight: "24px",
  fontWeight: "400",

  li: {
    width: "auto",
    padding: "0 4px",

    "&:hover": {
      ">a": {
        background: theme.palette.background.GF10,
      },
    },

    a: {
      textDecoration: "none",
      color: theme.palette.common.white,
      padding: "3px 9px",
      width: "auto",
      cursor: "pointer",
      display: "block",
      transition: "all 0.4s ease",
      borderRadius: "4px",
      margin: "5px 0",

      "&:hover": {
        background: theme.palette.background.GF10,
      },
    },
  },

  ".multilevel": {
    position: "absolute",
    left: "0",
    top: "100%",
    width: "185px",
    padding: "0",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
    background: theme.palette.background.TableCustomBG,
    borderRadius: "2px",
    display: "block",

    ".multilevel": {
      left: "100%",
      top: "0",
    },

    ".arrow-right": {
      margin: "0 -6px 0 auto",
    },

    li: {
      padding: "0",
      width: "100%",

      "&:hover": {
        ">a": {
          background: theme.palette.background.GF10,
        },
      },

      a: {
        fontSize: "14px",
        lineHeight: "18px",
        fontWeight: "500",
        padding: "10px 15px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        width: "100%",
        margin: "0",

        "&:hover": {
          backgroound: theme.palette,
        },

        svg: {
          width: "20px",
          height: "auto",
          display: "block",
        },
      },
    },
  },
}));
type INavItemsProps = {
  routeIndex?: number;
  level?: number;
  routes: IRoute[];
  isOpen?: boolean;
};
export type IRoute = Omit<RouteProps, "children"> & {
  title: ReactNode;
  Icon?: ReactNode;
  children?: IRoute[];
};

type INavItemProps = {
  routeIndex: number;
  level: number;
  route: IRoute;
};
const Index = (props: INavItemsProps) => {
  const { routes, routeIndex = 0, level = 0, isOpen = false } = props;

  return (
    <>
      <MenuList
        key={`${level}-${routeIndex}-${level}`}
        className={classNames(
          `menus ${level === 0 ? `menu-level-${level}` : "multilevel"}
            ${isOpen ? "show" : "hide"}
            `
        )}
      >
        {routes.map((ele, routeIndex) => {
          return <NavItem route={ele} routeIndex={routeIndex} level={level} />;
        })}
      </MenuList>
    </>
  );
};
const NavItem = (props: INavItemProps) => {
  const { route, routeIndex = 0, level = 0 } = props;
  const [dropdown, setDropdown] = useState(false);
  let ref = useRef<any>(null);

  useEffect(() => {
    const handler = (event: any) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);
  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false);
  };
  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };
  if (!route.children?.length) {
    return (
      <ListItem
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={closeDropdown}
        ref={ref}
        key={`${route.title}-${routeIndex} menu-items menu-item-level-${level}`}
        className={`list-item item-level-${level}`}
      >
        <NavLink to={`${route.path}`}>
          {route.Icon} {route.title}
        </NavLink>
      </ListItem>
    );
  }
  return (
    <ListItem
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      key={`${route.title}-${routeIndex}`}
      className={`list-item  menu-items menu-item-level-${level}`}
      ref={ref}
    >
      <NavLink
        to={`${route.path}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDropdown((prev) => !prev);
        }}
      >
        {route.Icon} {route.title}{" "}
        {level !== 0 ? (
          <span className="arrow-right">
            <ArrowRightOutlinedIcon />
          </span>
        ) : null}
      </NavLink>
      {dropdown ? (
        <Index
          isOpen={dropdown}
          key={`${route.title}-${routeIndex}`}
          routes={route.children}
          routeIndex={routeIndex}
          level={level + 1}
        />
      ) : null}
    </ListItem>
  );
};
export default Index;
