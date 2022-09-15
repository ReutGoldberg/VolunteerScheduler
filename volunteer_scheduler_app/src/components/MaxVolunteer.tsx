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
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { getLabels } from "../utils/DataAccessLayer";
import {
  eventDetails,
  filtersToMax,
  labelOptions,
  parseGetEvents,
} from "../utils/helper";
import React from "react";
import { UserObjectContext } from "../App";
import { AppConfig } from "../AppConfig";
import CalendComponent from "./Calendar";

export const MaxVolunteer = () => {
  const [loading, setLoading] = React.useState(true);

  const [labelOptions, setlabelOptions] = React.useState<labelOptions[]>([]);
  const [checkedLabels, setCheckedLabels] = React.useState<labelOptions[]>([]);

  const { user, setUser } = React.useContext(UserObjectContext); //importing the context - user object by google token

  const [startTime, setStartTime] = React.useState<Number>(7);
  const [startTimeValid, setStartTimeValid] = React.useState(true);

  const [endTime, setEndTime] = React.useState<Number>(7);
  const [endTimeValid, setEndTimeValid] = React.useState(true);

  const [filters, setFilters] = React.useState<filtersToMax | null>(null);

  const [openDialog, setOpenDialog] = React.useState(false);

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

  const fromStringToTime = (hour: string, minute: string) => {
    return new Number(hour + "." + minute);
  };

  const handleEventStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var newVal = event.target.value;
    if (newVal) {
      var inputStartTime = fromStringToTime(
        newVal.split(":")[0],
        newVal.split(":")[1]
      );
      setStartTime(inputStartTime);
      setStartTimeValid(endTime != null && endTime > inputStartTime);

      if (!endTimeValid) {
        setEndTimeValid(endTime != null && endTime > inputStartTime);
      }
    } else {
      setStartTime(7);
    }
  };

  const handleEventEndTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    var newVal = event.target.value;
    if (newVal) {
      var inputEndTime = fromStringToTime(
        newVal.split(":")[0],
        newVal.split(":")[1]
      );
      setEndTime(inputEndTime);
      setEndTimeValid(startTime < inputEndTime);

      if (!startTimeValid) {
        setStartTimeValid(startTime < inputEndTime);
      }
    } else {
      setEndTime(7);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      var filters: filtersToMax = {
        startTime: startTime,
        endTime: endTime,
        labels: checkedLabels,
      };
      setFilters(filters);
      setOpenDialog(true);
    } catch {
    } finally {
    }
  };

  const setOpenDialogApp = (openDialogApp: boolean) => {
    setOpenDialog(openDialogApp);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="maxForm"
      component="form"
      onSubmit={handleSubmit}
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
        Max My Volunteering
      </Typography>

      <Typography textAlign={"center"} gutterBottom component="div">
        ** in order to filter events choose labels and hours **
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
          defaultValue="07:30"
          onChange={handleEventStartTimeChange}
          required
          error={!startTimeValid}
          variant="outlined"
          helperText={!startTimeValid ? "Please enter a valid start time " : ""}
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
          defaultValue="07:30"
          onChange={handleEventEndTimeChange}
          required
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
                  <ListItemText id={labelId.toString()} primary={value.name} />
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
      >
        <Button type="submit" form="maxForm">
          Show Matched Events
        </Button>
      </ButtonGroup>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="body"
        PaperProps={{ sx: { width: "100%" } }}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle>
          <Typography textAlign={"center"} gutterBottom component="div">
            ** in order to max events choose the button bellow **
          </Typography>
          <ButtonGroup
            variant="contained"
            size="large"
            aria-label="text button group"
            fullWidth={true}
          >
            <Button
              variant="contained"
              size="large"
              aria-label="text button group"
              fullWidth={true}
            >
              Max It
            </Button>
          </ButtonGroup>
        </DialogTitle>
        <DialogContent
          dividers
          className={"Calendar__wrapper"}
          sx={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            p: "5%",
            gap: 2,
          }}
        >
          <CalendComponent isGeneral={true} isDark={true} filters={filters} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
