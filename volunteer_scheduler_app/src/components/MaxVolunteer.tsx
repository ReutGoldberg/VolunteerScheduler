import "../App.css";
import {
  Box,
  Checkbox,
  ButtonGroup,
  Button,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { getLabels } from "../utils/DataAccessLayer";
import { filtersToMax, labelOptions } from "../utils/helper";
import React from "react";
import { UserObjectContext } from "../App";
import CalendComponent from "./Calendar";
import { AppConfig } from "../AppConfig";
import { LabelsOptionsComp } from "./LabelsOptionsComp";

export const MaxVolunteer = () => {
  const [labelsList, setLabelsList] = React.useState<labelOptions[]>([]);
  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>([]);

  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [startTimeValid, setStartTimeValid] = React.useState(true);

  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [endTimeValid, setEndTimeValid] = React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [startDateValid, setStartDateValid] = React.useState(true);

  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [filters, setFilters] = React.useState<filtersToMax | null>(null);

  const [isMax, setIsMax] = React.useState(false);

  const [isAvailable, setIsAvailable] = React.useState(false);

  // ------------------------------------------------------ Persisted Auth after page refresh for admins Section -----------------------
  const { user } = React.useContext(UserObjectContext); //using App's context
  let userFromStorage: any; //option to default back to sessionStorage
  if (JSON.stringify(user) === "{}") {
    const data =
      sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
    userFromStorage = JSON.parse(data);
  } else userFromStorage = user;
  // -------------------------------------------------------------------- End of persisted auth ----------------------------------------------------

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

  const setTimesForDates = (date: Date | null, isStart: boolean): Date => {
    var time = new Date();
    if (date) time = date;

    if (isStart) {
      // startTime
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
    } else {
      //endTime
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(59);
    }
    return time;
  };

  const handleEventStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var newVal = event.target.value;
    if (newVal) {
      let inputStartTime = new Date();
      let [hours, minutes] = newVal.split(":");
      inputStartTime.setHours(Number(hours));
      inputStartTime.setMinutes(Number(minutes));
      inputStartTime.setSeconds(0);
      setStartTime(inputStartTime);
      if (endTime != null) {
        setStartTimeValid(endTime > inputStartTime);
      }
      if (!endTimeValid) {
        if (endTime != null) {
          setEndTimeValid(endTime > inputStartTime);
        }
      }
    } else {
      setStartTime(null);
      setStartTimeValid(true);
      setEndTimeValid(true);
    }
  };

  const handleEventEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var newVal = event.target.value;
    if (newVal) {
      let inputEndTime = new Date();
      let [hours, minutes] = newVal.split(":");
      inputEndTime.setHours(Number(hours));
      inputEndTime.setMinutes(Number(minutes));
      inputEndTime.setSeconds(59);
      setEndTime(inputEndTime);
      if (startTime != null) {
        setEndTimeValid(startTime < inputEndTime);
      }

      if (!startTimeValid) {
        if (startTime != null) {
          setStartTimeValid(startTime < inputEndTime);
        }
      }
    } else {
      setEndTime(null);
      setEndTimeValid(true);
      setStartTimeValid(true);
    }
  };

  const handleEventStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var today = new Date();
    var newVal = event.target.value;
    if (newVal) {
      let inputStartDate = new Date(newVal + "T02:55:08.151437Z");
      inputStartDate = setTimesForDates(inputStartDate, true);
      setStartDateValid(
        !(
          inputStartDate < today ||
          (endDate != null && inputStartDate > endDate)
        )
      );
      setStartDate(inputStartDate);

      if (!endDateValid) {
        setEndDateValid(endDate != null && endDate > inputStartDate);
      }
    } else {
      setStartDate(null);
    }
  };

  const handleEventEndDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var today = new Date();
    var newVal = event.target.value;
    if (newVal) {
      let inputEndDate = new Date(newVal + "T02:55:08.151437Z");
      inputEndDate = setTimesForDates(inputEndDate, false);
      setEndDateValid(
        !(
          inputEndDate < today ||
          (startDate != null && inputEndDate < startDate)
        )
      );
      setEndDate(inputEndDate);

      if (!startDateValid) {
        setStartDateValid(startDate != null && inputEndDate > startDate);
      }
    } else {
      setEndDate(null);
    }
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

  const handelIsAvailableChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAvailable(event.target.checked);
  };

  //to stop refershing the page when adding/removing admins.
  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSubmit = (isMaxEvents: boolean) => {
    setIsMax(isMaxEvents);

    var submitStartTime = startTime;
    var submitEndTime = endTime;

    if (submitStartTime == null) {
      submitStartTime = setTimesForDates(null, true);
    }
    if (submitEndTime == null) {
      submitEndTime = setTimesForDates(null, false);
    }
    try {
      if (startDate && endDate) {
        let filtersSub: filtersToMax = {
          startDate: startDate,
          endDate: endDate,
          dateForStartTime: submitStartTime,
          dateForEndTime: submitEndTime,
          labels: checkedLabels,
        };
        setFilters(filtersSub);
      }
    } catch {
    } finally {
    }
  };

  const handleOnFilter = () => {
    handleSubmit(false);
  };

  const handelOnMax = () => {
    handleSubmit(true);
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: "5%",
          gap: 2,
        }}
        id="maxForm"
        component="form"
        onSubmit={handleSubmitForm}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <AutoAwesomeIcon color="info" sx={{ fontSize: "1000%" }} />
        </Box>

        <Typography
          variant="h2"
          textAlign={"center"}
          gutterBottom
          alignItems={"center"}
          component="div"
        >
          Filter And Maximize My Volunteering
        </Typography>

        <Typography>choose start date and end date:</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            gap: 4.7,
          }}
        >
          <TextField
            required
            error={!startDateValid}
            helperText={!startDateValid ? "Please enter a valid date " : ""}
            id="date"
            label="Enter start date"
            type="date"
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleEventStartDateChange}
          />
          <TextField
            required
            error={!endDateValid}
            helperText={!endDateValid ? "Please enter a valid date " : ""}
            id="date"
            label="Enter end date"
            type="date"
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleEventEndDateChange}
          />
        </Box>
        <Typography>
          if needed, choose start hour and end hour for every day:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            gap: 4.7,
          }}
        >
          <TextField
            id="time"
            label="Enter start time:"
            type="time"
            onChange={handleEventStartTimeChange}
            error={!startTimeValid}
            variant="outlined"
            helperText={
              !startTimeValid ? "Please enter a valid start time " : ""
            }
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 200 }}
          />
          <TextField
            id="time"
            label="Enter end time:"
            type="time"
            onChange={handleEventEndTimeChange}
            error={!endTimeValid}
            variant="outlined"
            helperText={!endTimeValid ? "Please enter a valid end time " : ""}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 200 }}
          />
        </Box>
        <Typography>if needed, choose labels to filter by:</Typography>
        <LabelsOptionsComp
          toEditEventDetails={null}
          isAuth={true}
          currentPage={"AddOrEditEvent"}
          currentLabelsList={labelsList}
          setAllCheckedLabels={setCheckedLabels}
        />

        <Box sx={{ maxWidth: "40%" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAvailable}
                  onChange={handelIsAvailableChange}
                />
              }
              label="Show only available events"
            />
          </FormGroup>
        </Box>

        <ButtonGroup
          variant="contained"
          size="large"
          aria-label="text button group"
          fullWidth={true}
          sx={{ gap: "1%" }}
        >
          <Button onClick={handleOnFilter} form="maxForm">
            Filter Events
          </Button>
          <Button onClick={handelOnMax} form="maxForm">
            Maximize Events
          </Button>
        </ButtonGroup>
      </Box>
      {filters && (
        <Box
          className={"wrapper"}
          sx={{
            width: "70%",
            minHeight: "900px",
          }}
        >
          <CalendComponent
            isGeneral={true}
            isDark={true}
            filters={filters}
            isMax={isMax}
            showOnlyAvailableEvents={isAvailable} //show only events that are not maxed out (include personal)
          />
        </Box>
      )}
    </>
  );
};