import React from 'react';
import CalendComponent from '../components/Calendar';

const MainPage = () => {
  return (
    <div className={'wrapper'}>
      <div className={'container__title'}>
        <h2 className={'title'}>Volunteer scheduler</h2>
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
};

export default MainPage;
