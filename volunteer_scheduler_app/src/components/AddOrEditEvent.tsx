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

import {
  getLabels,
  addEventReq,
  editEventReq,
  deleteEventReq,
  addEnrollReq,
  unEnrollReq,
  getIsUserEnrolled,
} from "../utils/DataAccessLayer";
import {
  enrollement_details,
  fullEventDetails,
  labelOptions,
  volenteer
} from "../utils/helper";
import React from "react";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";

export interface AddOrEditProps {
  toEditEventDetails: fullEventDetails | null;
  isAdmin: boolean;
  currentPage: string;
}

const dateToString = (date: Date) => {
  return (
    ("00" + (date.getDate() + 1)).slice(-2) +
    "/" +
    ("00" + date.getMonth()).slice(-2) +
    "/" +
    date.getFullYear() +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2)
  );
};

export const AddOrEditEvent: React.FC<AddOrEditProps> = ({
  toEditEventDetails,
  isAdmin,
  currentPage,
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
    toEditEventDetails ? new Date(toEditEventDetails.startAt) : null
  );
  const [startDateValid, setStartDateValid] = React.useState(true);

  const [endDate, setEndDate] = React.useState<Date | null>(
    toEditEventDetails ? new Date(toEditEventDetails.endAt) : null
  );
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [allDayChecked, setAllDayChecked] = React.useState(false);
  const [isAllDayDisable, setIsAllDayDisable] = React.useState(false);

  const [labelOptions, setlabelOptions] = React.useState<labelOptions[]>([]);
  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>(
    toEditEventDetails ? toEditEventDetails.labels : []
  );

  const [loading, setLoading] = React.useState(true);
  const [label, setlabel] = React.useState("");

  const { user, setUser } = React.useContext(UserObjectContext); //importing the context - user object by google token

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
          console.log("Got lables from DB");  //todo: remove
          console.log(data); //todo: remove
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


  React.useEffect(() => {
    (async function () { //IIFE to load is_enrolled:
      //Enroll part is only relevant when editing event details, not creating them 
      //if this field is false/null then it means we're on Edit Events page and this shouldn't do anything
      if(toEditEventDetails){ 
        const event_id = toEditEventDetails.id;
        const result = await getIsUserEnrolled(event_id, user.token);
        if(result.data != null)
          setIsEnrolled(true);
        else
          setIsEnrolled(false);
      }
    })();  
  }, []);



  const handleEventNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("isAdmin: " + isAdmin);
    console.log("page: " + currentPage);
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
    let response:any;
    try {
      if(toEditEventDetails != null){ // for some reason this can be null and needs to be checked, todo - better change to empty obj: {} if time allows        
        console.log(`isEnrolled value: ${isEnrolled}`);
        if(isEnrolled)            
          response = await addEnrollReq(toEditEventDetails.id, user.token);
                    
        else{            
          response = await unEnrollReq(toEditEventDetails.id,user.token);
        }
                              
      }      
    } catch(err:any) {
      console.error(`From handleEnrollement: ${err.message}`);
      throw err;
    } finally {
      if (response.statusText === "OK")
        console.log("Enrollment proccess completed successfully");
      else 
        console.error("Enrollment process ended with errors");
    }
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
      if (isAdmin) {
        //?
        console.log("admin!");
        try {
          var event_details: fullEventDetails = {
            id: 0,//todo: why is the ID hardcoded?!?! DANITTT???
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
            volenteers: [],
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
      if (isAdmin) {
        //?
        console.log("admin!");
        try {
          var event_details: fullEventDetails = {
            id: toEditEventDetails ? toEditEventDetails.id : -1,
            title: eventName,
            details: eventInfo,
            labels: checkedLabels,
            location: eventLocation,
            min_volenteers: Number(eventMinParticipants),
            max_volenteers: Number(eventMaxParticipants),
            // TODO:check deafult in edit
            startAt: startDate,
            endAt: endDate,
            //@ts-ignore
            created_by: `${user.email}`,
            volenteers: [],
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
            console.log("Event edited successfully");
            alert("Event edited successfully");
            window.location.reload();
          } else console.log("didnt edit event");
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

  const handleDeleteEvent = async () => {
    try {
      console.log("handleDeleteEvent");
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
          console.log("Event deleted successfully");
          alert("Event deleted successfully");
          window.location.reload();
        } else console.log("didnt delete event");
      }
    } catch {
    } finally {
    }
  };

  const handelIsEnrollChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnrolled(event.target.checked);
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
        Add New Event
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
        {isAdmin && (
        <TextField
          // disabled = {(currentPage != "AddOrEditEvent")}
          required={toEditEventDetails ? false : true}
          error={!startDateValid}
          helperText={!startDateValid ? "Please enter a valid date " : ""}
          id="datetime-local"
          label="Enter start date"
          type="datetime-local"
          defaultValue={toEditEventDetails ? toEditEventDetails.startAt : null}
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEventStartTimeChange}
        />
        )}
        {isAdmin && ( 
        <TextField
          // disabled = {(currentPage != "AddOrEditEvent")}
          required={toEditEventDetails ? false : true}
          error={!endDateValid}
          helperText={!endDateValid ? "Please enter a valid date " : ""}
          id="datetime-local"
          label="Enter end date"
          type="datetime-local"
          defaultValue={toEditEventDetails ? toEditEventDetails.endAt : null}
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleEventEndTimeChange}
        />)}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4.7,
        }}
      >
        <Box sx={{ flexDirection: "column" }}>
          {" "}
          <Typography sx={{ textDecoration: "underline" }}>
            {toEditEventDetails ? "Begins at: " : ""}
          </Typography>
          <Typography>
            {toEditEventDetails
              ? dateToString(new Date(toEditEventDetails.startAt))
              : ""}
          </Typography>
        </Box>
        <Box sx={{ flexDirection: "column" }}>
          {" "}
          <Typography sx={{ textDecoration: "underline" }}>
            {toEditEventDetails ? "Ends at: " : ""}
          </Typography>
          <Typography>
            {toEditEventDetails
              ? dateToString(new Date(toEditEventDetails.endAt))
              : ""}
          </Typography>
        </Box>
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
                  disabled={currentPage != "AddOrEditEvent" && !isAdmin}
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      disabled={currentPage != "AddOrEditEvent" && !isAdmin}
                      edge="start"
                      checked={
                        checkedLabels.map((cl) => cl.id).indexOf(value.id) !==
                        -1
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
      {toEditEventDetails && (
        <Box sx={{ maxWidth: "40%" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEnrolled}
                  onChange={handelIsEnrollChange}
                />
              }
              label="Is Enrolled?"
            />
          </FormGroup>
        </Box>
      )}
      <ButtonGroup
        size="large"
        variant="text"
        aria-label="text button group"
        fullWidth={true}
        //hidden = {isAdmin} -todo: find solution, now returns a promise and therefore breaks
      >
        {/* {toEditEventDetails ? (
          <Button id="enrollmentEvenBtn" onClick={handleEnrollment}>
            {isEnrolled ? "" : "Not "} Enrolled to the event
          </Button>
        ) : (
          <Box />
        )} */}
        {toEditEventDetails ? (
          <Button id="enrollmentEvenBtn" onClick={handleEnrollment}>
            submit enrollement{" "}
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
    </Box>
  );
};
