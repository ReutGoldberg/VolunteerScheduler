import { DateTime } from 'luxon';
import axios from 'axios';
import {getAllEvents, getpersonalEvents} from "./DataAccessLayer";


export interface labelOptions{
  id: number,
  name: string
}

export interface volenteer{
  id: number,
  first_name: string,
  last_name: string,
  email: string
}

export interface enrollement_details{
  event_id: number,
  user_id: string
}

export interface fullEventDetails{
  id: number,
  title: string,
  details: string,
  // allDay: false,
  labels: labelOptions[],
  location: string,
  min_volenteers: number,
  max_volenteers: number,
  startAt: Date,
  endAt: Date,
  created_by: string,
  volenteers: volenteer[],
  count_volunteers: number,
  // color: string
}

export interface eventDetails{
  id: number,
  startAt: DateTime,
  endAt: DateTime,
  summary: string,
  color: string,
  allDay: false,
  labels: labelOptions[],
}

const colors: string[] = [
  'indigo',
  'blue',
  'orange',
  'red',
  'pink',
  'crimson',
  'dodgerblue',
  'brown',
  'purple',
  'tomato',
  'MediumPurple',
  'salmon',
];

export const getPage = () => {
  return sessionStorage.getItem("page") || "main";
};

export const isValidEmail = (email:string) =>{
  return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
}

export const parseGetAllEvents =  async(token:string): Promise<eventDetails[] | null> => {
  const all_events: eventDetails[] = [];
  try{
    const response = await getAllEvents(token);
    if(response.statusText === 'OK'){
      console.log("got events")
      console.log(response.data.length)
      console.log(response.data)
      
      for (let i = 0; i < response.data.length; i += 1) {
        const event1=response.data[i]
        const event: eventDetails = {
          id: event1["id"],
          startAt: event1["start_time"],
          endAt: event1["end_time"],
          summary: event1["title"],
          color: 'green',
          allDay: false,
          // TODO:change in backend? check how to do that
          labels: event1["labels"],
        };
        console.log(event)
        all_events.push(event);
      }
      console.log("events: ")
      console.log(all_events)
      
  }
  else
    console.log("didnt get event list")
  return all_events;
  }
  catch (error){
    console.log(error);
    throw error;
  }
};