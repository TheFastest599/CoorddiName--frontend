import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { LuDot } from 'react-icons/lu';
import { GoDotFill } from 'react-icons/go';

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
        className={` my-1 h-nav-height fixed left-0 top-0 z-30 font-poppins rounded-2xl bg-blue-500 transition-all duration-200 ease-in-out ${
          isNavExpanded ? 'w-48' : 'w-12'
        } ${
          isMobileNavVisible ? 'translate-x-0 mx-1' : '-translate-x-full '
        } lg:translate-x-0 lg:block lg:mx-1`}
        onMouseEnter={() =>
          !isMobileNavVisible &&
          dispatch({ type: 'SET_NAV_EXPANDED', payload: true })
        }
        onMouseLeave={() =>
          !isMobileNavVisible &&
          dispatch({ type: 'SET_NAV_EXPANDED', payload: false })
        }
      >
        {isMobileNavVisible && (
          <button
            onClick={() => {
              dispatch({ type: 'CLOSE_MOBILE_NAV' });
            }}
          >
            Close{' '}
          </button>
        )}
        <NavLink to="/" isNavExpanded={isNavExpanded} icon="🏠" text="Home" />
        <NavLink
          to="/signin"
          isNavExpanded={isNavExpanded}
          icon="🔑"
          text="Sign In"
        />
        <NavLink
          to="/signup"
          isNavExpanded={isNavExpanded}
          hideCompletely={false}
          icon="📝"
          text="Sign Up"
        />
        <NavDropDown
          isNavExpanded={isNavExpanded}
          icon="🏠"
          text="Home"
          hideCompletely={false}
          dropdownItems={[
            { to: '/profile', text: 'Profile' },
            { to: '/settings', text: 'Settings' },
            { to: '/profile', text: 'Profile' },
            { to: '/settings', text: 'Settings' },
            { to: '/profile', text: 'Profile' },
            { to: '/settings', text: 'Settings' },
          ]}
        />
        <NavLink
          to="/signup"
          isNavExpanded={isNavExpanded}
          icon="📝"
          text="Sign Up"
        />
      </nav>
    </>
  );
}

export default Navbar;

// max-h-36 overflow-y-auto  scrollbar-custom

const NavLink = ({ to, isNavExpanded, icon, text, hideCompletely }) => {
  return (
    <Link
      to={to}
      className={`flex items-center mx-1 my-1 h-10 rounded-md hover:bg-gray-200 transition-all duration-200 ${
        !hideCompletely || isNavExpanded ? '' : 'hidden'
      }`}
    >
      <div className="flex items-center justify-center text-xl  w-12">
        {icon}
      </div>
      <div
        className={` truncate   ${isNavExpanded ? '' : 'w-0 h-0 opacity-0'}`}
        style={{ overflow: 'hidden' }}
      >
        {text}
      </div>
    </Link>
  );
};

const NavDropDown = ({
  isNavExpanded,
  icon,
  text,
  dropdownItems,
  hideCompletely,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div
        className={`flex relative items-center mx-1 my-1 h-10 rounded-md hover:bg-gray-200 transition-all duration-200 cursor-pointer ${
          !hideCompletely || isNavExpanded ? '' : 'hidden'
        }`}
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-center text-xl w-12">
          {icon}
        </div>
        <div
          className={` truncate   ${isNavExpanded ? '' : 'w-0 h-0 opacity-0'}`}
          style={{ overflow: 'hidden' }}
        >
          {text}
        </div>
        <div
          className={`absolute  right-0 top-0 h-full flex items-center justify-center me-4 ${
            isNavExpanded ? '' : 'hidden'
          }`}
        >
          {isDropdownOpen ? (
            <FaAngleUp className="text-xs" />
          ) : (
            <FaAngleDown className="text-xs" />
          )}
        </div>
      </div>
      <div
        className={` w-full  ${
          isDropdownOpen && isNavExpanded ? '' : 'hidden'
        }`}
      >
        {dropdownItems.map((item, index) => (
          <Link
            to={item.to}
            index={index}
            key={index}
            className="mx-1 my-1 ps-8 h-10 py-2 rounded-md hover:bg-gray-200 flex items-center"
          >
            <GoDotFill className="mr-2" />
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
};
