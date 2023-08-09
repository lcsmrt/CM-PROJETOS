import React, { ChangeEvent } from "react";
import { IMaskInput } from "react-imask";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { NumberFormatBase, NumericFormat } from "react-number-format";
import { formataDataISOParaBR } from "../utils/formataDataISOParaBR";

interface ITextMask {
  maskType: "date" | "money" | "custom";
  customMask?: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextFieldMask = React.forwardRef<HTMLInputElement, ITextMask>((props, ref) => {
  const { maskType, customMask, onChange, ...other } = props;

  if (props.maskType === "money") {
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        valueIsNumericString
        prefix="R$ "
      />
    )
  }

  let mask;

  switch (maskType) {
    case "date":
      mask = "00 / 00 / 0000";
      break;
    case "custom":
      mask = customMask;
      break;
    default:
      throw new Error("Invalid mask type");
  }

  return (
    <IMaskInput
      {...other}
      mask={mask}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

interface IMaskedTextField extends Omit<TextFieldProps, "onChange"> {
  maskType: "date" | "money" | "custom";
  customMask?: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MaskedTextField: React.FC<IMaskedTextField> = ({ maskType, customMask, name, value, onChange, ...textFieldProps }) => {
  let displayValue = value;
  if (maskType === "date" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    displayValue = formataDataISOParaBR(value);
  }
  return (
    <TextField
      name={name}
      value={displayValue}
      onChange={onChange}
      {...textFieldProps}
      InputProps={{
        inputComponent: TextFieldMask as any,
        inputProps: { maskType, customMask, name },
        sx: { fontSize: "12px" }
      }}
    />
  );
};

export default MaskedTextField;