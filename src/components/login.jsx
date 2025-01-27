import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Login(clientId) {
  // Capitalized component name
  const onSuccess = async response => {
    console.log(response);
    const res = await fetch(`http://127.0.0.1:8000/auth/google_signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: response,
      }),
    });
    console.log(res);
    if (res.ok) {
      // Assuming the server responds with JSON data
      const data = await res.json(); // Parse the JSON in the response
      console.log('Data from server:', data);
      // To log all headers
      for (let [key, value] of res.headers.entries()) {
        console.log(`${key}: ${value}`);
      }
      // Perform actions based on the data received from the server
    }
    if (!res.ok) {
      // Parse the response body as JSON to access the error detail
      res.json().then(errorResponse => {
        // Log or handle the 'detail' field from the error response
        console.error('Error detail:', errorResponse.detail);
      });
    }
    // console.log('Login Success: currentUser:', response);
    // console.log(typeof response);

    // const decoded = jwtDecode(response.credential);
    // console.log('decoded:', decoded);

    // {
    //     "iss": "https://accounts.google.com",
    //     "azp": "410704154149-r3dr8ovkdaahbfajni6v7spsr8u52geg.apps.googleusercontent.com",
    //     "aud": "410704154149-r3dr8ovkdaahbfajni6v7spsr8u52geg.apps.googleusercontent.com",
    //     "sub": "103290065955822876347",
    //     "email": "ribhusaha2003@gmail.com",
    //     "email_verified": true,
    //     "nbf": 1720987175,
    //     "name": "THEFASTEST 599",
    //     "picture": "https://lh3.googleusercontent.com/a/ACg8ocJaiUhUgCLeFtsCLOMLkc-_NEZBv0pSJJRPn6fk8p4PN4AUzMNC=s96-c",
    //     "given_name": "THEFASTEST",
    //     "family_name": "599",
    //     "iat": 1720987475,
    //     "exp": 1720991075,
    //     "jti": "0662bf4a17ef6bfee2b26de041f8f15020463ef3"
    // }
    // Decoded example
  };
  const onFailure = response => {
    console.log('Login Failed: response:', response);
  };
  return (
    <div id="signInButton" className="w-72">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess} // Corrected reference
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login; // Capitalized export to match component name
