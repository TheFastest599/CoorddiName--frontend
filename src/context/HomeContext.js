import React, {
  createContext,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import axios from 'axios';

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const HOST = process.env.REACT_APP_HOST;

  const initialHomeState = {
    position: [51.505, -0.09],
    suggestions: [],
    selectedPlace: null,
    openInfoBox: false,
    coordiName: null,
  };

  let { position } = initialHomeState;

  // Get user's current location if possible
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          homeDispatch({
            type: 'default user current location',
            payload: [latitude, longitude],
          });
        },
        error => {
          console.error('Error getting geolocation: ', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Fetch query suggestions from OpenStreetMap
  const fetchSuggestions = useCallback(async searchQuery => {
    if (searchQuery.length < 3) {
      homeDispatch({ type: 'setSuggestions', payload: [] });
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            format: 'json',
            q: searchQuery,
          },
        }
      );
      console.log(response.data);
      homeDispatch({ type: 'setSuggestions', payload: response.data });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);
  // ----------------------------------------------------------------

  // Fetch coordiname from the server------------------------------------------------
  const fetchCoordiName = useCallback(
    async position => {
      try {
        const response = await fetch(`${HOST}/client_data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latLong: {
              lat: position[0],
              lon: position[1],
            },
            getCoordiName: true,
            timezone: false,
          }),
        });

        const result = await response.json();
        console.log(result);
        homeDispatch({ type: 'setCoordiName', payload: result.coordiName });
      } catch (error) {
        console.error('Error:', error);
      }
    },
    // eslint-disable-next-line
    [position]
  ); // Dependencies
  // ----------------------------------------------------------------

  // Reverse Geocode------------------------------------------------
  const reverseGeocode = useCallback(async position => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      homeDispatch({ type: 'setSelectedPlace', payload: data });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);
  // ----------------------------------------------------------------

  const [homeState, homeDispatch] = useReducer(homeReducer, initialHomeState);

  position = homeState.position;

  // Home Reducer

  function homeReducer(homeState, action) {
    switch (action.type) {
      case 'default user current location':
        return {
          ...homeState,
          position: action.payload,
        };
      case 'setSuggestions':
        return {
          ...homeState,
          suggestions: action.payload,
        };
      case 'setCoordiName':
        return {
          ...homeState,
          coordiName: action.payload,
        };
      case 'setSelectedPlace':
        return {
          ...homeState,
          selectedPlace: action.payload,
        };
      case 'setOpenInfoBox':
        return {
          ...homeState,
          openInfoBox: action.payload,
        };
      case 'locationSearch':
        console.log('From User', action.payload);
        if (action.payload) {
          let latitude = parseFloat(action.payload.lat);
          let longitude = parseFloat(action.payload.lon);
          fetchCoordiName([latitude, longitude]);
          return {
            ...homeState,
            position: [latitude, longitude],
            selectedPlace: action.payload,
          };
        }
        return homeState;
      case 'mapClick':
        const [lat, lng] = action.payload;
        console.log('Map Clicked', lat, lng);
        fetchCoordiName([lat, lng]);
        reverseGeocode([lat, lng]);
        return {
          ...homeState,
          position: [lat, lng],
        };
      default:
        return homeState;
    }
  }
  // ----------------------------------------------------------------

  // Log homeState changes
  useEffect(() => {
    console.log('Home State:', homeState);
  }, [homeState]);
  // ----------------------------------------------------------------
  return (
    <HomeContext.Provider
      value={{
        fetchSuggestions,
        fetchCoordiName,
        reverseGeocode,
        homeState,
        homeDispatch,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
