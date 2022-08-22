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
import { UserObjectContext } from "../App";

interface AdminListProps {
  curAdminList: any;
}


export const AdminsList: React.FC<AdminListProps> = ({curAdminList}) => {
  console.log(`This is the prop: ${curAdminList}`);
  
  const [admins, setAdmins] = React.useState(curAdminList);

  const [isPending, setIsPending]  = React.useState(true);
  const boxRef = useRef(null);
  const listRef = useRef(null);

  const {user} = React.useContext(UserObjectContext)

  //set admin list one on initial load
  useEffect(()=>{
    const userToken = user.token;
    getAdminsList(userToken)
      .then(data => {
        console.log("Below are the admins") //todo: remove when done testing
        console.log(data);
        setAdmins(data);
        setIsPending(false);
      })
  }, []);

  //will this result in an infinite loop? - no
  useEffect(()=> {
    if(curAdminList.length > 0){
      console.log("CurAdminList is greater than 0")
      setAdmins(curAdminList)
    }},[curAdminList]);
    

  return (
    <Box id="AdminListTabId" ref={boxRef} >
      <List  id="adminsList" ref={listRef} style={{maxHeight:200, overflow:'auto'}}>
      {//isPending && <CircularProgress color="primary" size={100}/>
      }
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
    </Box>
  );
}



