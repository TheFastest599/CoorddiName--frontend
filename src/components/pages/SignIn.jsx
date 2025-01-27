import React, { useContext, useEffect, useState } from 'react';
import LoginButton from '../login';
import LogoutButton from '../logout';
import { AbsoluteToggler } from '../component/MobileNavToggler';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignIn() {
  // document.title = 'ParcelPro | Customer Login';
  // const gcontext = useContext(globalContext);
  // const { notify, setSpinner, isCustomerLoggedIn, customerLogin, host } =
  //   gcontext;

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  // if (isCustomerLoggedIn) {
  //   navigate('/customer');
  // }

  const clientId = import.meta.env.VITE_COORDINAME_GOOGLE_AUTH_CLIENT_ID;
  useEffect(() => {
    gapi.load('auth2', () => {
      gapi.auth2.init({ client_id: clientId, scope: '' });
    });
  }, [clientId]);

  const handleSubmit = async e => {
    e.preventDefault();
    // const { email, password } = credentials;
    // setSpinner(true);
    // // console.log(email, password);
    // const response = await fetch(`${host}/api/auth/customerlogin`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email,
    //     password,
    //   }),
    // });
    // setSpinner(false);

    // const json = await response.json();
    // if (json.success) {
    //   const data = {
    //     name: json.name,
    //     email: json.email,
    //     token: json.authToken,
    //   };
    //   customerLogin(data);
    //   notify('Logged In Successfully', 'success');
    //   navigate('/customer');
    // } else {
    //   notify('Invalid credentials', 'error');
    // }
  };

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-end items-center h-screen bg-orange-400 font-poppins">
      <AbsoluteToggler />
      <div className="w-full max-w-md  mx-2 lg:mx-4">
        <div className="bg-white shadow-lg rounded-lg pb-5 pt-2 mt-5">
          <div className="px-5 pt-4">
            <form className="mb-3 mt-4" onSubmit={handleSubmit}>
              <div className="text-3xl sm:text-4xl mb-5 font-medium text-gray-800 text-center">
                Sign In
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={onChange}
                  placeholder="Enter here"
                />
              </div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mb-3">
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="*******"
                  value={credentials.password}
                  onChange={onChange}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </span>
              </div>
              <div className="text-right py-2">
                <p className="text-sm">
                  <Link
                    className="text-indigo-600 hover:text-indigo-500"
                    to="/customer/forgot_password"
                  >
                    Forgot password?
                  </Link>
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="loginButton"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p className="my-1">
                  <span className="text-gray-600">or</span>
                </p>
                <GoogleOAuthProvider clientId={clientId}>
                  <LoginButton clientId={clientId} />
                </GoogleOAuthProvider>
              </div>
            </form>
            <br />
            <div>
              <p className="text-center text-sm">
                Don't have an account? &nbsp;&nbsp; | &nbsp;&nbsp;
                <Link
                  to="/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-500"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
