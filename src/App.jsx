import './App.css';
import './output.css';
import Home from './components/pages/Home';
import { gapi } from 'gapi-script';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import TryClient from './components/tryClient';
import { HomeProvider } from './context/HomeContext';
// import { HomeContext } from './context/HomeContext';
import Navbar from './components/component/Navbar';
import SignIn from './components/pages/SignIn';
import SignUp from './components/pages/SignUp';

function App() {
  const clientId = import.meta.env.VITE_COORDINAME_GOOGLE_AUTH_CLIENT_ID;
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
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
