import React from 'react';

const AuthDebug = () => {
  const authData = JSON.parse(localStorage.getItem('hrms_auth') || '{}');
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Auth Debug Info:</h4>
      <pre>{JSON.stringify(authData, null, 2)}</pre>
    </div>
  );
};

export default AuthDebug;