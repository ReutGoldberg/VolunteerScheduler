import React, { useEffect, useState } from "react";
import {
  eventDetails,
  fullEventDetails,
  generateDemoEvents1,
} from "../utils/helper";
import { getAllEvents } from "../utils/helper";
import axios from "axios";
import { DateTime } from "luxon";
import Kalend, { CalendarView, OnEventDragFinish } from "kalend";
import "kalend/dist/styles/index.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, ButtonGroup } from "@mui/material";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { isAdminUser } from "../utils/DataAccessLayer";
import { AddOrEditEvent } from "./AddOrEditEvent";

const CalendComponent = (props: any) => {
  const [demoEvents, setDemoEvents] = useState<eventDetails[] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<fullEventDetails | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState(isAdminUser());

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //Create and load demo events
  useEffect((): void => {
    generateDemoEvents1()
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
    const request_data = data["id"];
    const response = await axios({
      method: "get",
      url: `http://localhost:5001/event_details/${request_data}`,
      // data: JSON.stringify(request_data),
      headers: { "Content-Type": "application/json" },
    });
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
        timezone={"Europe/Berlin"}
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
            <AddOrEditEvent toEditEventDetails={selectedEvent} />
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
