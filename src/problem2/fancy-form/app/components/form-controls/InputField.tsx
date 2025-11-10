import { Controller, useController } from "react-hook-form";
import TextField from "@mui/material/TextField";

export const InputField = ({ name, label, control, disabled, ...props }) => {
  const {
    field: { onChange },
    fieldState: { invalid, error },
  } = useController({ name, control });

  const handleChange = (e) => {
    if (disabled) return;
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          error={invalid && error?.message}
          {...field}
          label={label}
          {...props}
          onChange={handleChange}
          helperText={invalid && error?.message ? error.message : undefined}
        />
      )}
    />
  );
};
