// #Fake part - added enroll by Id: to event by userId and eventId
// Fake generation of data to populate db for various porpuses  - unrelated to the real project.


const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()
const config = require('./config')

export async function addNewFakeUser(firstName:String, lastName:String, email:string, token:string, is_admin:boolean){
    try {
      const user = await prisma.Users.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          token: token,
          is_admin: is_admin,
        },
      });
      return user;    
    } catch (error:any) {
      console.error("Error in addNewFakeUser from fake_db.ts");
      console.error(error.message);
      throw error;
    }
    }

export async function addNewFakeEvent(event:any){
    try {
      const {title,labels,details,created_by, location, min_volunteers, max_volunteers, start_time, end_time} = event; 
      /*connecting labels - the fake way*/
      console.log(`Got the following Labels: ${labels}`)
      const new_labels_arr = labels.split(" ")

      //saving labels to the db to gain id
      for (const label of new_labels_arr) {
        addNewFakeLabel(label);
      } 

      //grab their real db id
      let dbLabels = [];
      for (const label_name of new_labels_arr) {
        const dbLabel = await prisma.Labels.findFirst({
          where:{
            name: label_name,
          }
        });
        dbLabels.push(dbLabel);
      }
      //save for mapping
      let label_event_list= [];
      for (let label of dbLabels){
        if(label != null)
          label_event_list.push({Labels: {connect: {id: label.id}}});
      }  

      const new_event = await prisma.Events.create({
        data: {
          title: title,
          details: details,
          location: location,
          min_volunteers: min_volunteers,
          max_volunteers: max_volunteers,
          start_time: start_time,
          end_time: end_time,
          created_by: created_by,
          EventLabelMap: {
            create: label_event_list,
          },
        },
      });
      return new_event;      
    } catch (error:any) {
      console.error("Error in addNewFakeEvent from fake_db.ts");
      console.error(error.message);
      throw error;
    }
  }


  export async function addNewFakeLabel(labelName:string) {
    try {
      console.log("addNewLabel");
      return await prisma.Labels.create({
        data: {
          name: labelName,
        },
      });
    } catch (error:any) {
      console.error("Error in addNewFakeLabel from fake_db.ts");
      console.error(error.message);
      throw error; 
    }
  
  }
  
  export async function addNewFakeLog(logTxt:string, logTime:Date) {
    try {
      return await prisma.Logs.create({
        data: {
          text: logTxt,
          time: logTime,
        },
      });  
    } catch (error:any) {
      console.error("Error in addNewFakeLog from fake_db.ts");
      console.error(error.message);
      throw error; 
    }
  }

  export async function enrollToFakeEvent(num_enrolls:number){
    if(!config.server_app.IS_FAKE) //safe check before allowing to use this function
      return;
      let count:number = 0
      try{
        const allDBUsers = await prisma.Users.findMany();
        const allDBEvents = await prisma.Events.findMany();

         for (let i = 0; i < num_enrolls; i++) {
          const current_user_idx = Math.floor(Math.random() * allDBUsers.length);
          const current_event_idx = Math.floor(Math.random() * allDBEvents.length);
          const user = allDBUsers[current_user_idx];
          const event = allDBEvents[current_event_idx];
            const new_user_enrolled = await prisma.Users.update({
              where:{
                token: user.token
              },
              data: {
                EventVolunteerMap: {
                  create: [{Events: {connect: {id: event.id}}}],
                },
              },
            });          
          }             
        return true;  
    }
    catch(error: any){
      console.log(error.message)
      if (error.code === 'P2002'){  // already exsist
        console.log("already enrolled -didnt do anything")
        enrollToFakeEvent(num_enrolls-count) //call again to resum the enrollmenet
      }
      //else
      console.error("Error in enrollToEvent from db.ts");
      console.error(error.message);
      throw error;
    }
  }
  