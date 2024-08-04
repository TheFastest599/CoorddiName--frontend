import React, { useState, useContext, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '../context/GlobalContext';
import { HomeContext } from '../context/HomeContext';

const LocationSearch = () => {
  const { suggestions, setSelectedPlace, fetchSuggestions } =
    useContext(HomeContext);

  const [query, setQuery] = useState('');
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const { toggleMobileNav, navbarToggler } = useContext(GlobalContext);
  const [searchActive, setSearchActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRefs = useRef([]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = event => {
      if (searchActive) {
        if (event.key === 'ArrowDown') {
          setSelectedIndex(prevIndex =>
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
          );
        } else if (event.key === 'ArrowUp') {
          setSelectedIndex(prevIndex =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
          setSelectedPlace(suggestions[selectedIndex]);
          setQuery(suggestions[selectedIndex].display_name);
          setSearchActive(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, [searchActive, selectedIndex, suggestions]);

  // Scroll to the selected suggestion
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Handle input change
  const handleChange = e => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, 500);

    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 transition-opacity duration-300 z-5 ${
          searchActive ? ' opacity-70' : ' opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setSearchActive(false);
          setSelectedIndex(-1);
        }}
      />
      <div className="fixed top-5 left-0 lg:left-14  z-10 w-screen px-4 lg:w-112  rounded-lg ">
        <div className="flex bg-white rounded-lg pe-4">
          <div>
            <FontAwesomeIcon
              icon={faBars}
              size="lg"
              onClick={toggleMobileNav}
              ref={navbarToggler}
              className="cursor-pointer flex-none p-2 mx-2 my-1 bg-green-500 text-white lg:hidden rounded-lg"
            />
          </div>
          <input
            type="text"
            className="grow p-2 my-1 focus:outline-none w-full"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setSearchActive(true);
            }}
            placeholder="Enter a location"
          />
        </div>
        <div
          className={`bg-white rounded-lg  mt-2 max-h-80 overflow-y-auto ${
            searchActive ? 'block' : 'hidden'
          }`}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedPlace(suggestion);
                setQuery(suggestion.display_name);
                setSearchActive(false);
                setSelectedIndex(-1);
              }}
              ref={el => (suggestionRefs.current[index] = el)}
              className={`hover:bg-gray-300 px-4 py-1 border-b ${
                index === selectedIndex ? 'bg-gray-300' : ''
              }`}
            >
              {suggestion.display_name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocationSearch;
