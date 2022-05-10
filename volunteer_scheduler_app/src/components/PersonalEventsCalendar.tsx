import React from 'react';
import '../App.css';
import { Button, Box } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import LogoutIcon from '@mui/icons-material/Logout';
import { Console } from 'console';
import CalendComponent from './Calendar';

export const handlePersonalEventsCalendar : React.FC = () => {
    return (
        <div className={'wrapper'}>
      <div className={'container__title'}>
        <h2 className={'title'}>Personal Events Calendar</h2>
      </div>
      <div className={'Calendar__wrapper'}>
        <CalendComponent isDark={true} />
      </div>
      <div style={{ margin: '0 auto', paddingTop: 32 }}>
        <p style={{ color: 'whitesmoke', fontSize: 15 }}>
          {/* eslint-disable-next-line no-undef */}
          Version {process.env.REACT_APP_VERSION}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        </div>
      </div>
    </div>
    );
}