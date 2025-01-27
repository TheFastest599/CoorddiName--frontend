import React, { useContext } from 'react';
import { RiMenu2Fill } from 'react-icons/ri';
import { GlobalContext } from '../../context/GlobalContext';

function AbsoluteToggler() {
  const { isMobile, toggleMobileNav } = useContext(GlobalContext);
  return (
    <>
      {isMobile && (
        <div className="absolute flex justify-center items-center top-0 left-0 mx-1 my-1 h-10 w-20 bg-blue-500 rounded-2xl">
          <RiMenu2Fill
            className="text-xl cursor-pointer"
            onClick={toggleMobileNav}
          />
        </div>
      )}
    </>
  );
}

function Toggler() {
  const { isMobile, toggleMobileNav } = useContext(GlobalContext);
  return (
    <>
      {isMobile && (
        <div className=" flex justify-center items-center  mx-1 my-1 h-10 w-20 bg-blue-500 rounded-2xl">
          <RiMenu2Fill
            className="text-xl cursor-pointer"
            onClick={toggleMobileNav}
          />
        </div>
      )}
    </>
  );
}

export { AbsoluteToggler, Toggler };
