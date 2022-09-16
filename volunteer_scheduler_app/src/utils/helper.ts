import { DateTime } from 'luxon';
import axios from 'axios';
import {getAllEvents, getFilterdEvents, getPersonalEvents} from "./DataAccessLayer";
import { AppConfig } from '../AppConfig';


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
  labels: labelOptions[],
  location: string,
  min_volunteers: number,
  max_volunteers: number,
  startAt: Date,
  endAt: Date,
  created_by: string,
  volunteers: volenteer[],
  count_volunteers: number,
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

export interface filtersToMax{
startDate: Date,
endDate: Date,
dateForStartTime: Date,
dateForEndTime: Date,
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

export const isUserExists=() => {
  const data: string =
    window.sessionStorage.getItem(AppConfig.sessionStorageContextKey) || "";
  if (data === "") return false;

  return true;
}

export const isValidEmail = (email:string) =>{
  return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
}

export const parseGetEvents =  async(token:string, isGeneral:boolean=true, filters:filtersToMax|null=null): Promise<eventDetails[] | null> => {
  const events: eventDetails[] = [];
  try{
    if(filters==null)
      var response = isGeneral ? await getAllEvents(token) : await getPersonalEvents(token);
    else
      var response = await getFilterdEvents(token, filters);

    if(response.statusText === 'OK'){
      console.log("got events")
      
      for (let i = 0; i < response.data.length; i ++) {
        const event1=response.data[i]
        let filtered_event_flag = false;
        if(filters!=null && filters.labels.length!=0){
          for(var label of filters.labels){
            if(event1["labels"].name.find(label.name) != null){
              filtered_event_flag=true;
              break;
              }
            }
          if(!filtered_event_flag){
            continue;
          }
        }
        
        const event: eventDetails = {
          id: event1["id"],
          startAt: event1["start_time"],
          endAt: event1["end_time"],
          summary: event1["title"],
          color: 'green',
          allDay: false,
          labels: event1["labels"],
        };
        events.push(event);
      }     
  }
  else
    console.log("didnt get event list")
  return events;
  }
  catch (error){
    console.log(error);
    throw error;
  }
};
