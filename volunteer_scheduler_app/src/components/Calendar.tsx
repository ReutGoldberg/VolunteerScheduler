import React, { useEffect, useState } from "react";
import {
  eventDetails,
  fullEventDetails,
  parseGetEvents,
} from "../utils/helper";
import axios from "axios";
import { DateTime } from "luxon";
import Kalend, { CalendarView, OnEventDragFinish } from "kalend";
import "kalend/dist/styles/index.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { isAdminUser, getEventDetails } from "../utils/DataAccessLayer";
import { AddOrEditEvent } from "./AddOrEditEvent";
import { AppConfig } from "../AppConfig";

const CalendComponent = (props: any, isGeneral: boolean) => {
  const [demoEvents, setDemoEvents] = useState<eventDetails[] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<fullEventDetails | null>(
    null
  );
  const [isAdmin, setIsAdmin] = React.useState(false);

  const setOpenDialogApp = (openDialogApp: boolean) => {
    setOpenDialog(openDialogApp);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  React.useEffect(() => {
    const genIsAdmin = async () => {
      const data =
        window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";
      const userFromStorage = JSON.parse(data);
      var isAdminTemp = await isAdminUser(userFromStorage.token || "");
      setIsAdmin(isAdminTemp);
      console.log("isAdminTemp " + isAdminTemp);
    };

    genIsAdmin();
  }, []);

  //Create and load demo events
  useEffect((): void => {
    const data =
      window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";
    const userFromStorage = JSON.parse(data);
    parseGetEvents(userFromStorage.token, props.isGeneral)
      .then((res) => {
        setDemoEvents(res!!);
      })
      .catch((er) => {});
  }, []);

  const onNewEventClick = (data: any) => {
    const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify({
      hour: data.hour,
      day: data.day,
      startAt: data.startAt,
      endAt: data.endAt,
      view: data.view,
      event: "click event ",
    })}`;
  };

  // Callback for event click
  const onEventClick = async (data: any) => {
    const msg = `Click on event action\n\n Callback data:\n\n${JSON.stringify(
      data
    )}`;
    console.log(msg);
    const event_id = data["id"];
    const token_data =
      window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";
    const userFromStorage = JSON.parse(token_data);
    const response = await getEventDetails(
      event_id,
      userFromStorage.token || ""
    );
    if (response.statusText === "OK") {
      setSelectedEvent(response.data);
      setOpenDialog(true);
    } else console.log("didnt get event details");
  };

  return (
    <Box className={"Calendar__wrapper"}>
      <Kalend
        kalendRef={props.kalendRef}
        onNewEventClick={onNewEventClick}
        initialView={CalendarView.WEEK}
        disabledViews={[]}
        onEventClick={onEventClick}
        events={demoEvents}
        initialDate={new Date().toISOString()}
        hourHeight={60}
        timezone={"Asia/Jerusalem"}
        onStateChange={props.onStateChange}
        selectedView={props.selectedView}
        showTimeLine={true}
        isDark={false}
        autoScroll={true}
      />
      {selectedEvent && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          scroll="body"
          PaperProps={{ sx: { width: "35%" } }}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">
            {selectedEvent["title"]}
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              in charge of: {selectedEvent["created_by"]}
            </Typography>
            <AddOrEditEvent
              toEditEventDetails={selectedEvent}
              isAdmin={isAdmin}
              currentPage="fromCalender"
              setOpenDialogApp={setOpenDialogApp}
            />
            <Typography gutterBottom>
              Number Of Volunteers: {selectedEvent["count_volunteers"]}
            </Typography>
            {isAdmin && (
              <Typography gutterBottom>Volunteers Emails:</Typography>
            )}
            {isAdmin && (
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
                    {selectedEvent?.volunteers?.map((value) => {
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CalendComponent;
