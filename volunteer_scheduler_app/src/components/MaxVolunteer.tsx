import "../App.css";
import {
  Box,
  Checkbox,
  ListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { getLabels } from "../utils/DataAccessLayer";
import { filtersToMax, labelOptions } from "../utils/helper";
import React from "react";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";
import CalendComponent from "./Calendar";

export const MaxVolunteer = () => {
  const [loading, setLoading] = React.useState(true);

  const [labelOptions, setlabelOptions] = React.useState<labelOptions[]>([]);
  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>([]);

  const { user, setUser } = React.useContext(UserObjectContext); //importing the context - user object by google token

  const [startTime, setStartTime] = React.useState<Date | null>(null);
  const [startTimeValid, setStartTimeValid] = React.useState(true);

  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [endTimeValid, setEndTimeValid] = React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [startDateValid, setStartDateValid] = React.useState(true);

  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [endDateValid, setEndDateValid] = React.useState(true);

  const [filters, setFilters] = React.useState<filtersToMax | null>(null);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [isMax, setIsMax] = React.useState(false);

  React.useEffect(() => {
    async function callAsync() {
      try {
        const data: labelOptions[] = await getLabels(user.token);
        if (data) {
          setLoading(false);
          if (data.length === 0) {
            return;
          }
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
      var inputStartDate = new Date(newVal);
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
      var inputEndDate = new Date(newVal);
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

  const setTimes = (isStart: boolean): Date => {
    var time = new Date();
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

  const handleSubmit = (isMaxEvents: boolean) => {
    setIsMax(isMaxEvents);

    var submitStartTime = startTime;
    var submitEndTime = endTime;

    if (submitStartTime == null) {
      submitStartTime = setTimes(true);
    }
    if (submitEndTime == null) {
      submitEndTime = setTimes(false);
    }
    try {
      if (startDate && endDate) {
        var filtersSub: filtersToMax = {
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
        onSubmit={handleOnFilter}
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
          Filter And Max My Volunteering
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
            id="datetime-local"
            label="Enter start date"
            type="datetime-local"
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
            id="datetime-local"
            label="Enter end date"
            type="datetime-local"
            sx={{ width: 250 }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleEventEndDateChange}
          />
        </Box>
        <Typography>for all days choose start hour and end hour:</Typography>
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
              maxWidth: 450,
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
                    <ListItemText
                      id={labelId.toString()}
                      primary={value.name}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <ButtonGroup
          variant="contained"
          size="large"
          aria-label="text button group"
          fullWidth={true}
          sx={{ gap: "1%" }}
        >
          <Button type="submit" form="maxForm">
            Filter Events
          </Button>
          <Button onClick={handelOnMax} form="maxForm">
            Max Events
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
          />
        </Box>
      )}
    </>
  );
};
