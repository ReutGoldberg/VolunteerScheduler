import React, { useEffect, useState } from "react";
import { eventDetails, fullEventDetails, generateDemoEvents1 } from "../utils/helper";
import { getAllEvents } from "../utils/helper";
import axios from 'axios';
import { DateTime } from "luxon";
import Kalend, { CalendarView, OnEventDragFinish } from "kalend";
import "kalend/dist/styles/index.css";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';

const CalendComponent = (props: any) => {
  const [demoEvents, setDemoEvents] = useState<eventDetails[] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<fullEventDetails | null>(null);

  //Create and load demo events
  useEffect((): void => {
    generateDemoEvents1()
        .then(res => {
        setDemoEvents(res!!)
  }).catch(er => {})
}, [])
  
  // useEffect(() => { 
  //   setDemoEvents(generateDemoEvents1());
  // }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }; 


  const onNewEventClick = (data: any) => {
    console.log(data.event);
    const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify({
      hour: data.hour,
      day: data.day,
      startAt: data.startAt,
      endAt: data.endAt,
      view: data.view,
      event: "click event ",
    })}`;
    console.log(msg);
    
  };

  // Callback for event click
  const onEventClick = async (data: any) => {
    const msg = `Click on event action\n\n Callback data:\n\n${JSON.stringify(
      data
    )}`;
    console.log(msg);
    const request_data = data["id"]
    console.log(request_data)
    const response = await axios({
      method: "get",
      url: `http://localhost:5001/event_details/${request_data}`,
      // data: JSON.stringify(request_data),
      headers: {  "Content-Type": "application/json"},
    });
    if(response.statusText === 'OK'){
        console.log('got event details')
        console.log(response.data)
        setSelectedEvent(response.data)
        setOpenDialog(true)
    }
    else
      console.log('didnt get event details')
  };

  // Callback after dragging is finished
  // const onEventDragFinish: OnEventDragFinish = (
  //   prev: any,
  //   current: any,
  //   data: any
  // ) => {
  //   setDemoEvents(data);
  // };

  return (
    <div className={'Calendar__wrapper'}>
    <Kalend
      kalendRef={props.kalendRef}
      onNewEventClick={onNewEventClick}
      initialView={CalendarView.WEEK}
      disabledViews={[]}
      onEventClick={onEventClick}
      events={demoEvents}
      initialDate={new Date().toISOString()}
      hourHeight={60}
      // showWeekNumbers={true}
      timezone={"Europe/Berlin"}
      // draggingDisabledConditions={{
      //   summary: 'Computers',
      //   allDay: false,
      //   color: 'pink',
      // }}
     // onEventDragFinish={onEventDragFinish}
      onStateChange={props.onStateChange}
      selectedView={props.selectedView}
      showTimeLine={true}
      isDark={false}
      autoScroll={true}
      // colors={{
      //   light: {
      //     primaryColor: 'blue',
      //   },
      //   dark: {
      //     primaryColor: 'orange',
      //   },
      // }}
    />
    {selectedEvent?
    <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          scroll='body'
          PaperProps={{sx:{width:'35%'}}}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">{selectedEvent["title"]}</DialogTitle>
          <DialogContent dividers>
          <Typography gutterBottom>
            in charge of: {selectedEvent["created_by"]}
          </Typography>
          <Typography gutterBottom>
            label: {selectedEvent["label"]}
          </Typography>
          <Typography gutterBottom>
            it works!
          </Typography>
        </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>close</Button>
          </DialogActions>
    </Dialog>
    : <div></div>}
    </div>
  );
};

export default CalendComponent;
