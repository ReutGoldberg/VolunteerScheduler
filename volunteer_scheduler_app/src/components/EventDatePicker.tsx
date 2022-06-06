import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export interface EventDatePickerProps {
  label: string;
  value: Date | null;
  onChangeHandler: (date: Date | null) => void;
  isValid: boolean;
}

export const EventDatePicker: React.FC<EventDatePickerProps> = ({
  label,
  value,
  onChangeHandler,
  isValid,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={(newValue: Date | null) => {
          onChangeHandler(newValue);
        }}
        renderInput={(params: TextFieldProps) => {
          params.error = !isValid;
          params.helperText = !isValid ? "Please enter a valid Date " : "";
          return <TextField {...params} />;
        }}
      />
    </LocalizationProvider>
  );
};
