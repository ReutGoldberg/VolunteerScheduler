import jwt_decode from "jwt-decode";
import axios from 'axios';



async function isNewUser(userEmail:string, token:string){
    const requestURL:string = `http://localhost:5001/user/isNewUser/${userEmail}/${token}`;
    const response = await axios.get(requestURL);
    return !response.data
  }

  
  async function createUser(userObject:any, userToken:string){
    const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email,token:userToken, is_fake: false};
    const response = await axios({
        method: "post",
        url: `http://localhost:5001/add_user`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json"},
    });
  }

  async function createFakeUser(userObject:any, userToken:string){
    const data = {firstName: userObject.given_name,lastName: userObject.family_name ,email: userObject.email,token:userToken, is_fake: true};
    const response = await axios({
        method: "post",
        url: `http://localhost:5001/add_user`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json"},
    });
  }


async function isAdminUser(){
    console.log("todo: check if admin")
    //@ts-ignore - todo: find a better way to pass this param
    const usertoken = window.googleToken
    //todo: validate the token is legit and not hacked
    const userData:any = jwt_decode(usertoken);
    
    const requestURL:string = `http://localhost:5001/user/userEmail/${userData.email}/${usertoken}`;
    const response = await axios.get(requestURL);
    return response.data.is_admin;
}

async function getAdminsList(){
  console.log("todo: check if admin")
  //@ts-ignore - todo: find a better way to pass this param
  const usertoken = window.googleToken
  //todo: validate the token is legit and not hacked
  const userData:any = jwt_decode(usertoken);
  const requestUserDataURL:string = `http://localhost:5001/user/userEmail/${userData.email}/${usertoken}`
  
  
  const requestAdminsURL:string = `http://localhost:5001/user/adminsUserEmail/${userData.email}`;
  const response = await axios.get(requestAdminsURL);
  return response.data;
}


export {isNewUser, createUser, isAdminUser, getAdminsList , createFakeUser}