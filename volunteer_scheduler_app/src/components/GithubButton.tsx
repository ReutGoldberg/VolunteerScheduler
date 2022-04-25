import React from 'react';

const GithubButton = () => {
  return (
    <a href={'/full'} rel="noreferrer">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          background: 'black',
          cursor: 'pointer',
          borderRadius: 12,
        }}
      >
        <p
          style={{
            color: 'whitesmoke',
            fontSize: 16,
            marginRight: 4,
            fontWeight: 500,
          }}
        >
          Full screen
        </p>
      </div>
    </a>
  );
};

export default GithubButton;
