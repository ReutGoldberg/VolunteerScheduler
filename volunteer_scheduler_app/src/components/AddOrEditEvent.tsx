import "../App.css";
import jwt_decode from "jwt-decode";
import {
  Button,
  Box,
  InputAdornment,
  FormControlLabel,
  FormGroup,
  Checkbox,
  ButtonGroup,
  ListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MaximizeIcon from "@mui/icons-material/Maximize";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { getLabels } from "../utils/DataAccessLayer";
import { fullEventDetails, labelOptions } from "../utils/helper";
import React from "react";
import { UserObjectContext } from "../App";
import axios from "axios";

export interface AddOrEditProps {
  toEditEventDetails: fullEventDetails | null;
}

export const AddOrEditEvent: React.FC<AddOrEditProps> = ({
  toEditEventDetails,
}) => {
  const [eventName, setEventName] = React.useState("");
  const [eventNameValid, setEventNameValid] = React.useState(true);

  const [eventInfo, setEventInfo] = React.useState("");
  const [eventInfoValid, setEventInfoValid] = React.useState(true);

  const [eventLocation, setEventLocation] = React.useState("");
  const [eventLocationValid, setEventLocationValid] = React.useState(true);

  const [eventMaxParticipants, setEventMaxParticipants] = React.useState("");
  const [eventMaxParticipantsValid, setEventMaxParticipantsValid] =
    React.useState(true);

  const [eventMinParticipants, setEventMinParticipants] = React.useState("");
  const [eventMinParticipantsValid, setEventMinParticipantsValid] =
    React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [startDateValid, setStartDateValid] = React.useState(true);

  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [allDayChecked, setAllDayChecked] = React.useState(false);
  const [isAllDayDisable, setIsAllDayDisable] = React.useState(false);

  const [labelOptions, setlabelOptions] = React.useState<labelOptions[]>([]);
  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [label, setlabel] = React.useState("");


  const {user,setUser} = React.useContext(UserObjectContext) //importing the context - user object by google token
  

  const [isEnrolled, setIsEnrolled] = React.useState(false);

  React.useEffect(() => {
    async function callAsync() {
      try {
        const data: labelOptions[] = await getLabels(user.token);
        if (data) {
          setLoading(false);
          if (data.length === 0) {
            return;
          }
          console.log("im here");
          console.log(data);
          setlabelOptions(
            data.map((labelOption) => {
              return { id: labelOption.id, name: labelOption.name };
            })
          );
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

  const handleEnrollment = () => {
    setIsEnrolled(!isEnrolled);
    //and send to
  };

  const handleEventStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var today = new Date();
    var newVal = event.target.value;
    if (newVal) {
      var inputStartDate = new Date(newVal);
      setStartDateValid(
        !(
          inputStartDate < today ||
          (endDate != null && inputStartDate > endDate)
        )
      );
      setStartDate(inputStartDate);
      setAllDayChecked(false);
      if (endDate != null) {
        setIsAllDayDisable(true);
      }

      if (!endDateValid) {
        setEndDateValid(endDate != null && endDate > inputStartDate);
      }
    } else {
      setIsAllDayDisable(false);
      setStartDate(null);
    }
  };

  const handleEventEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var today = new Date();
    var newVal = event.target.value;
    if (newVal) {
      var inputEndDate = new Date(newVal);
      setEndDateValid(
        !(
          inputEndDate < today ||
          (startDate != null && inputEndDate < startDate)
        )
      );
      setEndDate(inputEndDate);
      setAllDayChecked(false);
      if (startDate != null) {
        setIsAllDayDisable(true);
      }

      if (!startDateValid) {
        setStartDateValid(startDate != null && inputEndDate > startDate);
      }
    } else {
      setIsAllDayDisable(false);
      setEndDate(null);
    }
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
      // if (await isAdminUser(user.sub)) {
      if (true) {
        console.log("admin!");
        try {
          var event_details: fullEventDetails = {
            id: 0,
            title: eventName,
            details: eventInfo,
            labels: checkedLabels,
            location: eventLocation,
            min_volenteers: Number(eventMinParticipants),
            max_volenteers: Number(eventMaxParticipants),
            startAt: startDate,
            endAt: endDate,
            //@ts-ignore
            created_by: `${user.email}`,
          };
          //@ts-ignore 
          const response = await addEventReq(event_details, window.googleToken);
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
            id: toEditEventDetails? toEditEventDetails.id : -1,
            title: eventName,
            details: eventInfo,
            labels: checkedLabels,
            location: eventLocation,
            min_volenteers: Number(eventMinParticipants),
            max_volenteers: Number(eventMaxParticipants),
            startAt: startDate,
            endAt: endDate,
            //@ts-ignore
            created_by: `${user.email}`,
          };

          //@ts-ignore
          const response = await editEventReq(event_details, window.googleToken)
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

  const handleDeleteEvent = () => {
    //setIsEnrolled(!isEnrolled);
    //and send to
  };

  const handleToggle = (value: labelOptions) => () => {
    const currentIndex = checkedLabels.map((cl) => cl.id).indexOf(value.id);
    const newChecked = [...checkedLabels];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedLabels(newChecked);
  };

  return (
    <Box
      component="form"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="registerForm"
      onSubmit={toEditEventDetails ? handleEditEvent : handleAddEvent}
    >
      {!toEditEventDetails && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ManageAccountsTwoToneIcon color="info" sx={{ fontSize: "1000%" }} />
        </Box>
      )}
      <Typography
        variant="h2"
        color="text.primary"
        textAlign={"center"}
        gutterBottom
        component="div"
        hidden={toEditEventDetails ? true : false}
      >
        "Add New Event"
      </Typography>

      <Typography
        color="text.primary"
        textAlign={"center"}
        gutterBottom
        component="div"
      >
        {toEditEventDetails
          ? '* in order to edit the event use the "Edit Event" button bellow'
          : ""}
      </Typography>

      <TextField
        required
        error={!eventNameValid}
        id="outlined-basic"
        label="Name"
        variant="outlined"
        onChange={handleEventNameChange}
        helperText={!eventNameValid ? "Please enter a valid name " : ""}
        defaultValue={toEditEventDetails ? toEditEventDetails.title : ""}
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
        defaultValue={toEditEventDetails ? toEditEventDetails.details : ""}
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
        defaultValue={toEditEventDetails ? toEditEventDetails.location : ""}
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
        defaultValue={
          toEditEventDetails
            ? toEditEventDetails.min_volenteers
              ? toEditEventDetails.min_volenteers
              : "\n"
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
        defaultValue={
          toEditEventDetails
            ? toEditEventDetails.max_volenteers
              ? toEditEventDetails.max_volenteers
              : "\n"
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
        <TextField
          required
          error={!startDateValid}
          helperText={!startDateValid ? "Please enter a valid date " : ""}
          id="datetime-local"
          label="enter start date"
          type="datetime-local"
          defaultValue={toEditEventDetails ? toEditEventDetails.startAt : null}
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEventStartTimeChange}
        />

        <TextField
          required
          error={!endDateValid}
          helperText={!endDateValid ? "Please enter a valid date " : ""}
          id="datetime-local"
          label="enter end date"
          type="datetime-local"
          defaultValue={toEditEventDetails ? toEditEventDetails.endAt : null}
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEventEndTimeChange}
        />
      </Box>

      <Box sx={{ maxWidth: "20%" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={allDayChecked}
                onChange={handleAllDayChecked}
              />
            }
            label="All Day"
            disabled={!isAllDayDisable}
          />
        </FormGroup>
      </Box>

      <Typography>lables:</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4.7,
        }}
      >
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            maxHeight: 100,
            border: 1,
            borderBlockColor: "grey",
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          {labelOptions.map((value) => {
            const labelId = value.id;
            return (
              <ListItem key={value.id} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={
                        toEditEventDetails
                          ? toEditEventDetails.labels
                              .map((cl) => cl.id)
                              .indexOf(value.id) !== -1 ||
                            checkedLabels
                              .map((cl) => cl.id)
                              .indexOf(value.id) !== -1
                          : checkedLabels
                              .map((cl) => cl.id)
                              .indexOf(value.id) !== -1
                      }
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId.toString(),
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId.toString()} primary={value.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box />
      <Box />

      <ButtonGroup
        size="large"
        variant="text"
        aria-label="text button group"
        fullWidth={true}
        //hidden = {isAdmin} -todo: find solution, now returns a promise and therefore breaks
      >
        {toEditEventDetails ? (
          <Button id="enrollmentEvenBtn" onClick={handleEnrollment}>
            {isEnrolled ? "" : "Not "} Enrolled to the event
          </Button>
        ) : (
          <Box />
        )}
        {toEditEventDetails ? (
          <Button
            id="deleteEventBtn"
            hidden={toEditEventDetails ? false : true}
            onClick={handleDeleteEvent}
          >
            Delete Event
          </Button>
        ) : (
          <Box />
        )}
        <Button type="submit" form="registerForm">
          {toEditEventDetails ? "Edit Event" : "Add Event"}
        </Button>
      </ButtonGroup>
    </Box>
  );
};