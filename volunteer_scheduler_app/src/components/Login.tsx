import React from "react";
import "../App.css";
import { Button, Box } from "@mui/material";
import jwt_decode from "jwt-decode";
import axios from 'axios';

export interface NavbarProps {
  setPageApp(page: string): void;
  setUserAuth(user: any): void;
}

export const Login: React.FC<NavbarProps> = ({ setPageApp, setUserAuth }) => {
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_CONTENT = `${CLIENT_ID}.apps.googleusercontent.com`;
  const clientId: string =
    "83163129776-q90s185nilupint4nb1bp0gsi0fb61vs.apps.googleusercontent.com"; //todo: put in Config/ .env file

  //  working version w/o token validation
  // async function isNewUser(userEmail:string){
  //   const requestURL:string = `http://localhost:5001/user/userEmail/${userEmail}`;
  //   const response = await axios.get(requestURL);
  //   return !response.data 
  // }

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
  
  
  async function handleCallbackResponse(response: any) {
    console.log("Encoded JWT ID Token" + response.credential); //todo: remove when done testing
    let userObject:any = jwt_decode(response.credential); 
    const isNewUserResult = await isNewUser(userObject?.email, response.credential);
    if(isNewUserResult){
      createUser(userObject,response.credential);
    }
    document.getElementById("signInDiv")!.hidden = true;
    setUserAuth(userObject);
    setPageApp("GeneralEventsCalendar");
  }

  React.useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCallbackResponse,
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("signInDiv")!,
      // @ts-ignore
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: "100px",
      }
    );
    google.accounts.id.prompt();
  }, []);

  /* End google login part*/
  function onSignIn(googleUser: any) {
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  return (
    <Box
      sx={{
        width: "30%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        id="signInDiv"
      ></Box>
    </Box>
  );
};
