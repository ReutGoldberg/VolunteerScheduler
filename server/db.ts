// Prisma section //
//----------------------------------------------------------------
  /** Data Access Layer for our DB
   *
   *  Contains all methods that change the data inside our DB
  */
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

  async function addNewUser(firstName:String, lastName:String, email:string, token:string){
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
  }

  //grants admin prevlege to provided user-email
  //todo: remove - was united into setAdmin
  // async function addNewAdmin(email:string){
  //   const user = await prisma.Users.update({
  //     where:{
  //       email: email,
  //       },
  //       data:{
  //         is_admin: true,
  //       },
  //     });
  //   return user;
  // }

  async function setAdmin(email:string, isAdmin:boolean){
    const user = await prisma.Users.update({
      where:{
        email: email,
        },
        data:{
          is_admin: isAdmin,
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

  async function getUserByEmail(email: string){
    const user = await prisma.Users.findUnique({
      where:{
        email: email,
      }
    });
    return user;
  }

  //token should be the sub value
  async function getUserByToken(sub: string){
    const user = await prisma.Users.findUnique({
      where:{
        token: sub,
      }
    });
    return user;
  }

  //shuld be private function and only be used by db.ts and server.ts 
  async function getAllAdminUsers(){
    const users = await prisma.Users.findMany({
      where:{
        is_admin: true,
      }
    });
    return users;
  }
  // ------------- Events ----------------------- 
  async function getAllEvents(){
    const events = await prisma.Events.findMany();
    return events;
  }

  async function deleteEventById(event_id: Number) {
    console.log("deleteEventById");
    const deletedEvent = await prisma.Events.delete({
      where: {
        id: event_id,
      }
    });
    return deletedEvent;
  }

  async function getEvent(event_id: Number){
    const event_details = await prisma.Events.findFirst({
      where:{
        id: event_id,
      },
      include: {
        EventLabelMap:{
        select:{
          Labels: true
        }
      }
      },
    });
    return event_details;
  }

  async function addNewEvent(event:any){
    console.log('adding event')
    const {id, title, details, labels, location, min_volenteers, max_volenteers, startAt, endAt, created_by} = event; 
    var label_event_list=[]
    for (var label of labels){
      label_event_list.push({Labels: {connect: {id: label.id}}});
    }
    console.log(label_event_list)
    const new_event = await prisma.Events.create({
      data: {
        title: title,
        details: details,
        location: location,
        min_volenteering: min_volenteers,
        max_volenteering: max_volenteers,
        start_time: startAt,
        end_time: endAt,
        created_by: created_by,
        EventLabelMap: {
          create: label_event_list,
        },
      },
    });
    // console.log('add event!')
    // console.log(new_event)
    return new_event;
  }

  async function enrollToEvent(event_id:number, user_token:string){
    console.log('enroll to event')
    console.log(event_id) 
      try{
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
    catch(error: any){
      console.log(error.message)
      if (error.code == 'P2002'){  // already exsist
        return true
      }
      return false
    }
  }
  
  async function editEvent(event:any){
    console.log('edit event')
    const {id, title, details, labels, location, min_volenteers, max_volenteers, startAt, endAt, created_by} = event; 
    var label_event_list=[]
    for (var label of labels){
      label_event_list.push({Labels: {connect: {id: label.id}}});
    }
    console.log(label_event_list)
    const new_event = await prisma.Events.update({
      where:{
        id: id
      },
      data: {
        title: title,
        details: details,
        location: location,
        min_volenteering: min_volenteers,
        max_volenteering: max_volenteers,
        start_time: startAt,
        end_time: endAt,
        created_by: created_by,
        EventLabelMap: {
          deleteMany: {},
          create: label_event_list,
        },
      },
    });
    console.log('edit event!')
    console.log(new_event)
    return new_event;
  }

  async function getAllLabels() {
    const labels = await prisma.Labels.findMany();
    return labels;
  }

  async function addNewLabel(labelName:string) {
    const label = await prisma.Labels.create({
      data: {
        name: labelName,
      },
    });
    return label;
  }

  async function addNewLog(logTxt:string, logTime:Date) {
    const log = await prisma.Logs.create({
      data: {
        text: logTxt,
        time: logTime,
      },
    });
    return log;
  }




  /*
  async function addNewUser(firstName:String, lastName:String, email:string, token:string){
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
  }
  */

  export {enrollToEvent, editEvent, getUserByToken,getAllLabels, getUserByEmail,getEvent, getAllUsers,addNewUser,updateUser,deleteUserById, setAdmin, getAllEvents, deleteEventById, addNewEvent, getAllAdminUsers, addNewLabel, addNewLog};
