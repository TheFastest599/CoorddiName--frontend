import React, { useState } from 'react';
const sign = require('jwt-encode');

function TryClient() {
  // Step 1: Initialize state
  const JWT_SECRET =
    '855f0d5ec88dd69930fdbaf986eab3e5d29124091162009afbdc53365ce061df4';
  const [textAreaValue, setTextAreaValue] = useState('');

  // Step 2: Create an onChange handler
  const handleTextAreaChange = event => {
    setTextAreaValue(event.target.value);
  };
  const stuff = {
    latLong: {
      lat: 26.177979069330007,
      lon: 91.76085595487656,
    },
    coordiName: 'melon-communicate-macchiato-registration',
    getCoordiName: true,
    getLatLong: true,
  };

  const handleSubmit = async event => {
    event.preventDefault(); // Prevent the default form submit behavior
    console.log('Button clicked');
    console.log(textAreaValue);
    const jwt = sign(stuff, JWT_SECRET, { expiresIn: '30s' });
    console.log(jwt);
    const res = await fetch(`http://127.0.0.1:8000/api/client_data_secured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: jwt }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
    } else {
      res.json().then(errorResponse => {
        // Log or handle the 'detail' field from the error response
        console.error('Error detail:', errorResponse.detail);
      });
    }
    // Add your submit logic here
  };
  return (
    <div>
      <h3>TryClient</h3>
      <textarea
        name="entryArea"
        id="entryArea"
        rows={20}
        cols={50}
        value={textAreaValue}
        onChange={handleTextAreaChange}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default TryClient;
