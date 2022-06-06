import { DateTime } from 'luxon';
import * as faker from '@faker-js/faker'
import { v4 } from 'uuid';
import axios from 'axios';

export interface fullEventDetails{
  id: BigInteger,
  startAt: DateTime,
  endAt: DateTime,
  title: string,
  details: string,
  color: string,
  allDay: false,
  label: string,
  location: String,
  created_by: String,
  min_volenteers: String,
  max_volenteers: String,
}

export interface eventDetails{
  id: BigInteger,
  startAt: DateTime,
  endAt: DateTime,
  summary: string,
  color: string,
  allDay: false,
  label: string,
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




export const getAllEvents = async () => {
  const events: any = [];
  const response = await axios({
      method: "get",
      url: `http://localhost:5001/all_events`,
      headers: {  "Content-Type": "application/json"},
  });
  if(response.statusText === 'OK'){
      console.log('got events')
      console.log(response.data)
      const event1= response.data[0]
      console.log(event1)
      console.log(event1["id"])
      const new_event: any={
        id: v4(),
        startAt: event1["start_time"],
        endAt: event1["end_time"],
        summary: event1["details"],
        color: 'blue',
        allDay: false,
        label: event1["label"],
      }
      console.log(new_event)
      // const event: any = {
      //   id: v4(),
      //   startAt: startDate.toUTC().toString(),
      //   endAt: endDate.toUTC().toString(),
      //   summary: faker.faker.commerce.department(),
      //   color: colors[Math.floor(Math.random() * colors.length - 1) + 1],
      //   allDay: endDate.day !== startDate.day,
      //   label: "hello",
      // };
      events.push(new_event);
    }
  else
    console.log('didnt get events')
  console.log("events: ")
  console.log(events)
  return events;
};
// const getAllEvents = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   const response = await axios({
//       method: "get",
//       url: `http://localhost:5001/all_events`,
//       headers: {  "Content-Type": "application/json"},
//   });
//   if(response.statusText === 'OK')
//       console.log('got events')
//   else
//     console.log('didnt get events')
// };




export const generateDemoEvents = (
  date: DateTime = DateTime.now(),
  count = 190
) => {
  const events: any = [];

  const monthStart: any = date
    .set({ day: 1 })
    .minus({ days: 14 })
    .toFormat('yyyy-MM-dd');
  const monthEnd: any = date
    .set({ day: 28 })
    .plus({ days: 14 })
    .toFormat('yyyy-MM-dd');

  for (let i = 1; i < count; i += 1) {
    const dateStart: any = faker.faker.date.between(monthStart, monthEnd);

    const hour: number = Math.floor(Math.random() * 23) + 1;
    const minute: number = Math.floor(Math.random() * 40) + 1;
    const minuteDuration: number = Math.floor(Math.random() * 120) + 30;

    const startDate: DateTime = DateTime.fromJSDate(dateStart).set({
      hour: hour,
      minute: minute,
    });
    const endDate: DateTime = startDate.plus({ minute: minuteDuration });

    const event: any = {
      id: v4(),
      startAt: startDate.toUTC().toString(),
      endAt: endDate.toUTC().toString(),
      summary: faker.faker.commerce.department(),
      color: colors[Math.floor(Math.random() * colors.length - 1) + 1],
      allDay: endDate.day !== startDate.day,
      label: "hello",
    };
    console.log(event)

    events.push(event);
  }
  console.log("events: ")
  console.log(events)
  return events;
};

const get_events = async () =>{
  const response = await axios({
    method: "get",
    url: `http://localhost:5001/all_events`,
    headers: {  "Content-Type": "application/json"},
  });
  if(response.statusText === 'OK'){
    console.log("got events")
    console.log(response.data)
    return response.data
  }
  else
    return []
}

export const generateDemoEvents1 =  async(): Promise<eventDetails[] | null> => {
  const all_events: eventDetails[] = [];
  try{
    const response = await axios({
      method: "get",
      url: `http://localhost:5001/all_events`,
      headers: {  "Content-Type": "application/json"},
    });
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
          label: event1["label"],
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