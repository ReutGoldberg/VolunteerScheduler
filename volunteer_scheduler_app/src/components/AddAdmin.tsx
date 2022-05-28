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
  const [adminName, setAdminName] = React.useState("");
  const [adminNameValid, setAdminNameValid] = React.useState(true);

  const [adminPassword, setAdminPassword] = React.useState("");
  const [adminPasswordValid, setAdminPasswordValid] = React.useState(true);

  const [adminPasswordVerification, setAdminPasswordVerification] =
    React.useState("");
  const [adminPasswordVerificationValid, setAdminPasswordVerificationValid] =
    React.useState(true);

  const handleAdminNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[a-z0-9]+/i)) setAdminNameValid(false);
    else setAdminNameValid(true);
    setAdminName(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value.match(/^[$%^@*&!()]*[a-z0-9]+[$%^@*&!()]*/i))
      setAdminPasswordValid(false);
    else setAdminPasswordValid(true);
    if (adminPasswordVerification != event.target.value)
      setAdminPasswordVerificationValid(false);
    else setAdminPasswordVerificationValid(true);
    setAdminPassword(event.target.value);
  };
  const handlePasswordVerificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (adminPassword != event.target.value)
      setAdminPasswordVerificationValid(false);
    else setAdminPasswordVerificationValid(true);
    setAdminPasswordVerification(event.target.value);
  };

  const handleAddAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {name: adminName, password: adminPassword}
    const response = await axios({
        method: "post",
        url: `http://localhost:5001/add_user`,
        data: JSON.stringify(data),
        headers: {  "Content-Type": "application/json"},
    });
    if(response.statusText === 'OK')
        console.log('add admin')
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
        error={!adminNameValid}
        id="outlined-basic"
        label="Admin name"
        variant="outlined"
        onChange={handleAdminNameChange}
        helperText={!adminNameValid ? "Please enter a valid name " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        required
        error={!adminPasswordValid}
        id="outlined-basic"
        label="Password"
        variant="outlined"
        type={"password"}
        onChange={handlePasswordChange}
        helperText={!adminPasswordValid ? "Please enter a valid password " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        required
        error={!adminPasswordVerificationValid}
        id="outlined-basic"
        label="Verify Password"
        variant="outlined"
        type={"password"}
        onChange={handlePasswordVerificationChange}
        helperText={
          !adminPasswordVerificationValid ? "Passwords are different" : ""
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon />
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
