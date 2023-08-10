import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";

export interface IComboBox extends Omit<TextFieldProps, "onChange"> {
  options: Record<string, any>[];
  displayKey: string;
  valueKey: string;
  onChange?: (value: any) => void;
  value?: any;
  fontSize?: string;
}

const ComboBox: React.FC<IComboBox> = ({ options, displayKey, valueKey, onChange, value, fontSize, ...textFieldProps }) => {
  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange && onChange(newValue);
      }}
      options={options}
      getOptionLabel={(option) => option[displayKey]}
      renderOption={(props, option) => (
        <li {...props} style={{ fontSize: fontSize }}>
          {option[displayKey]}
        </li>
      )}
      disableClearable
      clearOnEscape
      renderInput={
        (params) => <TextField
          {...params}
          size={textFieldProps?.size}
          variant={textFieldProps?.variant}
          color={textFieldProps?.color}
          fullWidth={textFieldProps?.fullWidth}
          sx={textFieldProps?.sx}
          InputProps={{
            ...params.InputProps,
            sx: { fontSize: fontSize }
          }}
        />
      }
    />
  );
};

export default ComboBox;