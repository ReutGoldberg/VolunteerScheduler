import React from "react";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle, JavascriptOutlined } from "@mui/icons-material";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { AdminsList } from "./AdminsList";
import { addAdmin, getAdminsList } from "../utils/DataAccessLayer";
import { UserObjectContext } from "../App";
import { isValidEmail } from "../utils/helper";
import { AppConfig } from "../AppConfig";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

export const AddAdmin: React.FC = () => {
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminEmailValid, setAdminEmailValid] = React.useState(true);
  const [adminsList, setAdminsList] = React.useState([]);

  // ------------------------------------------------------ Persisted Auth after page refresh for admins Section -----------------------
  //why doing like this?
  //We can only use user object by the useContext hook which is allowed within a React Functional Component
  //Using the setUser from the useState hook resutls in an endless loop so we tackle this by using a different variable with the correct value assigned
  const { user } = React.useContext(UserObjectContext); //using App's context
  let userFromStorage: any; //option to default back to sessionStorage
  if (JSON.stringify(user) === "{}") {
    const data =
      sessionStorage.getItem(`${AppConfig.sessionStorageContextKey}`) || "";
    userFromStorage = JSON.parse(data);
  } else userFromStorage = user;
  // -------------------------------------------------------------------- End of persisted auth ----------------------------------------------------

  const handleAdminEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdminEmailValid(isValidEmail(event.target.value));
    setAdminEmail(event.target.value);
  };

  const handleAddAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await addAdmin(adminEmail, userFromStorage.token)
      .then(() => {
        console.log("Admin added successfully");
        return getAdminsList(userFromStorage.token);
      })
      .catch((err) => {
        console.log("Error! Didn`t add admin");
        throw err;
      });
    console.log(response); // todo: remove when done testing
    setAdminsList(response);
  };

  React.useEffect(() => {
    console.log("we are here!!!!");
    const userToken = userFromStorage.token;
    getAdminsList(userToken).then((data) => {
      console.log("Below are the admins"); //todo: remove when done testing
      console.log(data);
      setAdminsList(data);
    });
  }, []);

  return (
    <Box
      className="content-container"
      component="form"
      sx={{
        width: "70%",
        // height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: "5%",
        gap: 2,
      }}
      id="registerForm"
      onSubmit={handleAddAdmin}
    >
      <Box className="row">
        <Box className="left-panel box" sx={{ alignContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ManageAccountsTwoToneIcon
              color="primary"
              sx={{ fontSize: "1000%" }}
            />
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "5%",
              gap: 2,
            }}
          >
            <TextField
              required
              error={!adminEmailValid}
              id="outlined-basic"
              label="Admin's Email"
              variant="outlined"
              onChange={handleAdminEmailChange}
              helperText={
                !adminEmailValid ? "Please enter a valid email address " : ""
              }
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
        </Box>
        <Box className="middle-panel"></Box>
        <Box className="right-panel box">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SupervisorAccountIcon color="primary" sx={{ fontSize: "1000%" }} />
          </Box>
          <Typography
            variant="h2"
            color="text.primary"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Admins List
          </Typography>
          <AdminsList curAdminList={adminsList} />
        </Box>
      </Box>
    </Box>
  );
};
