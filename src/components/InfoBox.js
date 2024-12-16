import React, { useContext, useEffect } from 'react';
import { HomeContext } from '../context/HomeContext';
import { GlobalContext } from '../context/GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';

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
            className="absolute -left-2 top-1/2 bg-green-500 rounded-lg px-1 py-2 text-white"
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={openInfoBox ? faAngleRight : faAngleLeft} />
          </button>
        )}
        <div className="h-full bg-white rounded-lg font-poppins">
          <div className="p-4">
            <div className="min-h-5">
              {stat.selectedPlace ? (
                <h1 className="text-base font-semibold ">
                  {homeState.selectedPlace
                    ? homeState.selectedPlace.name
                      ? homeState.selectedPlace.name
                      : homeState.selectedPlace.display_name
                    : 'Welcome to Coordiname'}
                </h1>
              ) : (
                <div className="h-5 bg-gray-300 rounded w-full skeleton-loader"></div>
              )}
            </div>
            <hr className="my-2" />
            {stat.selectedPlace ? (
              <p className="text-base">
                {homeState.coordiName
                  ? homeState.coordiName
                  : 'Your Coordiname'}
              </p>
            ) : (
              <div className="h-5 bg-gray-300 rounded w-full skeleton-loader"></div>
            )}
            {stat.position ? (
              <p className="text-base">
                {homeState.position
                  ? `Coordinates : lat ${homeState.position[0]} long : ${homeState.position[1]}`
                  : 'Your Coordinate'}
              </p>
            ) : (
              <div className="h-5 bg-gray-300 rounded w-full skeleton-loader"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoBox;
