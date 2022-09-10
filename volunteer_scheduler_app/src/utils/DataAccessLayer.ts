import jwt_decode from "jwt-decode";
import axios from 'axios';
import { AppConfig } from "../AppConfig";
import { enrollement_details, fullEventDetails } from "./helper";


//todo: change this to a class - DAL and have a private field of token.
    async function isNewUser(token:string){
      const requestURL:string = `${AppConfig.server_url}/user/isNewUser/`;
    //@ts-ignore 
      const response = await axios({
        method: "get",
        url: requestURL,
        headers: { "Content-Type": "application/json",
                   "authorization": token
                  },
    });
      return !response.data
    }

 
  async function createUser(userToken:string){
    try {
      const userObject = jwt_decode(userToken); 
    //@ts-ignore
      const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email};
      const response = await axios({
          method: "post",
          url: `${AppConfig.server_url}/user/add_user`,
          data: JSON.stringify(data),
          headers: { "Content-Type": "application/json",
                     "Authorization": userToken
                    },
      });
    } catch (error:any) {
      console.error(error.message);
      throw error;

    }

  }



//make this a private function for the class DAL
 async function isAdminUser(userToken:string){
    try {
      if(userToken == null || userToken === "")
        return false;

      const requestURL:string = `${AppConfig.server_url}/user/userEmail/`;
      const response = await axios({
        method: "get",
        url: requestURL,
        headers: { "Content-Type": "application/json",
                   "authorization": userToken
                  },
        });
      console.log(`Is Admin result: ${response.data.is_admin}`)
      return response.data.is_admin;
    } catch (error:any) {
      console.error(error);
      throw error;
    }
}

async function getLabels(userToken:string){
  console.log("getLabels check if admin")
  const isAdmin = await isAdminUser(userToken);
  if (!isAdmin){
    console.log("From getLabels - userDoesn't have admin rights");
    return undefined;
  }

  const requestURL:string = `${AppConfig.server_url}/all_labels`;
  const response = await axios({
    method: "get",
    url: requestURL,
    headers: { "Content-Type": "application/json",
               "Authorization": userToken
              },
    });
  return response.data;
}

async function getAdminsList(usertoken:string){
  const isAdmin = await axios({
                      method: "get",
                      url: `${AppConfig.server_url}/user/userEmail/`,
                      headers: { "Content-Type": "application/json",
                                  "authorization": usertoken
                              },
  }).then((res) => res.data.is_admin)
  
  if(!isAdmin){
    console.error("Must be an admin for this operation")
    return;
  }
  
  const response2 =  await axios({
                      method: "get",
                      url: `${AppConfig.server_url}/user/adminsUserEmail/`,
                      headers: { "Content-Type": "application/json",
                                  "authorization": usertoken
                              },
                    });
  return response2.data;
}



export async function addAdmin(email:string, usertoken:string) {
  return await axios({
    method: "put",
    url: `${AppConfig.server_url}/user/add_admin`,
    data: {email:email, isAdminFlag:true},
    headers: { "Content-Type": "application/json; charset=utf-8",
    "authorization": usertoken }, 
  });
}

export async function removeAdmin(email:string, usertoken:string) {
  return await axios({
    method: "put",
    url: `${AppConfig.server_url}/user/remove_admin`,
    data: {email:email, isAdminFlag:false},
    headers: { "Content-Type": "application/json; charset=utf-8",
    "authorization": usertoken }, 
  });
}

export async function addEnrollReq(event_id:number, token:string){
  try{
    console.log("addEnrollReq");
    console.log(event_id)
    const response =  await axios({
        method: "post",
        url: `${AppConfig.server_url}/enroll_to_event`,
        data: {event_id:event_id},
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function unenrollReq(event_id:number, token:string){
  try{
    console.log("addEnrollReq");
    console.log(event_id)
    const response =  await axios({
        method: "post",
        url: `${AppConfig.server_url}/unenroll_to_event`,
        data: {event_id:event_id},
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function editEventReq(event_details:fullEventDetails, token:string){
  try{
  const response =  await axios({
      method: "post",
      url: `${AppConfig.server_url}/edit_event`,
      data: JSON.stringify(event_details),
      headers: { "Content-Type": "application/json",
                  "authorization": token
               },
    });
  return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function addEventReq(event_details:fullEventDetails, token:string){
  try{
    const response =  await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_event`,
        data: JSON.stringify(event_details),
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function deleteEventReq(event_id:number, token:string){
  try{
    console.log("deleteEventReq1");
    const response =  await axios({
        method: "delete",
        url: `${AppConfig.server_url}/delete_event/${event_id}`,
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    console.log("deleteEventReq2");
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function getEventDetails(event_id:number, token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/event_details/${event_id}`,
      // data: JSON.stringify(request_data),
      headers: { "Content-Type": "application/json", "authorization": token },
    });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function getAllEvents(token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/all_events`,
      headers: {  "Content-Type": "application/json", "authorization": token},
    });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function getpersonalEvents(token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/personal_events`,
      headers: {  "Content-Type": "application/json", "authorization": token},
    });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}
//returns whether the current user, with the current token, is enrolled to the specific event
// this used for desplaying the personal events for the user.
export async function getIsUserEnrolled(event_id:number, token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/events/${event_id}`,
      // data: JSON.stringify(request_data),
      headers: { "Content-Type": "application/json", "authorization": token },
    });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}







/* FAKE */ 
  async function createFakeUser(userObject:any){
    const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email, token: userObject.token};
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake/user`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json",
        "Authorization": `fake_data_token-${data.token}`
      },
    });
  }
  /* still in the works */
  async function createFakeEvent(data:any){
    try {
      const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake/event`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json",
        "Authorization": "fake_event"
      },
    });
    return response;
    }
    catch(err:any){
      console.error(err);
      throw err;
    }

  } 
  


  async function createFakeLabel(data:any){
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake/label`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json", "Authorization": "fake_label"},
    });
  }


  async function createFakeLog(data:any){
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake/log`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json", "Authorization": "fake_log"},
    });
  }


export {isNewUser, createUser, isAdminUser, getAdminsList , createFakeUser, getLabels, createFakeLabel, createFakeLog, createFakeEvent}