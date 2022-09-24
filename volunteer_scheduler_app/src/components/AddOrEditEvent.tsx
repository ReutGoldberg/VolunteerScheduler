import "../App.css";
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
  ListItemText,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import TodayIcon from "@mui/icons-material/Today";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MaximizeIcon from "@mui/icons-material/Maximize";
import MinimizeIcon from "@mui/icons-material/Minimize";

import {
  addEventReq,
  editEventReq,
  deleteEventReq,
  addEnrollReq,
  unEnrollReq,
  getIsUserEnrolled,
  getLabels,
} from "../utils/DataAccessLayer";
import { fullEventDetails, labelOptions } from "../utils/helper";
import React from "react";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";
import { LabelsOptionsComp } from "./LabelsOptionsComp";

const offset = new Date().getTimezoneOffset() * 1000 * 60;
const getLocalDate = (value: string | number | Date) => {
  const offsetDate = new Date(value).valueOf() - offset;
  const date = new Date(offsetDate).toISOString();
  return date.substring(0, 16);
};

export interface AddOrEditProps {
  toEditEventDetails: fullEventDetails | null;
  isAdmin: boolean;
  currentPage: string;
  setOpenDialogApp(openDialogApp: boolean): void;
  setIsDelete(isDelete: boolean): void;
}

