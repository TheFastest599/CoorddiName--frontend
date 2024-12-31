import './App.css';
import './output.css';
// import LoginButton from './components/login';
// import LogoutButton from './components/logout';
// import LocationSearch from './components/LocationSearch';
import Home from './components/pages/Home';
import { gapi } from 'gapi-script';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import TryClient from './components/tryClient';
import { HomeProvider } from './context/HomeContext';
// import { HomeContext } from './context/HomeContext';
import Navbar from './components/component/Navbar';

function App() {
  const clientId = process.env.REACT_APP_COORDINAME_GOOGLE_AUTH_CLIENT_ID;
  useEffect(() => {
    gapi.load('auth2', () => {
      gapi.auth2.init({ client_id: clientId, scope: '' });
    });
  }, [clientId]);
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <HomeProvider>
                <Home />
              </HomeProvider>
            }
          />
        </Routes>
      </Router>
      {/* <GoogleOAuthProvider clientId={clientId}>
        <LoginButton />
        <LogoutButton />
      </GoogleOAuthProvider>
      <h1>Location Search with Nominatim Autofill</h1>
      <LocationSearch />
      <TryClient></TryClient> */}
    </>
  );
}

export default App;
