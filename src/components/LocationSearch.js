import React, { useState, useContext, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { GlobalContext } from '../context/GlobalContext';
import { HomeContext } from '../context/HomeContext';

const LocationSearch = () => {
  const { homeState, homeDispatch, fetchSuggestions } = useContext(HomeContext);

  const [query, setQuery] = useState('');

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const { toggleMobileNav, navbarToggler } = useContext(GlobalContext);

  const [searchActive, setSearchActive] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const suggestionRefs = useRef([]);

  const locationSearchRef = useRef(null);

  let { suggestions } = homeState;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = event => {
      if (searchActive && suggestions.length > 0) {
        if (event.key === 'ArrowDown') {
          setSelectedIndex(prevIndex =>
            prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
          );
        } else if (event.key === 'ArrowUp') {
          setSelectedIndex(prevIndex =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
        } else if (
          selectedIndex >= 0 &&
          event.key === 'Enter' &&
          suggestions.length > 0
        ) {
          homeDispatch({
            type: 'locationSearch',
            payload: suggestions[selectedIndex],
          });
          setQuery(suggestions[selectedIndex].display_name);
          setSearchActive(false);
        } else if (event.key === 'Enter' && suggestions.length > 0) {
          homeDispatch({ type: 'locationSearch', payload: suggestions[0] });
          setQuery(suggestions[0].display_name);
          setSearchActive(false);
          setSelectedIndex(-1);
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
        className={`fixed top-0 left-0 w-full h-full  bg-black bg-opacity-50 transition-opacity duration-300 z-5 ${
          searchActive ? ' opacity-70' : ' opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setSearchActive(false);
          setSelectedIndex(-1);
        }}
      />
      <div className="fixed  top-5 left-0 lg:left-14  z-10 w-screen px-2 lg:w-112  rounded-lg ">
        <div className="flex bg-white rounded-lg ">
          <FontAwesomeIcon
            icon={faBars}
            size="lg"
            onClick={toggleMobileNav}
            ref={navbarToggler}
            className="cursor-pointer flex-none p-2 mx-2 my-1 bg-green-500 text-white lg:hidden rounded-lg"
          />
          <input
            type="text"
            ref={locationSearchRef}
            className="grow py-2 px-1 lg:px-4 my-1 focus:outline-none w-full"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setSearchActive(true);
            }}
            placeholder="Enter a location"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="lg"
            className={`cursor-pointer flex-none p-2 mx-1 my-1 hover:bg-gray-400 rounded-lg ${
              !searchActive && query.length > 0 ? 'hidden' : 'block'
            }`}
            onClick={() => {
              locationSearchRef.current.focus();
              fetchSuggestions(query);
              if (suggestions.length > 0) {
                homeDispatch({
                  type: 'locationSearch',
                  payload: suggestions[0],
                });
                setQuery(suggestions[0].display_name);
                setSearchActive(false);
                setSelectedIndex(-1);
              }
              if (searchActive && suggestions.length === 0) {
                setSearchActive(false);
                setSelectedIndex(-1);
              }
            }}
          />
          <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className={`cursor-pointer flex-none p-2 mx-1 my-1 hover:bg-gray-400 rounded-lg ${
              !searchActive && query.length > 0 ? 'block' : 'hidden'
            }`}
            onClick={() => {
              locationSearchRef.current.focus();
              setQuery('');
              homeDispatch({ type: 'setSuggestions', payload: [] });
              setSelectedIndex(-1);
            }}
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
                homeDispatch({ type: 'locationSearch', payload: suggestion });
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
          {suggestions.length === 0 && query.length > 0 && (
            <div className="px-4 py-1 border-b">No results found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default LocationSearch;
