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
          url: `${AppConfig.server_url}/add_user`,
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
    console.log("todo: check if admin")
    try {
      if(userToken == null || userToken == "")
        return false;

      const requestURL:string = `${AppConfig.server_url}/user/userEmail/`;
      const response = await axios({
        method: "get",
        url: requestURL,
        headers: { "Content-Type": "application/json",
                   "authorization": userToken
                  },
        });

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
    url: `${AppConfig.server_url}/add_admin`,
    data: {email:email},
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
      url: `http://localhost:5001/event_details/${event_id}`,
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
      url: `http://localhost:5001/all_events`,
      headers: {  "Content-Type": "application/json", "authorization": token},
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
        url: `${AppConfig.server_url}/add_fake_user`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json",
        "Authorization": `fake_data_token-${data.token}`
      },
    });
  }
  /* still in the works
  async function createFakeEvent(data:any){
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake_event`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json",
        "Authorization": `fake_data_token-${data.token}`
      },
    });
  } 
  */


  async function createFakeLabel(data:any){
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake_label`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json", "Authorization": "fake_label"},
    });
  }


  async function createFakeLog(data:any){
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_fake_log`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json", "Authorization": "fake_log"},
    });
  }


export {isNewUser, createUser, isAdminUser, getAdminsList , createFakeUser, getLabels, createFakeLabel, createFakeLog}