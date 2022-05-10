import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './components/Login';
import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css'; // import styles
import MainPage from './pages/main';
import { Navbar } from './components/Navbar';
import {createTheme} from "@mui/material/styles";
import { Box, ThemeProvider } from "@mui/material";
import { AddAdmin } from './components/AddAdmin';


const lightTheme = createTheme({
  palette: {
    primary: {
      // light: 'rgb(173, 226, 202)',
      main: '#000000',
      // dark: '#b20e45',
      contrastText: '#312d2d',
    },
    // secondary: {
    //   light: '#f48fb1',
    //   main: '#312d2d',
    //   dark: '#c4b1b5',
    //   contrastText: '#000000',
    // },
  },
  typography: {
    "fontSize": 15,
     body1: {
     fontWeight: 'bold',
   },
      h2:{
        //"fontFamily":"sans-serif",
        "fontSize": 40,
        fontWeight: 'bold',
        "textTransform": "capitalize",
    },
   button: {
    "textTransform": "capitalize",
     "fontSize": 22,
      fontWeight: 'bold',
    },
  },

});

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <div className={'root'}>
        <Navbar />
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* <AddAdmin /> */}
          <Login />
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
