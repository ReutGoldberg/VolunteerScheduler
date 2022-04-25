import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './components/Login';
import Kalend, { CalendarView } from 'kalend' // import component
import 'kalend/dist/styles/index.css'; // import styles
import MainPage from './pages/main';


function App() {
  return (
    <MainPage />
  );
}

export default App;
