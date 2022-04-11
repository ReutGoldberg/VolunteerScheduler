import React from 'react';
import '../App.css';
import { Button, Box } from "@mui/material";
import TextField from '@mui/material/TextField';
import { AccountCircle } from "@mui/icons-material";
import {InputAdornment} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


export const Login : React.FC = () => {
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        
        }

    return (
        <Box component="form" sx={{
          width: '30%',
          minWidth: '500px',
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
          p: 5,
          m: 5,
          gap: 2,
        }}
        id="loginForm"
        onSubmit={handleLogin} >
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
                     <AccountCircle color="primary" sx={{ fontSize: 130 }}  />
                </Box>

               <TextField required id="outlined-basic"
                           label="Username"
                           variant="outlined"
                           onChange={handleUsernameChange}
                            InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" >
                                <AccountCircle />
                              </InputAdornment>
                            ),
                          }}
                />
                <TextField required id="outlined-basic" label="Password" variant="outlined" type={"password"} onChange={handlePasswordChange}
                InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" >
                                <VpnKeyIcon />
                              </InputAdornment>
                            ),}}/>
                <Button sx={{
                     flexGrow: 1, display: 'flex'
                }} type="submit" form="loginForm" variant="contained" >Login</Button>

        </Box>
    );
}