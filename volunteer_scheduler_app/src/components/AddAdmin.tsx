import React from "react";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle } from "@mui/icons-material";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { AdminsList } from "./AdminsList";
import { addAdmin, getAdminsList } from "../utils/DataAccessLayer";
import { UserObjectContext } from "../App";
import { isValidEmail } from "../utils/helper";



export const AddAdmin: React.FC = () => {
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminEmailValid, setAdminEmailValid] = React.useState(true);
  const [adminsList, setAdminsList] = React.useState([]);
  
  const {user} = React.useContext(UserObjectContext) //using App's context
  


  const handleAdminEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {   
    setAdminEmailValid(isValidEmail(event.target.value));
    setAdminEmail(event.target.value);
  };



  const handleAddAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await addAdmin(adminEmail, user.token).then(()=>{
      console.log("Admin added successfully");
      return getAdminsList(user.token);      
    }).catch((err) => {
      console.log('Error! Didn`t add admin');
      throw err;
     });    
     console.log(response); // todo: remove when done testing
     setAdminsList(response);
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
      <Typography
        variant="h4"
        color="text.primary"
        textAlign={"center"}
        gutterBottom
        component="div"
        margin={"10%"}
      >
        Admins List
      </Typography>
      <AdminsList curAdminList={adminsList}/>
    </Box>
  );
};
