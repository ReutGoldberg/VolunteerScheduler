import React, { useEffect, useState } from 'react';
import { generateDemoEvents } from '../utils/helper';
import { DateTime } from 'luxon';
import Kalend, { CalendarView, OnEventDragFinish } from 'kalend';
import 'kalend/dist/styles/index.css';

const CalendComponent = (props: any) => {
  const [demoEvents, setDemoEvents] = useState({});

  // Create and load demo events
  useEffect(() => {
    setDemoEvents(generateDemoEvents(DateTime.now(), 80));
  }, []);

  const onNewEventClick = (data: any) => {
    console.log(data.event);

    const msg = `New event click action\n\n Callback data:\n\n${JSON.stringify({
      hour: data.hour,
      day: data.day,
      startAt: data.startAt,
      endAt: data.endAt,
      view: data.view,
      event: 'click event ',
    })}`;
    console.log(msg);
  };

  // Callback for event click
  const onEventClick = (data: any) => {
    const msg = `Click on event action\n\n Callback data:\n\n${JSON.stringify(
      data
    )}`;
    console.log(msg);
  };

  // Callback after dragging is finished
  const onEventDragFinish: OnEventDragFinish = (
    prev: any,
    current: any,
    data: any
  ) => {
    setDemoEvents(data);
  };

  return (
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
      timezone={'Europe/Berlin'}
      // draggingDisabledConditions={{
      //   summary: 'Computers',
      //   allDay: false,
      //   color: 'pink',
      // }}
      onEventDragFinish={onEventDragFinish}
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
  );
};

export default CalendComponent;
