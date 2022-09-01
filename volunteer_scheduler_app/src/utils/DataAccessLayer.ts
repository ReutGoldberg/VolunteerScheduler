import jwt_decode from "jwt-decode";
import axios from 'axios';
import { AppConfig } from "../AppConfig";
import { fullEventDetails } from "./helper";


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

  async function createFakeUser(userObject:any, userToken:string){
    const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email,token:userToken, is_fake: true};
    const response = await axios({
        method: "post",
        url: `${AppConfig.server_url}/add_user`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json",
        "Authorization": userToken
      },
    });
  }

//make this a private function for the class DAL
 async function isAdminUser(usertoken:string){
    console.log("todo: check if admin")
    //@ts-ignore - todo: find a better way to pass this param
    //const usertoken = window.googleToken

    // const data = sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
    // let userFromStorage = JSON.parse(data);
    // const usertoken = userFromStorage.token;
    
    try {
      const userData:any = jwt_decode(usertoken);
    
      const requestURL:string = `${AppConfig.server_url}/user/userEmail/`;
      const response = await axios({
        method: "get",
        url: requestURL,
        headers: { "Content-Type": "application/json",
                   "authorization": usertoken
                  },
        });
      return response.data;
    } catch (error:any) {
      console.error(error);
      throw error;
    }
}

async function getLabels(userToken:string){
  console.log("getLabels check if admin")
  if (await !isAdminUser(userToken)){
    return;
  }
  /*
  const data = sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
  let userFromStorage = JSON.parse(data);
  const usertoken = userFromStorage.token;
  */


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

export async function deleteEventReq(id:number, token:string){
  try{
    const response =  await axios({
        method: "delete",
        url: `${AppConfig.server_url}/delete_event`,
        data: JSON.stringify(id),
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

export {isNewUser, createUser, isAdminUser, getAdminsList , createFakeUser, getLabels}