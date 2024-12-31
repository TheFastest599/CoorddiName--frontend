import React, {
  createContext,
  useCallback,
  useReducer,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const HOST = import.meta.env.VITE_HOST;

  const initialHomeState = {
    position: [28.6273928, 77.1716954],
    suggestions: [],
    selectedPlace: null,
    openInfoBox: false,
    coordiName: null,
    grid: false,
  };

  const [stat, setStat] = useState({
    suggestions: true,
    selectedPlace: true,
    selectedCoordiName: true,
    coordiName: true,
    position: true,
  });

  const [searchMode, setSearchMode] = useState(false); // false for location search, true for coordiName search

  let { position } = initialHomeState;

  // Get user's current location if possible
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       position => {
  //         const { latitude, longitude } = position.coords;
  //         homeDispatch({
  //           type: 'default user current location',
  //           payload: [latitude, longitude],
  //         });
  //         homeDispatch({ type: 'setLocation', payload: [latitude, longitude] });
  //       },
  //       error => {
  //         console.error('Error getting geolocation: ', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // }, []);

  // Fetch query suggestions from OpenStreetMap
  const fetchSuggestions = useCallback(async searchQuery => {
    setStat(s => ({ ...s, suggestions: false }));
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
      setStat(s => ({ ...s, suggestions: true }));
    } catch (error) {
      setStat(s => ({ ...s, suggestions: true }));
      console.error('Error fetching suggestions:', error);
    }
  }, []);
  // ----------------------------------------------------------------

  const fetchCoordiNameSuggestions = useCallback(async searchQuery => {
    setStat(s => ({ ...s, suggestions: false }));
    try {
      const response = await fetch(`${HOST}/client_data/searchcoordiname`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordiNameq: searchQuery,
        }),
      });

      const result = await response.json();
      console.log('coordiName suggestions', result);
      homeDispatch({ type: 'setSuggestions', payload: result });
      setStat(s => ({ ...s, suggestions: true }));
    } catch (error) {
      setStat(s => ({ ...s, suggestions: true }));
      console.error('Error fetching coordiName suggestions:', error);
    }
    // eslint-disable-next-line
  }, []);

  // Fetch latitude and longitude from the server------------------------------------------------

  const fetchLatLongfromServer = useCallback(async coordiName => {
    setStat(s => ({ ...s, position: false }));
    try {
      const response = await fetch(`${HOST}/client_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordiName: coordiName,
          getLatLong: true,
          timezone: false,
        }),
      });

      const result = await response.json();
      console.log(result);
      const [lat, lon] = [
        result.latLong.decimal.lattitude,
        result.latLong.decimal.longitude,
      ];
      homeDispatch({ type: 'coordiNameLocation', payload: [lat, lon] });
      // reverseGeocode([lat, lon]);
      setStat(s => ({ ...s, position: true }));
    } catch (error) {
      setStat(s => ({ ...s, position: true }));
      console.error('Error:', error);
    }
    // eslint-disable-next-line
  }, []);

  // Fetch coordiname from the server------------------------------------------------
  const fetchCoordiName = useCallback(
    async position => {
      setStat(s => ({ ...s, coordiName: false }));
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
        setStat(s => ({ ...s, coordiName: true }));
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
    setStat(s => ({ ...s, selectedPlace: false }));
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
      setStat(s => ({ ...s, selectedPlace: true }));
    } catch (error) {
      setStat(s => ({ ...s, selectedPlace: true }));
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
      case 'setPosition':
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
      case 'coordiNameSearch':
        console.log('From User', action.payload);
        if (action.payload) {
          fetchLatLongfromServer(action.payload);
          return {
            ...homeState,
            coordiName: action.payload,
          };
        }
        return homeState;
      case 'locationSearch':
        console.log('From User', action.payload);
        if (action.payload) {
          let latitude = parseFloat(action.payload.lat);
          let longitude = parseFloat(action.payload.lon);
          fetchCoordiName([latitude, longitude]);
          localStorage.setItem(
            'position',
            JSON.stringify([latitude, longitude])
          );
          return {
            ...homeState,
            position: [latitude, longitude],
            selectedPlace: action.payload,
          };
        }
        return homeState;
      case 'setLocation':
        const [lat, lng] = action.payload;
        Promise.all([fetchCoordiName([lat, lng]), reverseGeocode([lat, lng])]);
        localStorage.setItem('position', JSON.stringify([lat, lng]));
        return {
          ...homeState,
          position: [lat, lng],
        };
      case 'coordiNameLocation':
        const [lattitude, longitude] = action.payload;
        reverseGeocode([lattitude, longitude]);
        localStorage.setItem(
          'position',
          JSON.stringify([lattitude, longitude])
        );
        return {
          ...homeState,
          position: [lattitude, longitude],
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

  // Set user's location from localStorage if available
  useEffect(() => {
    // eslint-disable-next-line
    position = JSON.parse(localStorage.getItem('position'));
    if (position) {
      homeDispatch({ type: 'setLocation', payload: position });
    } else {
      homeDispatch({ type: 'setLocation', payload: initialHomeState.position });
    }
  }, []);
  // ----------------------------------------------------------------
  return (
    <HomeContext.Provider
      value={{
        fetchSuggestions,
        fetchCoordiName,
        reverseGeocode,
        homeState,
        homeDispatch,
        stat,
        setStat,
        searchMode,
        setSearchMode,
        fetchCoordiNameSuggestions,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
