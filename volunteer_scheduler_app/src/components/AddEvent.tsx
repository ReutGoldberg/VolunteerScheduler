import * as React from "react";
import "../App.css";
import axios from 'axios';
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
import { isAdminUser } from "../utils/DataAccessLayer";
import {fullEventDetails} from "../utils/helper";

export const AddEvent: React.FC = () => {
  const [eventName, setEventName] = React.useState("");
  const [eventNameValid, setEventNameValid] = React.useState(true);

  const [eventInfo, setEventInfo] = React.useState("");
  const [eventInfoValid, setEventInfoValid] = React.useState(true);

  const [eventLocation, setEventLocation] = React.useState("");
  const [eventLocationValid, setEventLocationValid] = React.useState(true);

  const [eventMaxParticipants, setEventMaxParticipants] = React.useState("");
  const [eventMaxParticipantsValid, setEventMaxParticipantsValid] = React.useState(true);

  const [eventMinParticipants, setEventMinParticipants] = React.useState("");
  const [eventMinParticipantsValid, setEventMinParticipantsValid] = React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [startDateValid, setStartDateValid] = React.useState(true);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [allDayChecked, setAllDayChecked] = React.useState(false);
  const [isAllDayDisable, setIsAllDayDisable] = React.useState(false);

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
    console.log(today)
    if (newVal) {
      console.log(newVal)
      var inputStartDate = new Date(newVal);
      console.log(inputStartDate)
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
  //const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
  // event.preventDefault();
  // if(adminPasswordVerificationValid){
  //     let loggedUser= getUser()
  //     if (!loggedUser) return;
  //     let token:string = window.btoa(`${loggedUser!![0]}:${loggedUser!![1]}`)
  //     console.log("token:"+ token + "loggeduser" + loggedUser);
  //     let data = new FormData();    //formdata object
  //     data.append('adminName', adminName);
  //     data.append('adminPassword', adminPassword);
  //     try {
  //         const res = await axios({
  //             method: "post",
  //             url: `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/register_admin`,
  //             data: data,
  //             headers: {  "Content-Type": "multipart/form-data", 'Authorization': `Basic ${token}` },
  //         });
  //         if(res.statusText === 'OK'){
  //             setPageApp("CurrentAdminsList")
  //         }
  //     } catch(err:any) {
  //         if (axios.isAxiosError(err)) {
  //             if(err.response){
  //                 let message: string = ""
  //                 if( err.response.status === 409){
  //                     message = "A problem occurred! probably name is taken";
  //                 }
  //                 else {
  //                     message = "error! " + err.response.status.toString() + " " + err.response.statusText;
  //                 }
  //                 alert(message)
  //             } else if(err.request){
  //                 alert("The request was made but no response was received from server")
  //             } else {
  //                 alert(err.message)
  //             }
  //         }
  //     }
  // }
  //};
  const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (startDate == null) {
      setStartDateValid(false);
    } else if (endDate == null) {
      setEndDateValid(false);
    } else {
      // if (await isAdminUser()) {
      if (true) {
        console.log("admin!")
        try {
          var event_details : fullEventDetails = {
              id: 0,
              title: eventName, 
              details: eventInfo,
              label: "food", 
              location: eventLocation, 
              min_volenteers: Number(eventMinParticipants),
              max_volenteers: Number(eventMaxParticipants), 
              startAt: startDate, 
              endAt: endDate,
              created_by: "Danit"
            }
         
          const response = await axios({
              method: "post",
              url: `http://localhost:5001/add_event`,
              data: JSON.stringify(event_details),
              headers: { "Content-Type": "application/json"},
          });
          if(response.statusText === 'OK')
              console.log('Event added successfully')
          else
            console.log('didnt add event')

        //todo: implement event addition based on the above data. and the
        // data in the server & db classes.
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
      onSubmit={handleAddEvent}
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
        Add Event
      </Button>
    </Box>
  );
};
