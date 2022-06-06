// Prisma section //
//----------------------------------------------------------------
  /** Data Access Layer for our DB
   *
   *  Contains all methods that change the data inside our DB
  */
// import { PrismaClient } from '@prisma/client' -- not working for me due to a bug - switched to require()
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

  async function addNewUser(firstName:String, lastName:String){
  const user = await prisma.test_person.create({
    data: {
      firstName: firstName,
      lastName: lastName,
    },
  });
  return user;
  }

  async function addNewAdmin(name:String, password:String){
    const user = await prisma.Users.create({
      data: {
        firstName: name,
        lastName: name,
        email: name,
        password: password,
        admin: true
      },
    });
    return user;
    }

  async function getAllUsers() {
    const users = await prisma.test_person.findMany();
    return users;
  }

  async function updateUser(userId:Number, userName:String) {
  const user = await prisma.test_person.update({
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
    const deletedUser = await prisma.test_person.delete({
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

  async function getEvent(event_id: Number){
    const event_details = await prisma.Events.findMany({
      where:{
        id: event_id,
      }
    });
    return event_details[0];
  }
  
  export {getEvent, getAllUsers,addNewUser,updateUser,deleteUserById, addNewAdmin, getAllEvents};
