import * as React from "react";
import "../App.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  Button,
  Box,
  InputAdornment,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { EventDatePicker } from "./EventDatePicker";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MaximizeIcon from "@mui/icons-material/Maximize";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { start } from "repl";
import { isAdminUser, getLabels } from "../utils/DataAccessLayer";
import { fullEventDetails, labelOptions } from "../utils/helper";

export interface AddOrEditProps {
  toEditEventDetails: fullEventDetails | null;
}

export const AddOrEditEvent: React.FC<AddOrEditProps> = ({
  toEditEventDetails,
}) => {
  const [eventName, setEventName] = React.useState(
    toEditEventDetails ? toEditEventDetails.title : ""
  );
  const [eventNameValid, setEventNameValid] = React.useState(true);

  const [eventInfo, setEventInfo] = React.useState(
    toEditEventDetails ? toEditEventDetails.details : ""
  );
  const [eventInfoValid, setEventInfoValid] = React.useState(true);

  const [eventLocation, setEventLocation] = React.useState(
    toEditEventDetails ? toEditEventDetails.location : ""
  );
  const [eventLocationValid, setEventLocationValid] = React.useState(true);

  const [eventMaxParticipants, setEventMaxParticipants] = React.useState(
    toEditEventDetails ? toEditEventDetails.max_volenteers : ""
  );
  const [eventMaxParticipantsValid, setEventMaxParticipantsValid] =
    React.useState(true);

  const [eventMinParticipants, setEventMinParticipants] = React.useState(
    toEditEventDetails ? toEditEventDetails.min_volenteers : ""
  );
  const [eventMinParticipantsValid, setEventMinParticipantsValid] =
    React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(
    toEditEventDetails ? toEditEventDetails.startAt : null
  );
  const [startDateValid, setStartDateValid] = React.useState(true);

  const [endDate, setEndDate] = React.useState<Date | null>(
    toEditEventDetails ? toEditEventDetails.endAt : null
  );
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [allDayChecked, setAllDayChecked] = React.useState(false);
  const [isAllDayDisable, setIsAllDayDisable] = React.useState(false);

  const [labelOptions, setlabelOptions] = React.useState<labelOptions[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [label, setlabel] = React.useState(
    toEditEventDetails ? toEditEventDetails.label : ""
  );

  React.useEffect(() => {
    async function callAsync() {
      try {
        const data: [] = await getLabels();
        if (data) {
          setLoading(false);
          if (data.length === 0) {
            return;
          }
          setlabelOptions(data);
        }
      } catch (error) {
        alert("An error accured in server. can't get labels");
        setLoading(false);
        return;
      }
    }

    callAsync();
  }, []);
  const handleEventNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[a-z0-9]+/i)) setEventNameValid(false);
    else setEventNameValid(true);
    setEventName(event.target.value);
  };
  const handleEventInfoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[$%^@*&!()]*[a-z0-9]+[$%^@*&!()]*/i))
      setEventInfoValid(false);
    else setEventInfoValid(true);
    setEventInfo(event.target.value);
  };

  const handleEventLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[a-z0-9]+/i)) setEventLocationValid(false);
    else setEventLocationValid(true);
    setEventLocation(event.target.value);
  };

  const handleEventMaxParticipantsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[1-9]+[0-9]*/i))
      setEventMaxParticipantsValid(false);
    else setEventMaxParticipantsValid(true);
    setEventMaxParticipants(event.target.value);
  };

  const handleEventMinParticipantsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[1-9]+[0-9]*/i))
      setEventMinParticipantsValid(false);
    else setEventMinParticipantsValid(true);
    setEventMinParticipants(event.target.value);
  };

  const handleEventStartTimeChange = (newVal: Date | null) => {
    var today = new Date();
    console.log(today);
    if (newVal) {
      console.log(newVal);
      var inputStartDate = new Date(newVal);
      console.log(inputStartDate);
      if (
        !(inputStartDate >= today) ||
        (endDate != null && inputStartDate > endDate)
      ) {
        setStartDateValid(false);
        console.log("startDate not valid");
      } else {
        setStartDateValid(true);
        console.log("startDate valid");
      }
      setStartDate(inputStartDate);
      setAllDayChecked(false);
      setIsAllDayDisable(true);

      if (!endDateValid) {
        if (endDate != null && startDate != null && endDate > startDate) {
          setEndDateValid(true);
        }
      }
    } else {
      setIsAllDayDisable(false);
    }
  };

  const handleEventEndTimeChange = (newVal: Date | null) => {
    var today = new Date();
    if (newVal) {
      var inputEndDate = new Date(newVal);
      if (
        !(inputEndDate >= today) ||
        (startDate != null && inputEndDate < startDate)
      ) {
        console.log("endDate not valid");
        //TODO: do we want to have min time to event?
        setEndDateValid(false);
      } else {
        console.log("endDate valid");
        setEndDateValid(true);
      }
      setEndDate(inputEndDate);
      setAllDayChecked(false);

      if (!startDateValid) {
        if (endDate != null && startDate != null && endDate > startDate) {
          setStartDateValid(true);
        }
      }
    }
  };

  const handleChangeLabel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    var label = event.target.value;
    if (event.target.value == "No label") {
      label = "";
    }
    setlabel(label);
  };

  const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (startDate == null) {
      setStartDateValid(false);
    } else if (endDate == null) {
      setEndDateValid(false);
    } else if (
      endDateValid &&
      startDateValid &&
      eventNameValid &&
      eventInfoValid &&
      eventLocationValid &&
      eventMinParticipantsValid &&
      eventMaxParticipantsValid
    ) {
      // if (await isAdminUser()) {
      if (true) {
        console.log("admin!");
        try {
          var event_details: fullEventDetails = {
            id: 0,
            title: eventName,
            details: eventInfo,
            label: label,
            location: eventLocation,
            min_volenteers: Number(eventMinParticipants),
            max_volenteers: Number(eventMaxParticipants),
            startAt: startDate,
            endAt: endDate,
            //@ts-ignore
            created_by: `${jwt_decode(window.googleToken).email}.`,
            is_fake: false,
          };

          const response = await axios({
            method: "post",
            url: `http://localhost:5001/add_event`,
            data: JSON.stringify(event_details),
            headers: { "Content-Type": "application/json" },
          });
          if (response.statusText === "OK")
            console.log("Event added successfully");
          else console.log("didnt add event");

          //todo: implement event addition based on the above data. and the
          // data in the server & db classes.
        } catch {
        } finally {
        }
      }
    }
  };

  const handleEditEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (startDate == null) {
      setStartDateValid(false);
    } else if (endDate == null) {
      setEndDateValid(false);
    } else if (
      endDateValid &&
      startDateValid &&
      eventNameValid &&
      eventInfoValid &&
      eventLocationValid &&
      eventMinParticipantsValid &&
      eventMaxParticipantsValid
    ) {
      // if (await isAdminUser()) {
      if (true) {
        console.log("admin!");
        try {
          var event_details: fullEventDetails = {
            id: 0,
            title: eventName,
            details: eventInfo,
            label: label,
            location: eventLocation,
            min_volenteers: Number(eventMinParticipants),
            max_volenteers: Number(eventMaxParticipants),
            startAt: startDate,
            endAt: endDate,
            //@ts-ignore
            created_by: `${jwt_decode(window.googleToken).email}.`,
            is_fake: false,
          };

          const response = await axios({
            method: "post",
            url: `http://localhost:5001/edit_event/${toEditEventDetails?.id}`,
            data: JSON.stringify(event_details),
            headers: { "Content-Type": "application/json" },
          });
          if (response.statusText === "OK")
            console.log("Event edited successfully");
          else console.log("didnt edit event");
        } catch {
        } finally {
        }
      }
    }
  };

  const handleAllDayChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllDayChecked(event.target.checked);
    if (event.target.checked) {
      startDate?.setHours(0);
      startDate?.setMinutes(0);
      endDate?.setHours(23);
      endDate?.setMinutes(59);
      setEndDateValid(true);
      setStartDateValid(true);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        width: "30%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="registerForm"
      onSubmit={toEditEventDetails ? handleEditEvent : handleAddEvent}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ManageAccountsTwoToneIcon color="info" sx={{ fontSize: "1000%" }} />
      </Box>
      <Typography
        variant="h2"
        color="text.primary"
        textAlign={"center"}
        gutterBottom
        component="div"
      >
        add new Event
      </Typography>
      <TextField
        required
        error={!eventNameValid}
        id="outlined-basic"
        label="Name"
        variant="outlined"
        onChange={handleEventNameChange}
        helperText={!eventNameValid ? "Please enter a valid name " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <DriveFileRenameOutlineIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        required
        error={!eventInfoValid}
        id="outlined-basic"
        label="Info"
        variant="outlined"
        onChange={handleEventInfoChange}
        helperText={!eventInfoValid ? "Please enter a valid info " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <InfoIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4.7,
        }}
      >
        <div>
          <label> Label </label>
          <select name="label" onChange={(e) => handleChangeLabel(e)}>
            <option>No label</option>
            {labelOptions.map((label) => (
              <option key={label.id} value={label.name}>
                {" "}
                {label.name}
              </option>
            ))}
          </select>
        </div>
      </Box>

      <TextField
        required
        error={!eventLocationValid}
        id="outlined-basic"
        label="Location"
        variant="outlined"
        onChange={handleEventLocationChange}
        helperText={!eventLocationValid ? "Please enter a valid location " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        error={!eventMinParticipantsValid}
        id="outlined-basic"
        label="Minimum number of participants"
        variant="outlined"
        onChange={handleEventMinParticipantsChange}
        helperText={
          !eventMinParticipantsValid
            ? "Please enter a valid minimum of participants "
            : ""
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MinimizeIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        error={!eventMaxParticipantsValid}
        id="outlined-basic"
        label="Maximum number of participants"
        variant="outlined"
        onChange={handleEventMaxParticipantsChange}
        helperText={
          !eventMaxParticipantsValid
            ? "Please enter a valid maximum of participants "
            : ""
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MaximizeIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4.7,
        }}
      >
        <EventDatePicker
          {...{
            onChangeHandler: handleEventStartTimeChange,
            label: "enter start date",
            value: startDate,
            isValid: startDateValid,
          }}
        />
        <EventDatePicker
          {...{
            onChangeHandler: handleEventEndTimeChange,
            label: "enter end date",
            value: endDate,
            isValid: endDateValid,
          }}
        />
      </Box>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={allDayChecked} onChange={handleAllDayChecked} />
          }
          label="All Day"
          disabled={!isAllDayDisable}
        />
      </FormGroup>
      {/*TODO: change "add event" to white */}
      <Button type="submit" form="registerForm" variant="contained">
        {toEditEventDetails ? "Edit Event" : "Add Event"}
      </Button>
    </Box>
  );
};
