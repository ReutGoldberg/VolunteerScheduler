import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
      primary: {
        // light: 'rgb(255, 255, 255)',
        main: "#3e8170",
        // dark: '#b20e45',
        contrastText: "#312d2d",
      },
      text: {
        primary: "#000000",
      },
      info: {
          main: "#000000",
      },
      secondary:{
        main: 'rgb(199, 245, 224)',
      }
      // secondary: {
      //   light: '#f48fb1',
      //   main: '#312d2d',
      //   dark: '#c4b1b5',
      //   contrastText: '#000000',
      // },
    },
    typography: {
      fontSize: 15,
      body1: {
        fontWeight: "bold",
      },
      h2: {
        //"fontFamily":"sans-serif",
        fontSize: 40,
        fontWeight: "bold",
        textTransform: "capitalize",
      },
      button: {
        textTransform: "capitalize",
        fontSize: 22,
        fontWeight: "bold",
      },
    },
  });