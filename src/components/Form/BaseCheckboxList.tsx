import { Box, Checkbox, FormControlLabel, styled } from "@mui/material";

interface CheckboxListProps {
  options: { label: string; value: string }[];
  name: string;
  value: string[];
  onChange: (value: string[]) => void;
  compact?: boolean;
}

export const CheckWrapper = styled(Box)<{
  compact?: boolean;
}>(({ compact, theme }) => ({
  ...(compact && {
    ".MuiFormControlLabel-root ": {
      display: "block",
      height: "40px",
      padding: "8px 12px 8px 16px",
      borderRadius: "5px",
      background: theme.palette.background.GF5,
      color: theme.palette.text.primary,
      position: "relative",
      margin: "0",

      "+ .MuiFormControlLabel-root ": {
        marginTop: "10px",
      },

      ".MuiButtonBase-root ": {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translate(0, -50%)",
        width: "32px",
        height: "18px",
        padding: "0",
        background: theme.palette.common.blackshades?.["30p"],
        borderRadius: "9px",
        transition: "all 0.4s ease",

        "&.Mui-checked": {
          background: theme.palette.text.primary_shades?.["30p"],

          "&:before": {
            left: "16px",
            background: theme.palette.text.primary,
          },
        },

        "&:before": {
          position: "absolute",
          left: "2px",
          top: "2px",
          width: "14px",
          height: "14px",
          background: theme.palette.background.GF40,
          borderRadius: "100%",
          content: `""`,
          transition: "all 0.4s ease",
        },
      },

      ".MuiTypography-root": {
        fontSize: "15px",
        lineHeight: "18px",
        fontWeight: "400",
        textTransform: "capitalize",
      },

      ".MuiSvgIcon-root ": {
        display: "none",
      },

      ".MuiTouchRipple-root": {
        display: "none",
      },
    },
  }),
}));

function BaseCheckboxList({
  options,
  name,
  compact,
  value,
  onChange,
}: CheckboxListProps) {
  const handleChange = (newValue: string) => {
    const values = [...value];
    if (values.includes(newValue)) {
      values.splice(values.indexOf(newValue), 1);
    } else {
      values.push(newValue);
    }
    onChange(values);
  };

  return (
    <CheckWrapper compact={compact}>
      {options.map(({ label, value: optionValue }) => (
        <FormControlLabel
          key={optionValue}
          control={
            <>
              <Checkbox
                checked={value.includes(optionValue)}
                onChange={() => handleChange(optionValue)}
                value={optionValue}
              />
            </>
          }
          label={label}
        />
      ))}
    </CheckWrapper>
  );
}

export default BaseCheckboxList;
