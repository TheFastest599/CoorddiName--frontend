import React, {
  createContext,
  useReducer,
  useRef,
  useEffect,
  useState,
} from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const initialState = {
    isNavExpanded: false,
    isMobileNavVisible: false,
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'TOGGLE_MOBILE_NAV':
        return {
          ...state,
          isMobileNavVisible: !state.isMobileNavVisible,
          isNavExpanded: true,
        };
      case 'SET_NAV_EXPANDED':
        return {
          ...state,
          isNavExpanded: action.payload,
        };
      case 'CLOSE_MOBILE_NAV':
        return {
          ...state,
          isMobileNavVisible: false,
        };
      case 'CLICKED_OUTSIDE':
        return {
          ...state,
          isMobileNavVisible: false,
          isNavExpanded: true,
        };
      default:
        return state;
    }
  }

  const navBar = useRef(null);
  const navbarToggler = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isNavExpanded, isMobileNavVisible } = state;

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (
  //       isMobileNavVisible &&
  //       !navBar.current.contains(event.target) &&
  //       event.target !== navbarToggler.current
  //     ) {
  //       console.log('clicked outside');
  //       dispatch({ type: 'CLICKED_OUTSIDE' });
  //     }
  //   }

  //   document.addEventListener('click', handleClickOutside);

  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [isMobileNavVisible]);

  const toggleMobileNav = () => {
    dispatch({ type: 'TOGGLE_MOBILE_NAV' });
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        navBar,
        navbarToggler,
        state,
        dispatch,
        isNavExpanded,
        isMobileNavVisible,
        toggleMobileNav,
        isMobile,
        setIsMobile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
