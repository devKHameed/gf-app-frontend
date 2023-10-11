import SvgIcon from "@mui/material/SvgIcon";

const SVGComp = () => {
  return (
    <svg
      width="21"
      height="12"
      viewBox="0 0 21 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.33984 12L0.339844 6L6.33984 0L7.76484 1.425L3.16484 6.025L7.73984 10.6L6.33984 12ZM14.3398 12L12.9148 10.575L17.5148 5.975L12.9398 1.4L14.3398 0L20.3398 6L14.3398 12Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DeveloperIcon: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={SVGComp}
      className="plus-icon"
    />
  );
};

export default DeveloperIcon;
