import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const [position, setPosition] = useState([51.505, -0.09]);

  const [suggestions, setSuggestions] = useState([]);

  const [selectedPlace, setSelectedPlace] = useState(null);

  const fetchSuggestions = useCallback(async searchQuery => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
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
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, []);

  useEffect(() => {
    console.log('From User', selectedPlace);
  }, [selectedPlace]);

  return (
    <HomeContext.Provider
      value={{
        position,
        setPosition,
        suggestions,
        setSuggestions,
        fetchSuggestions,
        selectedPlace,
        setSelectedPlace,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
