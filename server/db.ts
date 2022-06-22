// Prisma section //
//----------------------------------------------------------------
  /** Data Access Layer for our DB
   *
   *  Contains all methods that change the data inside our DB
  */

import e from "express";

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

  async function addNewUser(firstName:String, lastName:String, email:string, token:string){
  const user = await prisma.Users.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      token: token,
      is_admin: false
    },
  });
  return user;
  }

  //grants admin prevlege to provided user-email
  async function addNewAdmin(email:string){
    const user = await prisma.Users.update({
      where:{
        email: email,
        },
        data:{
          is_admin: true,
        },
      });
    return user;
  }

  async function getAllUsers() {
    const users = await prisma.Users.findMany();
    return users;
  }

  //todo: change userName to an entire object of user details 
  async function updateUser(userId:Number, userName:String) {
  const user = await prisma.Users.update({
    where:{
      id: userId,
      },
      data:{
        firstName: userName,
      },
    });
    return user;
  }

  async function deleteUserById(userId:Number) {
    const deletedUser = await prisma.Users.delete({
      where: {
        id: userId,
      }
    });
    return deletedUser;
  }
  
  async function getAllEvents(){
    const events = await prisma.Events.findMany();
    return events;
  }

  async function deleteEventById(eventId:Number) {
    const deletedEvent = await prisma.Events.delete({
      where: {
        id: eventId,
      }
    });
    return deletedEvent;
  }

  async function getEvent(event_id: Number){
    const event_details = await prisma.Events.findFirst({
      where:{
        id: event_id,
      }
    });
    return event_details;
  }


  async function getUserByEmail(email: string){
    const user = await prisma.Users.findFirst({
      where:{
        email: email,
      }
    });
    return user;
  }


/*Event properties to update: 
        const full_event_details={
            id: event_details["id"],
            startAt: event_details["start_time"],
            endAt: event_details["end_time"],
            title: event_details["title"],
            details: event_details["details"],
            color: 'blue',
            allDay: false,
            label: event_details["label"],
            location: event_details["location"],
            created_by: event_details["created_by"],
            min_volenteers: event_details["min_volenteering"],
            max_volenteers: event_details["max_volenteering"],

*/

  
  export {getUserByEmail,getEvent, getAllUsers,addNewUser,updateUser,deleteUserById, addNewAdmin, getAllEvents, deleteEventById};
