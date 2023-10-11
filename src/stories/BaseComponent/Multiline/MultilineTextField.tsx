import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
type Props = TextFieldProps;

const MultilineTextField = (props: Props) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="outlined-multiline-flexible"
          label="Multiline"
          multiline
          hiddenLabel
          maxRows={4}
          {...props}
        />
        <TextField
          id="outlined-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          hiddenLabel
          {...props}
        />
        <TextField
          id="outlined-multiline-static"
          label="Multiline"
          multiline
          hiddenLabel
          rows={4}
          defaultValue="Default Value"
          {...props}
        />
      </div>
      <div>
        <TextField
          id="filled-multiline-flexible"
          label="Multiline"
          multiline
          hiddenLabel
          maxRows={4}
          variant="filled"
          {...props}
        />
        <TextField
          id="filled-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          hiddenLabel
          variant="filled"
          {...props}
        />
        <TextField
          id="filled-multiline-static"
          label="Multiline"
          multiline
          hiddenLabel
          rows={4}
          defaultValue="Default Value"
          variant="filled"
          {...props}
        />
      </div>
      <div>
        <TextField
          id="standard-multiline-flexible"
          label="Multiline"
          multiline
          hiddenLabel
          maxRows={4}
          variant="standard"
          {...props}
        />
        <TextField
          id="standard-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          hiddenLabel
          variant="standard"
          {...props}
        />
        <TextField
          id="standard-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          hiddenLabel
          defaultValue="Default Value"
          variant="standard"
          {...props}
        />
      </div>
    </Box>
  );
};

export default MultilineTextField;
