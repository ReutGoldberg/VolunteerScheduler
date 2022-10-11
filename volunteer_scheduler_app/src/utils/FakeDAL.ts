/* Fake */
import axios from 'axios';
import { AppConfig } from "../AppConfig";


export async function createFakeUser(userObject:any){
    try {
      const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email, token: userObject.token, is_admin: userObject.is_admin};
      const response = await axios({
          method: "post",
          url: `${AppConfig.server_url}add_fake/user`,
          data: JSON.stringify(data),
          headers: { "Content-Type": "application/json",
          "Authorization": `fake_data_token-${data.token}`
        },
      });
    } catch (error:any) {
      console.log("Error in createFakeUser from DAL");
      console.error(error);
      throw error;
    }

  }

export async function createFakeEvent(data:any){
try {
    const response = await axios({
    method: "post",
    url: `${AppConfig.server_url}add_fake/event`,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json",
    "Authorization": "fake_event"
    },
});
return response;
}
catch(err:any){
    console.log("Error in createFakeEvent from DAL");
    console.error(err);
    throw err;
}

}  


export async function createFakeLabel(data:any){
try {
    const response = await axios({
    method: "post",
    url: `${AppConfig.server_url}add_fake/label`,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "Authorization": "fake_label"},
});
} catch (error:any) {
    console.log("Error in createFakeLabel from DAL");
    console.error(error);
    throw error;
}

}


export  async function createFakeLog(data:any){
try {
    const response = await axios({
    method: "post",
    url: `${AppConfig.server_url}add_fake/log`,
    data: JSON.stringify(data),
    headers: { "Content-Type": "application/json", "Authorization": "fake_log"},
});
} catch (error:any) {
    console.log("Error in createFakeLog from DAL");
    console.error(error);
    throw error;
}
}

export async function createFakeEnrollToEvent(num_enrolls:number){
try {
    const response =  await axios({
    method: "post",
    url: `${AppConfig.server_url}add_fake/enroll_to_event`,
    data: {num_enrolls:num_enrolls},
    headers: { "Content-Type": "application/json",
    "Authorization": "fake_eventEnroll"}
    });
    return response;
}
catch (error:any) {
    console.log("Error in createFakeEnrollToEvent from DAL");
    console.error(error);
    throw error;
}
}