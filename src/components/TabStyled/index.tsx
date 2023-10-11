import { Stack, Typography, useTheme } from "@mui/material";

type TabStyledProps = {
  title: string;
  counter?: number;
};

const TabStyled: React.FC<TabStyledProps> = (props) => {
  const { title, counter } = props;

  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1}>
      <Typography className="tab-text" sx={{ color: "#fff" }}>
        {title}
      </Typography>
      {counter != null && (
        <Typography
          sx={{ color: theme.palette.background.GF40 }}
          className="counter"
        >
          {counter}
        </Typography>
      )}
    </Stack>
  );
};

export default TabStyled;
