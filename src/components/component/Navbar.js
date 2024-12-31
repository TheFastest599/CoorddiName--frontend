import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

function Navbar() {
  const { navBar, dispatch, isNavExpanded, isMobileNavVisible } =
    useContext(GlobalContext);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 transition-opacity duration-300 z-20 ${
          (isNavExpanded
            ? 'lg:opacity-100'
            : 'lg:opacity-0 lg:pointer-events-none') +
          (isMobileNavVisible
            ? ' opacity-100'
            : ' opacity-0 pointer-events-none')
        }`}
        onClick={() => {
          dispatch({ type: 'CLICKED_OUTSIDE' });
        }}
      />
      <nav
        ref={navBar}
        className={`navbar fixed left-0 top-0 z-30 h-full bg-blue-500 transition-width duration-200 ease-in-out ${
          isNavExpanded ? 'w-48' : 'w-12'
        } ${
          isMobileNavVisible ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:block`}
        onMouseEnter={() =>
          !isMobileNavVisible &&
          dispatch({ type: 'SET_NAV_EXPANDED', payload: true })
        }
        onMouseLeave={() =>
          !isMobileNavVisible &&
          dispatch({ type: 'SET_NAV_EXPANDED', payload: false })
        }
      >
        <h1 className="w-0">Navbar</h1>
        {isMobileNavVisible && (
          <button
            onClick={() => {
              dispatch({ type: 'CLOSE_MOBILE_NAV' });
            }}
          >
            Close{' '}
          </button>
        )}
        <div className="flex">
          <div
            className={`bg-red-500 flex-1 px-4 ${
              isNavExpanded ? 'w-1/4' : 'w-full'
            }`}
          >
            Hi
          </div>
          <div
            className="bg-green-500 ps-2 flex-3 w-3/4 transition-opacity duration-200 ease-in-out"
            style={{
              opacity: isNavExpanded ? 1 : 0,
            }}
          >
            World
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
