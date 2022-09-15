// Prisma section //
//----------------------------------------------------------------
  /** Data Access Layer for our DB
   *
   *  Contains all methods that change the data inside our DB
  */
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

  async function addNewUser(firstName:String, lastName:String, email:string, token:string){
  try {
    const user = await prisma.Users.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        token: token,
        is_admin: false,
      },
    });
    return user;    
  } catch (error:any) {
    console.error("Error in addNewUser from db.ts");
    console.error(error.message);
    throw error;
  }
  }

  async function setAdmin(email:string, isAdmin:boolean){
    try {
      const user = await prisma.Users.update({
        where:{
          email: email,
          },
          data:{
            is_admin: isAdmin,
          },
        });
      return user;      
    } catch (error:any) {
      console.error("Error in setAdmin from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function getAllUsers() {
    try {
      const users = await prisma.Users.findMany();
      return users;      
    } catch (error:any) {
      console.error("Error in getAllUsers from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  //todo: change userName to an entire object of user details 
  async function updateUser(userId:Number, userName:String) {
    try {
      const user = await prisma.Users.update({
        where:{
          id: userId,
          },
          data:{
            firstName: userName,
          },
        });
      return user; 
    } catch (error:any) {
      console.error("Error in updateUser from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function deleteUserById(userId:Number) {
    try {
      const deletedUser = await prisma.Users.delete({
        where: {
          id: userId,
        }
      });
      return deletedUser; 
    } catch (error:any) {
      console.error("Error in deleteUserById from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function getUserByEmail(email: string){
    try {
      const user = await prisma.Users.findUnique({
        where:{
          email: email,
        }
      });
      return user;
    } catch (error:any) {
      console.error("Error in getUserByEmail from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  //token should be the sub value
  async function getUserByToken(sub: string){
    try {
      const user = await prisma.Users.findUnique({
        where:{
          token: sub,
        }
      });
      return user;
    } catch (error:any) {
      console.error("Error in getUserByToken from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  //shuld be private function and only be used by db.ts and server.ts 
  async function getAllAdminUsers(){
    try {
      const users = await prisma.Users.findMany({
        where:{
          is_admin: true,
        }
      });
      return users;
    } 
    catch (error:any) {
      console.error("Error in getAllAdminUsers from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  // ------------- Events ----------------------- 
  async function getAllEvents(){
    try {
      const events = await prisma.Events.findMany();
      return events;
    } catch (error:any) {
      console.error("Error in getAllEvents from db.ts");
      console.error(error.message);
      throw error;
    }

  }

  async function getPersonalEvents(user_token: string){
    try {
      const events = await prisma.Events.findMany({
        where:{
          EventVolunteerMap:{
            some:{
              Users:{
                token: user_token
              }
            }
          }
        }
      });
      return events;
    } catch (error:any) {
      console.error("Error in getPersonalEvents from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function getFilterEvents(user_token: string, start_time:Date, end_time:Date){
    try {
      const events = await prisma.Events.findMany({
        where:{
          start_time:{
            gte: start_time
          },
          end_time:{
            lte: end_time
          },
        }
      });
      console.log(events);
      return events;
    } catch (error:any) {
      console.error("Error in getPersonalEvents from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function deleteEventById(event_id: Number) {
    try {
      const deletedEvent = await prisma.Events.delete({
        where: {
          id: event_id,
        }
      });
      return deletedEvent;
    } catch (error:any) {
      console.error("Error in deleteEventById from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function getEvent(event_id: Number){
    try {
      const event_details = await prisma.Events.findFirst({
        where:{
          id: event_id,
        },
        include: {
          EventLabelMap:{
          select:{
            Labels: true
          }
        },
        EventVolunteerMap:{
          select:{
            Users: {
              select:{
                id: true,
                first_name: true,
                last_name: true,
                email: true
              }
            }
          }
        },
        },
      });
    return event_details;
    } catch (error:any) {
      console.error("Error in getEvent from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function addNewEvent(event:any){
    try {
      const {id, title, details, labels, location, min_volunteers: min_volunteers, max_volunteers: max_volunteers, startAt, endAt, created_by} = event; 
      var label_event_list=[]
      for (var label of labels){
        label_event_list.push({Labels: {connect: {id: label.id}}});
      }
      const new_event = await prisma.Events.create({
        data: {
          title: title,
          details: details,
          location: location,
          min_volenteering: min_volunteers,
          max_volenteering: max_volunteers,
          start_time: startAt,
          end_time: endAt,
          created_by: created_by,
          EventLabelMap: {
            create: label_event_list,
          },
        },
      });
      return new_event;      
    } catch (error:any) {
      console.error("Error in addNewEvent from db.ts");
      console.error(error.message);
      throw error;
    }
  }

  async function enrollToEvent(event_id:number, user_token:string){
    //todo: remove logging when done testing
    console.log('enroll to event')
    console.log(event_id) 
      try{
        const event_details = await prisma.Events.findFirst({
          where:{
            id: event_id,
          },
          include: {
          EventVolunteerMap:{
            select:{
              Users: {
                select:{
                  id: true,
                }
              }
            }
          },
          },
        });
      const max=event_details["max_volenteering"];
      const current = event_details["EventVolunteerMap"].length;
      if(current<max){
        const new_user_enrolled = await prisma.Users.update({
          where:{
            token: user_token
          },
          data: {
            EventVolunteerMap: {
              create: [{Events: {connect: {id: event_id}}}],
            },
          },
        });
        return true;
      }
      else{
        console.log("cant enroll- full capacity")
        return false;
      }
    }
    catch(error: any){
      console.log(error.message)
      if (error.code === 'P2002'){  // already exsist
        console.log("already enrolled -didnt do anything")
        return true
      }
      //else
      console.error("Error in enrollToEvent from db.ts");
      console.error(error.message);
      throw error;
    }
  }
    
  async function unenrollToEvent(event_id:number, user_token:string){
    //todo: remove when done testing
    console.log('unenroll to event')
    console.log(event_id) 
    try {
      const user = await getUserByToken(user_token)
      const user_id = user.id
      console.log(user_id) 
      const new_user_enrolled = await prisma.EventVolunteerMap.delete({
        where:{
          event_id_user_id: {
            event_id: event_id,
            user_id: user_id,
          },
        },
    });
      return true;
    } catch (error:any) {
      console.error("Error in unenrollToEvent from db.ts");
      console.error(error.message);
      throw error;
    }

  }
  
  
  async function editEvent(event:any){
    try {
      const {id, title, details, labels, location, min_volunteers, max_volunteers, startAt, endAt, created_by} = event; 
      var label_event_list=[]
      for (var label of labels){
        label_event_list.push({Labels: {connect: {id: label.id}}});
      }
      const new_event = await prisma.Events.update({
        where:{
          id: id
        },
        data: {
          title: title,
          details: details,
          location: location,
          min_volenteering: min_volunteers,
          max_volenteering: max_volunteers,
          start_time: startAt,
          end_time: endAt,
          created_by: created_by,
          EventLabelMap: {
            deleteMany: {},
            create: label_event_list,
          },
        },
      });
      console.log("event was successfully edited")
      return new_event;      
    } catch (error:any) {
      console.error("Error in editEvent from db.ts");
      console.error(error.message);
      throw error;
    }

  }


  export async function getIsUserEnrolledToEvent(event_id:number, user_token:string){
    
    try
    {
      const user = await getUserByToken(user_token)
      const user_id = user.id
      //console.log(`IsEnrolledToEvent userId: ${user_id} event_id: ${event_id}`) 
      const new_user_enrolled = await prisma.EventVolunteerMap.findFirst({
        where:{
          event_id: event_id,
          user_id: user_id,
          },
        },
   );
      return new_user_enrolled;
  }
  catch(error: any){
    console.error("Error in getIsUserEnrolledToEvent from db.ts");
    console.error(error.message)
    throw error;
  }
}

async function getAllLabels() {
  try {
    return await prisma.Labels.findMany();    
  } catch (error:any) {
    console.error("Error in getAllLabels from db.ts");
    console.error(error.message);
    throw error;
  }

}

async function addNewLabel(labelName:string) {
  try {
    return await prisma.Labels.create({
      data: {
        name: labelName,
      },
    });
  } catch (error:any) {
    console.error("Error in addNewLabel from db.ts");
    console.error(error.message);
    throw error; 
  }

}

async function addNewLog(logTxt:string, logTime:Date) {
  try {
    return await prisma.Logs.create({
      data: {
        text: logTxt,
        time: logTime,
      },
    });  
  } catch (error:any) {
    console.error("Error in addNewLog from db.ts");
    console.error(error.message);
    throw error; 
  }
}

export {getPersonalEvents, unenrollToEvent, enrollToEvent, editEvent, getUserByToken,getAllLabels, getUserByEmail,getEvent, getAllUsers,addNewUser,updateUser,deleteUserById, setAdmin, getAllEvents, getFilterEvents, deleteEventById, addNewEvent, getAllAdminUsers, addNewLabel, addNewLog};
