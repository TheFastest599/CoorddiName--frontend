import React from 'react';

function Logout() {
  const onSuccess = () => {
    console.log('Logout Success');
    // Here you would typically clear the session storage or cookies that hold authentication tokens
    // For example, if using sessionStorage:
    // sessionStorage.removeItem('token');
  };

  return (
    <div id="signOutButton">
      <button onClick={onSuccess}>Logout</button>
    </div>
  );
}

export default Logout;
