import jwt_decode from "jwt-decode";
import axios from 'axios';
import { AppConfig } from "../AppConfig";
import { enrollement_details, filtersToMax, fullEventDetails } from "./helper";
import qs from "qs";


//todo: change this to a class - DAL and have a private field of token.
 async function isNewUser(token:string){
  try {
    const requestURL:string = `${AppConfig.server_url}/users/isNewUser/`;
    //@ts-ignore 
      const response = await axios({
        method: "get",
        url: requestURL,
        headers: { "Content-Type": "application/json",
                   "authorization": token
                  },
    });
    return !response.data
  } catch (error:any) {
    console.log("Error in isNewUser from DAL");
    console.error(error.message);
    throw error;
  }
}

 async function createUser(userToken:string){
    try {
      const userObject = jwt_decode(userToken); 
    //@ts-ignore
      const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email};
      const response = await axios({
          method: "post",
          url: `${AppConfig.server_url}/users/add_user`,
          data: JSON.stringify(data),
          headers: { "Content-Type": "application/json",
                     "Authorization": userToken
                    },
      });
    } catch (error:any) {
      console.log("Error in createUser from DAL");
      console.error(error.message);
      throw error;

    }

}

//make this a private function for the class DAL
 async function isAdminUser(userToken:string){
    try {
      if(userToken == null || userToken === "") return false;

      const requestURL:string = `${AppConfig.server_url}/users/userEmail/`;
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
      console.log("Error in isAdminUser from DAL");
      console.error(error.message);
      throw error;
    }
}

async function getLabels(userToken:string){
  console.log("getLabels");
  try {
    const requestURL:string = `${AppConfig.server_url}/labels/all_labels`;
    const response = await axios({
      method: "get",
      url: requestURL,
      headers: { "Content-Type": "application/json",
                 "Authorization": userToken
                },
      });
    return response.data;
  } catch (error:any) {
    console.log("Error in getLabels from DAL");
    console.error(error.message);
    throw error;
  }

}

async function getAdminsList(usertoken:string){
  try {
    const isAdmin = await axios({
          method: "get",
          url: `${AppConfig.server_url}/users/userEmail/`,
          headers: { "Content-Type": "application/json",
                      "authorization": usertoken
                  },
    }).then((res) => res.data.is_admin)

    if(!isAdmin){
    const errMsg = "Must be an admin for this operation";
    throw new Error(errMsg);
    }

    const response2 =  await axios({
          method: "get",
          url: `${AppConfig.server_url}/users/adminsUserEmail/`,
          headers: { "Content-Type": "application/json",
                      "authorization": usertoken
                  },
        });
    return response2.data;
  } catch (error:any) {
    console.log("Error in getAdminsList from DAL");
    console.error(error.message);
    throw error;
  }
}

export async function addAdmin(email:string, usertoken:string) {
  try {
    return await axios({
      method: "put",
      url: `${AppConfig.server_url}/users/add_admin`,
      data: {email:email, isAdminFlag:true},
      headers: { "Content-Type": "application/json; charset=utf-8",
      "authorization": usertoken }, 
    });
  } catch (error:any) {
    console.log("Error in addAdmin from DAL");
    console.error(error.message);
    throw error;
  }
}

export async function addLabel(label:string, usertoken:string) {
  console.log("addLabel");
  try {
    return await axios({
      method: "post",
      url: `${AppConfig.server_url}/labels/add_label`,
      data: {labelName: label},
      headers: { "Content-Type": "application/json; charset=utf-8",
      "authorization": usertoken }, 
    });
  } catch (error:any) {
    console.log("Error in addLabel from DAL");
    console.error(error.message);
    throw error;
  }
}

export async function removeAdmin(email:string, usertoken:string) {
  try {
    return await axios({
      method: "put",
      url: `${AppConfig.server_url}/users/remove_admin`,
      data: {email:email, isAdminFlag:false},
      headers: { "Content-Type": "application/json; charset=utf-8",
      "authorization": usertoken }, 
    });
  } catch (error:any) {
    console.log("Error in removeAdmin from DAL");
    console.error(error.message);
    throw error;
  }
}

export async function addEnrollReq(event_id:number, token:string){
  try{
    console.log("addEnrollReq");
    console.log(event_id)
    const response =  await axios({
        method: "post",
        url: `${AppConfig.server_url}/events/enroll_to_event`,
        data: {event_id:event_id},
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.log("Error in addEnrollReq from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function unEnrollReq(event_id:number, token:string){
  try{
    console.log("addEnrollReq");
    console.log(event_id)
    const response =  await axios({
        method: "post",
        url: `${AppConfig.server_url}/events/unenroll_to_event`,
        data: {event_id:event_id},
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.log("Error in unEnrollReq from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function editEventReq(event_details:fullEventDetails, token:string){
  try{
  const response =  await axios({
      method: "post",
      url: `${AppConfig.server_url}/events/edit_event`,
      data: JSON.stringify(event_details),
      headers: { "Content-Type": "application/json",
                  "authorization": token
               },
    });
  return response;
  }
  catch(err:any){
    console.log("Error in editEventReq from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function addEventReq(event_details:fullEventDetails, token:string){
  try{
    const response =  await axios({
        method: "post",
        url: `${AppConfig.server_url}/events/add_event`,
        data: JSON.stringify(event_details),
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.log("Error in addEventReq from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function deleteEventReq(event_id:number, token:string){
  try{
    const response =  await axios({
        method: "delete",
        url: `${AppConfig.server_url}/events/delete_event/${event_id}`,
        headers: { "Content-Type": "application/json",
                    "authorization": token },
      });
    return response;
  }
  catch(err:any){
    console.log("Error in deleteEventReq from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function getEventDetails(event_id:number, token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/events/event_details/${event_id}`,
      headers: { "Content-Type": "application/json", "authorization": token },
    });
    return response;
  }
  catch(err:any){
    console.log("Error in getEventDetails from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function getAllEvents(token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/events/all_events`,
      headers: {  "Content-Type": "application/json", "authorization": token},
    });
    return response;
  }
  catch(err:any){
    console.log("Error in getAllEvents from DAL");
    console.error(err.message);
    throw err;
  }
}

export async function getFilterdEvents(token:string, filters:filtersToMax, isMax:boolean, showOnlyAvailableEvents:boolean){
  try{
    const labelsIds = filters.labels.map(l => l.id);
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/events/filterd_events`,
      params: {
          labelsId: labelsIds,
          startDate: filters.startDate,
          endDate: filters.endDate,
          dateForStartTime: filters.dateForStartTime,
          dateForEndTime: filters.dateForEndTime,
          isMax: isMax,
          showOnlyAvailableEvents: showOnlyAvailableEvents,
        },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
      ,
      headers: {  "Content-Type": "application/json", "authorization": token},
    });
    return response;
  }
  catch(err:any){
    console.error(err);
    throw err;
  }
}

export async function getPersonalEvents(token:string){
  try{
    const response = await axios({
      method: "get",
      url: `${AppConfig.server_url}/events/personal_events`,
      headers: {  "Content-Type": "application/json", "authorization": token},
    });
    return response;
  }
  catch(err:any){
    console.log("Error in getPersonalEvents from DAL");
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
      headers: { "Content-Type": "application/json", "authorization": token },
    });
    return response;
  }
  catch(err:any){
    console.log("Error in getIsUserEnrolled from DAL");
    console.error(err);
    throw err;
  }
}

export {isNewUser, createUser, isAdminUser, getAdminsList,getLabels}