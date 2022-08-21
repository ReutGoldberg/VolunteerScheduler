import React, { useEffect, useState } from "react";
import {
  eventDetails,
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
import { EventDatePicker } from "./EventDatePicker";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MaximizeIcon from "@mui/icons-material/Maximize";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { start } from "repl";
import {getLabels} from "../utils/DataAccessLayer";
import {fullEventDetails, labelOptions} from "../utils/helper";

export interface PopupEventProps {
  calenderOpenDialog: boolean;
  calenderSelectedEvent: fullEventDetails | null;
}

export const PopupEvent: React.FC<PopupEventProps> = ({
  calenderOpenDialog,
  calenderSelectedEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<fullEventDetails | null>(
    calenderSelectedEvent
  );
  const [openDialog, setOpenDialog] = useState(calenderOpenDialog);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEnrollment = () => {
    setIsEnrolled(!isEnrolled);
    //and send to
  };

  return (
    <Box>
      {selectedEvent && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          scroll="body"
          PaperProps={{ sx: { width: "35%" } }}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          {/* {console.log("selectedEvent: \n")}
          {console.log(selectedEvent)} */}
          <DialogTitle id="scroll-dialog-title">
            {selectedEvent["title"]}
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              in charge of: {selectedEvent["created_by"]}
            </Typography>
            {selectedEvent["label"] && (
              <Typography gutterBottom>
                label: {selectedEvent["label"]}
              </Typography>
            )}
            <Typography gutterBottom>it works!</Typography>
            <Typography gutterBottom>
              <Button id="enrollmentEvenBtn" onClick={handleEnrollment}>
                {isEnrolled ? "" : "Not "} Enrolled to the event
              </Button>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
