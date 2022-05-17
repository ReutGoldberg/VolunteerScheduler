import * as React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export interface EventDatePickerProps {
  label: string;
  value: Date | null;
  setValue: (date: Date | null) => void;
}

export const EventDatePicker: React.FC<EventDatePickerProps> = ({
  label,
  value,
  setValue,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={(newValue: Date | null) => {
          setValue(newValue);
        }}
        renderInput={(params: TextFieldProps) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
