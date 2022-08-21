import React, { useEffect, useRef } from "react";
import List from "@mui/material/List";
import {getAdminsList} from "../utils/DataAccessLayer";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { AccountCircle } from "@mui/icons-material";
import Box from "@mui/material/Box";
//import Button from "@mui/material/Button";



export const AdminsList: React.FC = () => {

  const [admins, setAdmins] = React.useState(null);
  const [items, setItems] = React.useState(null);
  const [isPending, setIsPending]  = React.useState(true);
  const boxRef = useRef(null);
  const listRef = useRef(null);

  //set admin list one on initial load
  useEffect(()=>{
    //@ts-ignore
    const userToken = window.googleToken;
    getAdminsList(userToken)
      .then(data => {
        console.log("Below are the admins")
        console.log(data);
        setAdmins(data);
        setIsPending(false);
      })
  }, []);

  //Is this gonna go to endless loop? - yes
  //Think how to refresh automatically the list 
  // OR
  //maybe it's not neccassry as admins switch between adding the admin (in one tab)
  //and viewing all the admins in another tab which triggers a re-render.
  // useEffect(()=>{
  //   setIsPending(true);
  //   getAdminsList()
  //   .then(data => {
  //     console.log("Below are the admins v.[admins]")
  //     console.log(data);
  //     setAdmins(data);
  //     setIsPending(false);
  //   })
  //   console.log(`These are the admins: ${admins}`);
  // }, [items]);

  return (
    <Box id="AdminListTabId" ref={boxRef} >
      <List  id="adminsList" ref={listRef} style={{maxHeight:200, overflow:'auto'}}>
      {isPending && <CircularProgress color="primary" size={100}/>}
      {admins && (
        //@ts-ignore
          admins.map((adminUser, index) => (
                    <ListItem disablePadding key={index}
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
                          <Avatar variant="rounded">
                            <AccountCircle/>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={adminUser.email} />
                      </ListItemButton>
                    </ListItem>
          )))
      }
      </List>
      
      {/* todo: Not very Reacty - but can add a refresh button 
       <Button color="primary" variant="contained" onClick={() => 
        {
          ReactDOM.createRoot(document.getElementById("AdminListTabId")?.render(listRef.current))
        }}>
        Refresh List
     </Button> */}
    </Box>
  );
}



