import { MailOutline, PhoneOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  styled,
} from "@mui/material";
import AccountTypeDataProvider from "components/Form/DataProviders/AccountTypeDataProvider";
import FormFieldWrapper from "components/Form/FormFieldWrapper";
import Label from "components/Form/Label";
import ToolTipInput from "components/Form/TooltipFields/Input";
import TooltipSelector from "components/Form/TooltipSelector";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { FormType } from "./MiddleComponent";

type Props = {
  register: UseFormRegister<Partial<FormType>>;
  errors: FieldErrors<Partial<FormType>>;
  control: Control<Partial<FormType>, any>;
};

export const LabelHolder = styled(Grid)(({ theme }) => ({
  ".MuiFormLabel-root": {
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "400",
    color: theme.palette.text.primary,
  },

  [`${theme.breakpoints.down("sm")}`]: {
    marginBottom: "20px",
  },
}));

export const RDivider = styled(Divider)(({ theme }) => ({
  margin: "30px 0",

  [`${theme.breakpoints.down("sm")}`]: {
    margin: "20px 0",
  },
}));

export const StackHolder = styled(Stack)(({ theme }) => ({
  // maxWidth: "400px",
  padding: "0 0 0 10px",

  ".MuiFormLabel-root ": {
    fontSize: "14px",
    lineHeight: "20px",
    color: theme.palette.text.primary,
    margin: "0 0 8px",
  },
}));

const BasicComponent = ({ register, errors, control }: Props) => {
  return (
    <Box>
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="User Type" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <FormFieldWrapper
              name={"account_user_type"}
              label={"Primary"}
              render={({ field }) => {
                return (
                  <AccountTypeDataProvider>
                    <TooltipSelector actionButtons={false} {...field} />
                  </AccountTypeDataProvider>
                );
              }}
            />
          </StackHolder>
        </Grid>
      </Grid>
      <RDivider />
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="Email Address" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <ToolTipInput
              name={"email"}
              label={"Primary"}
              disabled
              baseElementProps={{
                autoFocus: true,
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline />
                    </InputAdornment>
                  ),
                },
              }}
              tooltipInlineElementProps={{
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </StackHolder>
        </Grid>
      </Grid>
      <RDivider />
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="Phone Number" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <ToolTipInput
              name={"phone"}
              label={"Primary"}
              baseElementProps={{
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlined />
                    </InputAdornment>
                  ),
                },
              }}
              tooltipInlineElementProps={{
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlined />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </StackHolder>
        </Grid>
      </Grid>
      <RDivider />
      <Grid container>
        <LabelHolder item xs={12} sm={5}>
          <Label label="Mailing address" />
        </LabelHolder>
        <Grid item sm={7} xs={12}>
          <StackHolder spacing={2.5}>
            <ToolTipInput
              name={"mailing_address.address1"}
              label={"Address line 1"}
            />
            <ToolTipInput
              name={"mailing_address.address2"}
              label={"Address line 2"}
            />
            <ToolTipInput name={"mailing_address.city"} label={"City"} />
            <ToolTipInput name={"mailing_address.state"} label={"State"} />
            <ToolTipInput name={"mailing_address.zip"} label={"Zip"} />
          </StackHolder>
        </Grid>
      </Grid>
      <RDivider />
    </Box>
  );
};

export default BasicComponent;
