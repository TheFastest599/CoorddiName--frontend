import React, { useContext, useState, useEffect } from 'react';
import { AbsoluteToggler } from '../component/MobileNavToggler';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LoginButton from '../login';

function SignUp() {
  // document.title = 'ParcelPro | Customer Sign Up';
  // const gcontext = useContext(globalContext);
  // const { notify, setSpinner, isCustomerLoggedIn, customerLogin, host } =
  //   gcontext;

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const [check, setCheck] = useState({
    name: false,
    email: false,
    password: false,
    cpassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  useEffect(() => {
    if (credentials.password !== credentials.cpassword) {
      setCheck(prevCheck => ({ ...prevCheck, cpassword: false }));
    }
  }, [credentials.password, credentials.cpassword]);

  const [passInfo, setPassInfo] = useState(false);

  const passRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()_+\-={};':"\\|,.<>?]{6,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // let navigate = useNavigate();
  // if (isCustomerLoggedIn) {
  //   navigate('/customer');
  // }

  const handleSubmit = async e => {
    const { name, email, password } = credentials;
    e.preventDefault();
    // setSpinner(true);
    // // console.log(name, email, password);
    // const response = await fetch(`${host}/api/auth/createcustomer`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name,
    //     email,
    //     password,
    //   }),
    // });
    // setSpinner(false);

    // const json = await response.json();
    // if (json.success) {
    //   // console.log(json);
    //   const data = {
    //     name: json.name,
    //     email: json.email,
    //     token: json.authToken,
    //   };
    //   customerLogin(data);
    //   navigate('/customer');
    // } else {
    //   if (json.error) {
    //     notify(json.error, 'error');
    //   } else {
    //     notify('Invalid credentials', 'error');
    //   }
    // }
  };

  const clientId = import.meta.env.VITE_COORDINAME_GOOGLE_AUTH_CLIENT_ID;
  useEffect(() => {
    gapi.load('auth2', () => {
      gapi.auth2.init({ client_id: clientId, scope: '' });
    });
  }, [clientId]);

  const onChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  return (
    <div className="flex justify-end items-center h-screen bg-orange-400 font-poppins">
      <AbsoluteToggler />
      <div className="w-full max-w-md  mx-2 lg:mx-4">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-5">
            <form className="mb-3" onSubmit={handleSubmit}>
              <div className="text-3xl sm:text-4xl mb-5 font-medium text-gray-800 text-center">
                Sign Up
              </div>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    check.name ? 'border-green-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  name="name"
                  id="name"
                  onChange={e => {
                    onChange(e);
                    if (e.target.value.length >= 3) {
                      setCheck({ ...check, name: true });
                    } else {
                      setCheck({ ...check, name: false });
                    }
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    check.email ? 'border-green-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  name="email"
                  id="email"
                  onChange={e => {
                    onChange(e);
                    if (emailRegex.test(e.target.value)) {
                      setCheck({ ...check, email: true });
                    } else {
                      setCheck({ ...check, email: false });
                    }
                  }}
                  placeholder="name@example.com"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      check.password ? 'border-green-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    name="password"
                    id="password"
                    onFocus={() => {
                      setPassInfo(true);
                    }}
                    onChange={e => {
                      onChange(e);
                      if (passRegex.test(e.target.value)) {
                        setCheck({ ...check, password: true });
                      } else {
                        setCheck({ ...check, password: false });
                      }
                    }}
                    placeholder="*******"
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
              </div>
              <div
                id="criteria"
                className="text-sm mx-2 my-2"
                style={
                  check.password
                    ? { display: 'none' }
                    : { display: 'block', color: 'red' }
                }
              >
                <ul>
                  {passInfo && (
                    <li id="passInfo">
                      Use a combination of at least 1 uppercase, 1 lowercase, 1
                      symbol, numbers, and a minimum length of 6.
                    </li>
                  )}
                </ul>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="cpassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative mb-3">
                  <input
                    type={showCPassword ? 'text' : 'password'}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      check.cpassword ? 'border-green-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    name="cpassword"
                    id="cpassword"
                    readOnly={check.password ? false : true}
                    onChange={e => {
                      onChange(e);
                      if (e.target.value === credentials.password) {
                        setCheck({ ...check, cpassword: true });
                      } else {
                        setCheck({ ...check, cpassword: false });
                      }
                    }}
                    placeholder="*******"
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={toggleCPasswordVisibility}
                  >
                    {showCPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="signupBtn"
                  type="submit"
                  disabled={
                    check.name &&
                    check.email &&
                    check.password &&
                    check.cpassword
                      ? false
                      : true
                  }
                >
                  Sign Up
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
                Already have an account?&nbsp; &nbsp;|&nbsp; &nbsp;
                <Link
                  to="/signin"
                  className="font-bold text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
