import jwt_decode from "jwt-decode";
import axios from 'axios';


async function isNewUser(userEmail:string, token:string){
    const requestURL:string = `http://localhost:5001/user/userEmail/${userEmail}/${token}`;
    const response = await axios.get(requestURL);
    return !response.data.email 
  }

  
  async function createUser(userObject:any, userToken:string){
    const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email,token:userToken}
    const response = await axios({
        method: "post",
        url: `http://localhost:5001/add_user`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json"},
    });
  }


async function isAdminUser(){
    //@ts-ignore - todo: find a better way to pass this param
    const userEmail = window?.userObjectGoogle;
    //@ts-ignore - todo: find a better way to pass this param
    const token = window?.userTokenGoogle;

    const requestURL:string = `http://localhost:5001/user/userEmail/${userEmail}/${token}`;
    const response = await axios.get(requestURL);
    return response.data.is_admin;
}


export {isNewUser, createUser, isAdminUser}