import type { ComponentMeta, ComponentStory } from "@storybook/react";

import CBox, { CheckboxProps } from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const CheckBox = (props: CheckboxProps) => {
  return <CBox {...label} {...props} />;
};
export default {
  title: "Components/Checkbox",
  component: CBox,
  argTypes: {
    checked: {
      type: "boolean",
      defaultValue: true,
    },
    indeterminate: {
      type: "boolean",
      defaultValue: false,
    },
  },
} as ComponentMeta<typeof CBox>;

export const Default: ComponentStory<typeof CheckBox> = (props) => {
  const [checked, setChecked] = useState(props.checked);
  return (
    <CheckBox
      {...props}
      checked={checked}
      indeterminate={props.indeterminate && checked}
      onChange={(e, checked) => {
        setChecked(checked);
      }}
    />
  );
};

export const MinusIcon: ComponentStory<typeof CheckBox> = (props) => {
  const [checked, setChecked] = useState(props.checked);
  return (
    <CheckBox
      {...props}
      checked={checked}
      indeterminate={props.indeterminate && checked}
      onChange={(e, checked) => {
        setChecked(checked);
      }}
    />
  );
};

MinusIcon.argTypes = {
  indeterminate: {
    type: "boolean",
    defaultValue: true,
  },
};
export const WithLabel: ComponentStory<typeof CheckBox> = (props) => {
  const [checked, setChecked] = useState(props.checked);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setChecked(checked);
  };
  return (
    <FormControlLabel
      label="Child 2"
      control={<CheckBox checked={checked} onChange={handleChange} />}
    />
  );
};

MinusIcon.argTypes = {
  indeterminate: {
    type: "boolean",
    defaultValue: true,
  },
};
export const WithGroupError: ComponentStory<typeof CheckBox> = (props) => {
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { gilad, jason, antoine } = state;

  return (
    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
      <FormLabel component="legend">Assign responsibility</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <CheckBox checked={gilad} onChange={handleChange} name="gilad" />
          }
          label="Gilad Gray"
        />
        <FormControlLabel
          control={
            <CheckBox checked={jason} onChange={handleChange} name="jason" />
          }
          label="Jason Killian"
        />
        <FormControlLabel
          control={
            <CheckBox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
            />
          }
          label="Antoine Llorca"
        />
      </FormGroup>
      <FormHelperText>Be careful</FormHelperText>
    </FormControl>
  );
};

WithGroupError.argTypes = {};
export const WithGroupLabel: ComponentStory<typeof CheckBox> = (props) => {
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;
  return (
    <FormControl
      required
      error={error}
      component="fieldset"
      sx={{ m: 3 }}
      variant="standard"
    >
      <FormLabel component="legend">Pick two</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <CheckBox checked={gilad} onChange={handleChange} name="gilad" />
          }
          label="Gilad Gray"
        />
        <FormControlLabel
          control={
            <CheckBox checked={jason} onChange={handleChange} name="jason" />
          }
          label="Jason Killian"
        />
        <FormControlLabel
          control={
            <CheckBox
              checked={antoine}
              onChange={handleChange}
              name="antoine"
            />
          }
          label="Antoine Llorca"
        />
      </FormGroup>
      <FormHelperText>You can display an error</FormHelperText>
    </FormControl>
  );
};

WithGroupLabel.argTypes = {};
