import React, { useContext, useEffect } from 'react';
import { HomeContext } from '../../context/HomeContext';
import { GlobalContext } from '../../context/GlobalContext';
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDown,
  FaAngleUp,
  FaShare,
} from 'react-icons/fa6';
import { useSwipeable } from 'react-swipeable';

import WeatherCard from './WeatherCard';
import DateTimeCard from './DateTimeCard';
import CommentsCard from './CommentsCard';

function InfoBox() {
  const { homeState, homeDispatch, stat } = useContext(HomeContext);
  const { isMobile } = useContext(GlobalContext);

  let { openInfoBox } = homeState;

  const handleClick = () => {
    homeDispatch({ type: 'setOpenInfoBox', payload: !openInfoBox });
  };

  useEffect(() => {
    if (isMobile) {
      homeDispatch({ type: 'setOpenInfoBox', payload: false });
    } else {
      homeDispatch({ type: 'setOpenInfoBox', payload: true });
    }
    // eslint-disable-next-line
  }, [isMobile]);

  const config = {
    delta: 10, // minimum distance(px) before a swipe is detected
    preventDefaultTouchmoveEvent: true, // prevent default touchmove event
    trackTouch: true, // track touch input
    trackMouse: false, // track mouse input
  };

  const handleHorizontalBar = useSwipeable({
    onSwiped: eventData => {
      if (eventData.dir === 'Up') {
        homeDispatch({ type: 'setOpenInfoBox', payload: true });
      } else if (eventData.dir === 'Down') {
        homeDispatch({ type: 'setOpenInfoBox', payload: false });
      }
    },
    onTap: () => {
      homeDispatch({ type: 'setOpenInfoBox', payload: !openInfoBox });
    },
    ...config,
  });
  return (
    <>
      {/* isMobile && openInfoBox ? 'translate-y-0' : 'translate-y-4/5' */}
      {isMobile && openInfoBox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => {
            homeDispatch({ type: 'setOpenInfoBox', payload: false });
          }}
        ></div>
      )}
      <div
        className={`fixed z-10 transition-all duration-300  lg:translate-y-0 bottom-0 lg:top-1/4 lg:right-2 w-screen  lg:w-96 h-4/5  lg:h-128 bg-green-500 rounded-lg ${
          isMobile && openInfoBox ? 'translate-y-0' : 'translate-y-4/5'
        } ${
          !isMobile && !openInfoBox ? ' translate-x-full' : 'translate-x-0'
        } `}
      >
        {isMobile && (
          <div className="relative">
            <div
              className="absolute inset-0 -m-4"
              {...handleHorizontalBar}
              onClick={() => {
                if (!('ontouchstart' in window)) {
                  // Check if the browser does not support touch
                  console.log('clicked');
                  homeDispatch({
                    type: 'setOpenInfoBox',
                    payload: !openInfoBox,
                  });
                }
              }}
            ></div>
            <div className="flex justify-center items-center py-2 px-4">
              <svg width="80" height="3" className="text-white">
                <rect width="80" height="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        )}
        {!isMobile && (
          <button
            className="absolute -left-3 top-1/2 bg-green-500 rounded-lg px-1 py-2 text-white"
            onClick={handleClick}
          >
            {openInfoBox ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
        )}
        <div className="h-full block bg-slate-200 rounded-lg font-poppins">
          <div className="p-2">
            <div className="px-2 pt-2 m-1 bg-white rounded-lg shadow-md">
              <div className="min-h-5 ">
                {stat.selectedPlace ? (
                  <h1 className="text-base font-semibold ">
                    <span
                      className={
                        isMobile && !openInfoBox ? 'block w-full truncate' : ''
                      }
                    >
                      {homeState.selectedPlace
                        ? homeState.selectedPlace.name
                          ? homeState.selectedPlace.name
                          : homeState.selectedPlace.display_name
                        : 'Welcome to Coordiname'}
                    </span>
                  </h1>
                ) : (
                  <div className="h-5 bg-gray-300 rounded w-full skeleton-loader"></div>
                )}
              </div>
              <hr className="my-1" />
              <div className="text-base  mt-6 relative rounded-b-lg rounded-e-lg">
                <p className="absolute -top-5 -left-0 text-sm font-semibold rounded-t-lg px-1">
                  Coordiname:
                </p>
                {stat.selectedPlace ? (
                  <p className="px-1 ">
                    {homeState.coordiName
                      ? homeState.coordiName
                      : 'Your Coordiname'}
                  </p>
                ) : (
                  <div className="h-5 rounded-lg w-full skeleton-loader"></div>
                )}
              </div>

              <div className="text-base  mt-6 relative rounded-b-lg rounded-e-lg">
                <p className="absolute -top-5 -left-0 text-sm font-semibold rounded-t-lg px-1">
                  Coordinate:
                </p>
                {stat.position ? (
                  <div className="flex space-x-10 px-3 py-1">
                    <span className="bg-blue-200 text-blue-800 font-semibold px-4 rounded-full">
                      lat {homeState.position[0].toFixed(3)}
                    </span>
                    <span className="bg-green-200 text-green-800 font-semibold px-4  rounded-full">
                      long {homeState.position[1].toFixed(3)}
                    </span>
                  </div>
                ) : (
                  <div className="h-5  rounded-lg w-full skeleton-loader"></div>
                )}
              </div>
              <hr className="mt-2" />
              <button className=" w-full ">
                <FaAngleDown className=" w-full " />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 p-2 m-1 mt-2 bg-white rounded-lg shadow-md">
              <button className="col-span-2 bg-sky-300 rounded-md">
                Weather
              </button>
              <button className="col-span-2 bg-sky-300 rounded-md">
                DateTime
              </button>
              <button className="row-span-2 bg-sky-300 rounded-md">
                <FaShare className="w-full" />
              </button>
              <button className="col-span-4 bg-sky-300 rounded-md">
                Comments
              </button>
            </div>
            {/* <div className="flex justify-around space-x-5 p-2 m-1">
              <button className="w-full bg-green-500 rounded-lg">
                Weather
              </button>
              <button className="w-full bg-green-500 rounded-lg">
                DateTime
              </button>
              <button className="w-full bg-green-500 rounded-lg">
                Comments
              </button>
            </div> */}

            <div className="flex flex-col space-y-2 p-2 m-1">
              <WeatherCard />
              <DateTimeCard />
              <CommentsCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoBox;
