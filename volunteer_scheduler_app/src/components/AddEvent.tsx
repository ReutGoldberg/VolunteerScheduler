import * as React from "react";
import "../App.css";
import { Button, Box, InputAdornment } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AccountCircle } from "@mui/icons-material";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { EventDatePicker } from "./EventDatePicker";

export const AddEvent: React.FC = () => {
  const [eventName, setEventName] = React.useState("");
  const [eventNameValid, setEventNameValid] = React.useState(true);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleEventNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.value.match(/^[a-z0-9]+/i)) setEventNameValid(false);
    else setEventNameValid(true);
    setEventName(event.target.value);
  };

  const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    // event.preventDefault();
    // if(adminPasswordVerificationValid){
    //     let loggedUser= getUser()
    //     if (!loggedUser) return;
    //     let token:string = window.btoa(`${loggedUser!![0]}:${loggedUser!![1]}`)
    //     console.log("token:"+ token + "loggeduser" + loggedUser);
    //     let data = new FormData();    //formdata object
    //     data.append('adminName', adminName);
    //     data.append('adminPassword', adminPassword);
    //     try {
    //         const res = await axios({
    //             method: "post",
    //             url: `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/register_admin`,
    //             data: data,
    //             headers: {  "Content-Type": "multipart/form-data", 'Authorization': `Basic ${token}` },
    //         });
    //         if(res.statusText === 'OK'){
    //             setPageApp("CurrentAdminsList")
    //         }
    //     } catch(err:any) {
    //         if (axios.isAxiosError(err)) {
    //             if(err.response){
    //                 let message: string = ""
    //                 if( err.response.status === 409){
    //                     message = "A problem occurred! probably name is taken";
    //                 }
    //                 else {
    //                     message = "error! " + err.response.status.toString() + " " + err.response.statusText;
    //                 }
    //                 alert(message)
    //             } else if(err.request){
    //                 alert("The request was made but no response was received from server")
    //             } else {
    //                 alert(err.message)
    //             }
    //         }
    //     }
    // }
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
      onSubmit={handleAddEvent}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ManageAccountsTwoToneIcon color="info" sx={{ fontSize: "1000%" }} />
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
        error={!eventNameValid}
        id="outlined-basic"
        label="Admin name"
        variant="outlined"
        onChange={handleEventNameChange}
        helperText={!eventNameValid ? "Please enter a valid name " : ""}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <EventDatePicker
          {...{
            label: "enter start date",
            value: startDate,
            setValue: setStartDate,
          }}
        />
        <EventDatePicker
          {...{ label: "enter end date", value: endDate, setValue: setEndDate }}
        />
      </Box>
      <Button type="submit" form="registerForm" variant="contained">
        Add Event
      </Button>
    </Box>
  );
};
