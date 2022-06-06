import React, { useState } from "react";
import "../App.css";
import { Box, Typography, Skeleton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AccountCircle } from "@mui/icons-material";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

export const CurrentAdminsList: React.FC = () => {
  const [admins, setAdmins] = React.useState<string[] | null>(null);
  // const getAllAdmins = async () : Promise<{ admins: string[] } | null> => {
  //     let loggedUser= getUser()
  //     let token:string = window.btoa(`${loggedUser!![0]}:${loggedUser!![1]}`)
  //     try{
  //         const res = await axios({
  //             method: "get",
  //             url: `http://localhost:${process.env.REACT_APP_BACKEND_PORT}/get_admins`,
  //             headers: { Authorization: `Basic ${token}` },
  //             })
  //         if(res.statusText === 'OK'){
  //             return res.data;
  //         }
  //     } catch(err:any) {
  //         if (axios.isAxiosError(err)) {
  //             if(err.response){
  //                 alert("error! " + err.response.status.toString() + " " + err.response.statusText)
  //             } else if(err.request){
  //                 alert("The request was made but no response was received from server")
  //             } else {
  //                 alert(err.message)
  //             }
  //             return null;
  //         }
  //         return null;
  //     }
  //     return null;
  // }
  // React.useEffect(() : () => void  => {
  //     let mounted = true
  //     getAllAdmins()
  //         .then(res => {
  //         if(mounted) {
  //             setAdmins(res!!.admins)
  //         }
  //     }).catch(er => {})
  //     return () => mounted = false
  // }, [])
  return (
    <Box
      sx={{
        width: "30%",
        minWidth: "500px",
        height: "50%",
        display: "flex",
        flexDirection: "column",
        p: 5,
        m: 5,
        gap: 2,
      }}
    >
      <List
        component="div"
        disablePadding
        sx={{ border: 1, borderRadius: "8px", borderColor: "primary.dark" }}
      >
        {admins ? (
          admins.map((adminName, index) => (
            <ListItem
              disablePadding
              key={index}
              sx={{
                color: "primary.dark",
                display: "inline",
                fontSize: 17,
                fontWeight: "bold",
                gap: 3,
                paddingTop: 1,
                paddingBottom: 1,
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircle />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={adminName} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress color="primary" size={100} />
          </Box>
        )}
      </List>
    </Box>
  );
};
