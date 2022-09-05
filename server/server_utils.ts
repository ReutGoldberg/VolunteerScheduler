import jwt_decode from "jwt-decode";
import {getUserByToken} from "./db";




const config = require('./config')

export const isValidEmail = (email:string):boolean => {
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
  }
// todo : remove when done testing
// async function isAuthenticUser(userToken:string){
//   let res = false;
//   const ticket = await config.client_app.verifyIdToken({
//       idToken: userToken,
//       audience: config.client_app.client_id,
//   })
//   .then(() => res = true)
//   .catch(() => {
//     console.error("Error with Token auth");
//     res = false;  
//   })
//   .finally(() => res);
// }


// real version
// export async function isVerifiedUser(token:string, isNewUser = false){
//   let decResult;
//   try {
//     //@ts-ignore
//     decResult = jwt_decode(token);
//     if(isNewUser === false){
      
//       //@ts-ignore
//       const isExist = await getUserByToken(decResult.sub);
//       //@ts-ignore
//       return decResult && isValidEmail(decResult.email) && isExist;  
//     }
//     //@ts-ignore
//     return decResult && isValidEmail(decResult.email);
  
//   } catch (error:any) {
//     console.error(error.message);
//     return false;
//   }
// }


//testing version with prints:
export async function isVerifiedUser(token:string, isNewUser = false){
  let decResult;
  try {
    //@ts-ignore
    decResult = jwt_decode(token);
    if(isNewUser === false){
      
      //@ts-ignore
      const isExist = await getUserByToken(decResult.sub);
      if(!isExist){
        console.log("------- in isVerifiedUser -------");
        console.log("User doesn't exist");
      }
      //@ts-ignore
      const isValid = isValidEmail(decResult.email);
      if(!isValid){
        console.log("------- in isVerifiedUser -------");
        console.log("User email is not valid");
      }

      //@ts-ignore
      return decResult && isValid  && isExist;  
    }
    //@ts-ignore
    return decResult && isValidEmail(decResult.email);
  
  } catch (error:any) {
    console.error(error.message);
    return false;
  }
}