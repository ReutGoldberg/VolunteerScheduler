import React from "react";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AccountCircle, JavascriptOutlined } from "@mui/icons-material";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { AdminsList } from "./AdminsList";
import { addAdmin, getAdminsList, removeAdmin } from "../utils/DataAccessLayer";
import { UserObjectContext } from "../App";
import { isValidEmail } from "../utils/helper";
import { AppConfig } from "../AppConfig";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

export const AddAdmin: React.FC = () => {
  const [addAdminEmail, setAddAdminEmail] = React.useState("");
  const [addAdminEmailValid, setAddAdminEmailValid] = React.useState(true);

  const [removeAdminEmail, setRemoveAdminEmail] = React.useState("");
  const [removeAdminEmailValid, setRemoveAdminEmailValid] =
    React.useState(true);

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
  React.useEffect(() => {
    const userToken = userFromStorage.token;
    getAdminsList(userToken).then((data) => {
      console.log("Below are the admins"); //todo: remove when done testing
      console.log(data);
      setAdminsList(data);
    });
  }, []);

  const handleAddAdminEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddAdminEmailValid(isValidEmail(event.target.value));
    setAddAdminEmail(event.target.value);
  };

  const handleRemoveAdminEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRemoveAdminEmailValid(isValidEmail(event.target.value));
    setRemoveAdminEmail(event.target.value);
  };

  //to stop refershing the page when adding/removing admins.
  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleRemoveAdmin = async () => {
    if (!isValidEmail(removeAdminEmail)) return;
    const response = await removeAdmin(removeAdminEmail, userFromStorage.token)
      .then(() => {
        console.log("Admin removed successfully");
        return getAdminsList(userFromStorage.token);
      })
      .catch((err) => {
        console.log("Error! Didn`t remove admin");
        throw err;
      });
    console.log(`Got admins list from DB: ${response}`); // todo: remove when done testing
    setAdminsList(response);
    //@ts-ignore
    document.getElementById("adminEmailToRemoveTxt").value = ""; //clear the feild for better UX
    alert(`${removeAdminEmail} removed successfully`);
  };

  const handleAddAdmin = async () => {
    if (!isValidEmail(addAdminEmail)) return;
    const response = await addAdmin(addAdminEmail, userFromStorage.token)
      .then(() => {
        console.log("Admin added successfully");
        return getAdminsList(userFromStorage.token);
      })
      .catch((err) => {
        console.log("Error! Didn`t add admin");
        throw err;
      });
    console.log(`Got admins list from DB: ${response}`); // todo: remove when done testing
    setAdminsList(response);
    //@ts-ignore
    document.getElementById("adminEmailToAddTxt").value = ""; //clear the feild for better UX
    alert(`${addAdminEmail} added successfully`);
  };

  return (
    <Box
      className="content-container"
      component="form"
      id="registerForm"
      onSubmit={handleSubmitForm}
    >
      <Box className="row">
        <Box className="left-panel box" sx={{ alignContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <ManageAccountsTwoToneIcon
              color="primary"
              sx={{ fontSize: "1000%" }}
            />
          </Box>
          <Typography
            variant="h2"
            textAlign={"center"}
            gutterBottom
            component="div"
          >
            Configure admin
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
              error={!addAdminEmailValid}
              id="adminEmailToAddTxt"
              label="Admin's Email to add"
              variant="outlined"
              onChange={handleAddAdminEmailChange}
              helperText={
                !addAdminEmailValid ? "Please enter a valid email address " : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              form="registerForm"
              variant="contained"
              onClick={handleAddAdmin}
            >
              Add Admin
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: "5%",
              gap: 2,
            }}
          >
            {/* { Start experiement} */}
            <TextField
              error={!removeAdminEmailValid}
              id="adminEmailToRemoveTxt"
              label="Admin's Email to remove"
              variant="outlined"
              onChange={handleRemoveAdminEmailChange}
              helperText={
                !removeAdminEmailValid
                  ? "Please enter a valid email address "
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              id="removeAdminBtn"
              type="submit"
              form="registerForm"
              variant="contained"
              color="error"
              onClick={handleRemoveAdmin}
            >
              Remove Admin
            </Button>
            {/* { End experiement} */}
          </Box>
        </Box>
        <Box className="middle-panel"></Box>
        <Box className="right-panel box">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <SupervisorAccountIcon color="primary" sx={{ fontSize: "1000%" }} />
          </Box>
          <Typography
            variant="h2"
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
