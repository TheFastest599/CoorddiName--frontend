import React, { useState, useContext, useEffect, useRef } from 'react';
import { FaBars, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';

import { GlobalContext } from '../../context/GlobalContext';
import { HomeContext } from '../../context/HomeContext';

const LocationSearch = () => {
  const {
    homeState,
    homeDispatch,
    fetchSuggestions,
    stat,
    searchMode,
    setSearchMode,
    fetchCoordiNameSuggestions,
  } = useContext(HomeContext);

  const [query, setQuery] = useState('');

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const { toggleMobileNav, navbarToggler } = useContext(GlobalContext);

  const [searchActive, setSearchActive] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [coordiLength, setCoordiLength] = useState(1);

  const suggestionRefs = useRef([]);

  const locationSearchRef = useRef(null);

  let { suggestions } = homeState;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = event => {
      if (searchActive && suggestions.length > 0) {
        if (event.key === 'ArrowDown') {
          setSelectedIndex(prevIndex => {
            const newIndex =
              prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex;
            // console.log('Selected Index', suggestions[newIndex]);
            if (searchMode && newIndex >= 0) {
              setQuery(suggestions[newIndex]);
            }
            return newIndex;
          });
        } else if (event.key === 'ArrowUp') {
          setSelectedIndex(prevIndex => {
            const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
            // console.log('Selected Index', suggestions[newIndex]);
            if (searchMode && newIndex >= 0) {
              setQuery(suggestions[newIndex]);
            }
            return newIndex;
          });
        } else if (
          selectedIndex >= 0 &&
          event.key === 'Enter' &&
          suggestions.length > 0
        ) {
          if (!searchMode) {
            homeDispatch({
              type: 'locationSearch',
              payload: suggestions[selectedIndex],
            });
            setQuery(suggestions[selectedIndex].display_name);
            setSearchActive(false);
          } else {
            if (searchMode && coordiLength < 4) {
              setQuery(suggestions[selectedIndex]);
            }
            if (searchMode && coordiLength === 4) {
              setQuery(suggestions[selectedIndex]);
              homeDispatch({
                type: 'coordiNameSearch',
                payload: suggestions[selectedIndex],
              });
              setSearchActive(false);
              setSelectedIndex(-1);
              // console.log('Search by CoordiName', suggestions[selectedIndex]);
            }
            // console.log('Search by CoordiName', suggestions[selectedIndex]);
          }
        } else if (event.key === 'Enter' && suggestions.length > 0) {
          if (!searchMode) {
            homeDispatch({ type: 'locationSearch', payload: suggestions[0] });
            setQuery(suggestions[0].display_name);
            setSearchActive(false);
            setSelectedIndex(-1);
          } else {
            if (searchMode) {
              setQuery(suggestions[0]);
              if (coordiLength === 4) {
                // console.log('Search by CoordiName', suggestions[0]);
                homeDispatch({
                  type: 'coordiNameSearch',
                  payload: suggestions[0],
                });
              }
              setSearchActive(false);
              setSelectedIndex(-1);
            }
            // console.log('Search by CoordiName', suggestions[0]);
          }
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

  useEffect(() => {
    setSelectedIndex(-1);
  }, [coordiLength]);

  // Handle input change
  const handleChange = e => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (newQuery.length > 2 && !searchMode) {
        fetchSuggestions(newQuery);
      } else if (newQuery.length > 0 && searchMode) {
        fetchCoordiNameSuggestions(newQuery);
        setCoordiLength(newQuery.split('-').length);
        // console.log('Search by CoordiName', newQuery);
      } else {
        homeDispatch({ type: 'setSuggestions', payload: [] });
      }
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
          <FaBars
            onClick={toggleMobileNav}
            ref={navbarToggler}
            className="cursor-pointer flex-none p-2 mx-2 my-1 text-4xl bg-green-500 text-white lg:hidden rounded-lg"
          />
          <input
            type="text"
            ref={locationSearchRef}
            className="grow py-2 px-1 lg:px-4 my-1 focus:outline-none w-full font-poppins"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setSearchActive(true);
            }}
            placeholder={
              searchMode ? 'Search CoordiName...' : 'Search Location...'
            }
          />
          <FaMagnifyingGlass
            className={`cursor-pointer text-4xl flex-none p-2 mx-1 my-1 hover:bg-gray-400 rounded-lg ${
              !searchActive && query.length > 0 ? 'hidden' : 'block'
            }`}
            onClick={() => {
              locationSearchRef.current.focus();
              if (!searchMode && suggestions.length > 0) {
                homeDispatch({
                  type: 'locationSearch',
                  payload: suggestions[0],
                });
                fetchSuggestions(query);
                setQuery(suggestions[0].display_name);
                setSearchActive(false);
                setSelectedIndex(-1);
              } else if (
                searchMode &&
                suggestions.length > 0 &&
                coordiLength === 4
              ) {
                // console.log('Search by CoordiName', suggestions[0]);
                homeDispatch({
                  type: 'coordiNameSearch',
                  payload: suggestions[0],
                });
                setSearchActive(false);
                setSelectedIndex(-1);
              }
              // if (suggestions.length > 0) {
              // }
              // if (searchActive && suggestions.length === 0) {
              //   setSearchActive(false);
              //   setSelectedIndex(-1);
              // }
            }}
          />
          <FaXmark
            className={`cursor-pointer text-4xl flex-none p-2 mx-1 my-1 hover:bg-gray-400 rounded-lg ${
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
        {searchActive && query.length === 0 && (
          <div className="mt-2 relative">
            <button
              className="absolute right-5 px-4 py-1 font-poppins text-sm bg-white rounded-lg cursor-pointer"
              onClick={() => {
                setSearchMode(!searchMode);
                homeDispatch({ type: 'setSuggestions', payload: [] });
              }}
            >
              {searchMode ? 'Search by Location?' : 'Search by CoordiName?'}
            </button>
          </div>
        )}
        <div
          className={`bg-white rounded-lg  mt-2 max-h-80 overflow-y-auto ${
            searchActive ? 'block' : 'hidden'
          }`}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                if (!searchMode) {
                  homeDispatch({
                    type: 'locationSearch',
                    payload: suggestion,
                  });
                  setQuery(suggestion.display_name);
                  setSearchActive(false);
                  setSelectedIndex(-1);
                } else {
                  // homeDispatch({
                  //   type: 'coordiNameSearch',
                  //   payload: suggestion,
                  // });
                  if (coordiLength === 4) {
                    // console.log('Search by CoordiName', suggestion);
                    setQuery(suggestion);
                    setSearchActive(false);
                    setSelectedIndex(-1);
                    homeDispatch({
                      type: 'coordiNameSearch',
                      payload: suggestion,
                    });
                  } else {
                    setSelectedIndex(index);
                    setQuery(suggestion);
                  }
                }
              }}
              ref={el => (suggestionRefs.current[index] = el)}
              className={`hover:bg-gray-300 px-4 py-1 border-b font-poppins ${
                index === selectedIndex ? 'bg-gray-300' : ''
              }`}
            >
              {searchMode ? suggestion : suggestion.display_name}
            </div>
          ))}
          {stat.suggestions && suggestions.length === 0 && query.length > 0 && (
            <div className="px-4 py-1 border-b font-poppins">
              No results found
            </div>
          )}
          {!stat.suggestions &&
            suggestions.length === 0 &&
            query.length > 0 && (
              <div className="px-4 py-1 border-b skeleton-loader font-poppins">
                Searching...
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default LocationSearch;
