import React from "react";
import "../App.css";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle } from "@mui/icons-material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import axios from 'axios';
// import axios from "axios";
// import {getUser} from "../Utils";

// export interface AddAdminProps {
//     setPageApp(page:string) : void;
// }

export const AddAdmin: React.FC = () => {
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminEmailValid, setAdminEmailValid] = React.useState(true);


  const isValidEmail = (email:string) =>{
    return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
  }

  const handleAdminEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {   
    setAdminEmailValid(isValidEmail(event.target.value));
    setAdminEmail(event.target.value);
  };



  const handleAddAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {email: adminEmail}
    const response = await axios({
        method: "post",
        url: `http://localhost:5001/add_admin`,
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json"},
    });
    if(response.statusText === 'OK')
        console.log('Admin added successfully')
    else
      console.log('didnt add admin')
  };

  return (
    <Box
      component="form"
      sx={{
        width: "30%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="registerForm"
      onSubmit={handleAddAdmin}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ManageAccountsTwoToneIcon color="primary" sx={{ fontSize: "1000%" }} />
      </Box>
      <Typography
        variant="h2"
        color="text.primary"
        textAlign={"center"}
        gutterBottom
        component="div"
      >
        add new admin
      </Typography>
      <TextField
        required
        error={!adminEmailValid}
        id="outlined-basic"
        label="Admin's Email"
        variant="outlined"
        onChange={handleAdminEmailChange}
        helperText={!adminEmailValid ? "Please enter a valid email address " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" form="registerForm" variant="contained">
        Add Admin
      </Button>
    </Box>
  );
};
