import SvgIcon from "@mui/material/SvgIcon";

const SVGComp = () => {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.72727 2.59595V12.3737H17.2727V2.59595H2.72727ZM0.909091 1.71329C0.909091 1.21907 1.32273 0.818176 1.81091 0.818176H18.1891C18.6873 0.818176 19.0909 1.21729 19.0909 1.71329V14.1515H0.909091V1.71329ZM0 15.0404H20V16.8182H0V15.0404Z"
        fill="currentColor"
      />
      <path
        d="M13.6363 5.26263H6.36353V6.74412H13.6363V5.26263Z"
        fill="currentColor"
      />
      <path
        d="M13.6363 8.2256H6.36353V9.70708H13.6363V8.2256Z"
        fill="currentColor"
      />
    </svg>
  );
};

const GuiIcon: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={SVGComp}
      className="plus-icon"
    />
  );
};

export default GuiIcon;