export const AddOrEditEvent: React.FC<AddOrEditProps> = ({
  toEditEventDetails,
  isAdmin,
  currentPage,
  setOpenDialogApp,
  setIsDelete,
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
    toEditEventDetails ? toEditEventDetails.max_volunteers : ""
  );
  const [eventMaxParticipantsValid, setEventMaxParticipantsValid] =
    React.useState(true);

  const [eventMinParticipants, setEventMinParticipants] = React.useState(
    toEditEventDetails ? toEditEventDetails.min_volunteers : ""
  );
  const [eventMinParticipantsValid, setEventMinParticipantsValid] =
    React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(
    toEditEventDetails ? new Date(toEditEventDetails.startAt) : null
  );
  const [startDateValid, setStartDateValid] = React.useState(true);

  const [endDate, setEndDate] = React.useState<Date | null>(
    toEditEventDetails ? new Date(toEditEventDetails.endAt) : null
  );
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [allDayChecked, setAllDayChecked] = React.useState(false);
  const [isAllDayDisable, setIsAllDayDisable] = React.useState(
    toEditEventDetails ? true : false
  );

  const { user, setUser } = React.useContext(UserObjectContext); //importing the context - user object by google token

  const [isEnrolled, setIsEnrolled] = React.useState(false);
  const [isEnrolledValid, setIsEnrolledValid] = React.useState(false);

  const [labelsList, setLabelsList] = React.useState<labelOptions[]>([]);
  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>(
    toEditEventDetails ? toEditEventDetails.labels : []
  );

  React.useEffect(() => {
    (async function () {
      //IIFE to load is_enrolled:
      //Enroll part is only relevant when editing event details, not creating them
      //if this field is false/null then it means we're on Edit Events page and this shouldn't do anything
      if (toEditEventDetails) {
        const event_id = toEditEventDetails.id;
        const result = await getIsUserEnrolled(event_id, user.token);
        if (result.data != null) {
          setIsEnrolled(true);
          setIsEnrolledValid(true);
        } else setIsEnrolled(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    async function callAsync() {
      const data: labelOptions[] = await getLabels(user.token);
      if (data) {
        if (data.length === 0) {
          return;
        }
        setLabelsList(
          data.map((labelOption) => {
            return { id: labelOption.id, name: labelOption.name };
          })
        );
      }
    }
    callAsync();
  }, []);

  const isBlockSubmit = () => {
    if (toEditEventDetails)
      return (
        toEditEventDetails.max_volunteers <= toEditEventDetails.count_volunteers
      );
    return false;
  };

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

  const handleEnrollment = async () => {
    let response: any;
    try {
      if (toEditEventDetails != null) {
        if (isEnrolled)
          response = await addEnrollReq(toEditEventDetails.id, user.token);
        else {
          response = await unEnrollReq(toEditEventDetails.id, user.token);
          setIsEnrolledValid(false);
        }
      }
    } catch (err: any) {
      console.error(`From handleEnrollement: ${err.message}`);
      if (err.message==="Full capacity"){
        alert("Can't enroll - full capacity")
      }
      else{
        throw err;
      }
      
    } finally {
      if (response.statusText === "OK") {
        setOpenDialogApp(false);
    }
  }};

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
      if (isAdmin) {
        var event_details: fullEventDetails = {
          id: 0,
          title: eventName,
          details: eventInfo,
          labels: checkedLabels,
          location: eventLocation,
          min_volunteers: Number(eventMinParticipants),
          max_volunteers: Number(eventMaxParticipants),
          startAt: startDate,
          endAt: endDate,
          //@ts-ignore
          created_by: `${user.email}`,
          volunteers: [],
          count_volunteers: 0,
        };
        const data =
          window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) ||
          "";
        const userFromStorage = JSON.parse(data);
        const response = await addEventReq(
          event_details,
          userFromStorage.token || ""
        );
        if (response.statusText === "OK") {
          alert("Event addeds successfully");
          setOpenDialogApp(false);
        } else console.log("didnt add event");
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
      if (isAdmin) {
        var event_details: fullEventDetails = {
          id: toEditEventDetails ? toEditEventDetails.id : -1,
          title: eventName,
          details: eventInfo,
          labels: checkedLabels,
          location: eventLocation,
          min_volunteers: Number(eventMinParticipants),
          max_volunteers: Number(eventMaxParticipants),
          startAt: startDate,
          endAt: endDate,
          //@ts-ignore
          created_by: `${user.email}`,
          volunteers: [],
          count_volunteers: 0,
        };

        //@ts-ignore
        const data =
          window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) ||
          "";
        const userFromStorage = JSON.parse(data);
        const response = await editEventReq(
          event_details,
          userFromStorage.token || ""
        );
        if (response.statusText === "OK") {
          alert("Event edited successfully");
          setOpenDialogApp(false);
        } else console.log("didnt edit event");
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

  const handleDeleteEvent = async () => {
    if (toEditEventDetails != null) {
      var eventId = toEditEventDetails?.id;
      const data =
        window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) ||
        "";
      const userFromStorage = JSON.parse(data);
      //@ts-ignore
      const response = await deleteEventReq(
        eventId,
        userFromStorage.token || ""
      );
      if (response.statusText === "OK") {
        alert("Event deleted successfully");
        setIsDelete(true);
        setOpenDialogApp(false);
      } else console.log("didnt delete event");
    }

  };

  const handelIsEnrollChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnrolled(event.target.checked);
  };

  return (
    <Box
      component="form"
      sx={{
        height: "100%",
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
          <TodayIcon color="info" sx={{ fontSize: "1000%" }} />
        </Box>
      )}
      <Typography
        variant="h2"
        textAlign={"center"}
        gutterBottom
        component="div"
        hidden={toEditEventDetails ? true : false}
      >
        Add New Event
      </Typography>

      <Typography textAlign={"center"} gutterBottom component="div">
        {toEditEventDetails
          ? '* in order to edit the event use the "Edit Event" button bellow'
          : ""}
      </Typography>

      <TextField
        disabled={currentPage != "AddOrEditEvent" && !isAdmin}
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
        disabled={currentPage != "AddOrEditEvent" && !isAdmin}
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
        disabled={currentPage != "AddOrEditEvent" && !isAdmin}
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
        disabled={currentPage != "AddOrEditEvent" && !isAdmin}
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
            ? toEditEventDetails.min_volunteers
              ? toEditEventDetails.min_volunteers
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
        disabled={currentPage != "AddOrEditEvent" && !isAdmin}
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
            ? toEditEventDetails.max_volunteers
              ? toEditEventDetails.max_volunteers
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
          disabled={currentPage != "AddOrEditEvent" && !isAdmin}
          required={toEditEventDetails ? false : true}
          error={!startDateValid}
          helperText={!startDateValid ? "Please enter a valid date " : ""}
          id="datetime-local"
          label="Enter start date"
          type="datetime-local"
          defaultValue={
            toEditEventDetails ? getLocalDate(toEditEventDetails.startAt) : null
          }
          sx={{ width: "50%", textAlign: "center" }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEventStartTimeChange}
        />

        <TextField
          disabled={currentPage != "AddOrEditEvent" && !isAdmin}
          required={toEditEventDetails ? false : true}
          error={!endDateValid}
          helperText={!endDateValid ? "Please enter a valid date " : ""}
          id="datetime-local"
          label="Enter end date"
          type="datetime-local"
          defaultValue={
            toEditEventDetails ? getLocalDate(toEditEventDetails.endAt) : null
          }
          sx={{ width: "50%", textAlign: "center" }}
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
            disabled={
              !isAllDayDisable || (currentPage != "AddOrEditEvent" && !isAdmin)
            }
          />
        </FormGroup>
      </Box>
      <LabelsOptionsComp
        toEditEventDetails={toEditEventDetails}
        isAdmin={isAdmin}
        currentPage={currentPage}
        currentLabelsList={labelsList}
        setAllCheckedLabels={setCheckedLabels}
      />

      <Box />
      {toEditEventDetails && (
        <Box sx={{ maxWidth: "40%" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEnrolled}
                  onChange={handelIsEnrollChange}
                  disabled={isBlockSubmit() && !isEnrolledValid}
                />
              }
              label="Is Enrolled?"
            />
          </FormGroup>
        </Box>
      )}
      {toEditEventDetails && isBlockSubmit() && !isEnrolledValid && (
        <Typography
          sx={{
            color: "red",
          }}
        >
          Can't enroll - event is full
        </Typography>
      )}
      <ButtonGroup
        variant="contained"
        size="large"
        aria-label="text button group"
        fullWidth={true}
      >
        {toEditEventDetails ? (
          <Button
            id="enrollmentEvenBtn"
            onClick={handleEnrollment}
            disabled={isBlockSubmit() && !isEnrolledValid}
          >
            submit enrollement
          </Button>
        ) : (
          <Box />
        )}

        {toEditEventDetails && isAdmin ? (
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
        {currentPage == "AddOrEditEvent" || isAdmin ? (
          <Button type="submit" form="registerForm">
            {toEditEventDetails ? "Edit Event" : "Add Event"}
          </Button>
        ) : (
          <Box />
        )}
      </ButtonGroup>

      {toEditEventDetails && (
        <Typography gutterBottom>
          Number Of Volunteers: {toEditEventDetails.count_volunteers}
        </Typography>
      )}
      {toEditEventDetails &&
        isAdmin && <Typography gutterBottom>Volunteers Emails:</Typography> && (
          <Typography gutterBottom>
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
                {toEditEventDetails.volunteers?.map((value) => {
                  const email = value.email;
                  const nameAndEmail =
                    value.first_name +
                    " " +
                    value.last_name +
                    " (" +
                    value.email +
                    ")";
                  return (
                    <ListItem key={value.email} disablePadding>
                      <ListItemButton role={undefined} dense>
                        <ListItemText
                          id={nameAndEmail}
                          primary={nameAndEmail}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Typography>
        )}
    </Box>
  );
};
