import React, { useContext, useEffect } from 'react';
import { HomeContext } from '../context/HomeContext';
import { GlobalContext } from '../context/GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';

function InfoBox() {
  const { homeState, homeDispatch } = useContext(HomeContext);
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
      {isMobile && openInfoBox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => {
            homeDispatch({ type: 'setOpenInfoBox', payload: false });
          }}
        ></div>
      )}
      <div
        className={`fixed z-10 transition duration-300  lg:translate-y-0 bottom-0 lg:top-1/4 lg:right-2 w-screen  lg:w-96 h-128 bg-green-500 rounded-lg ${
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
            <h1 className="text-base font-semibold">
              Bengal College of Engineering and Technology, Shahid Sukumar
              Banerjee Sarani, Durgapur, Faridpur Durgapur, Paschim Bardhaman,
              West Bengal, 713212, India
            </h1>
            <hr className="my-2" />
            <p className="text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              nec purus nec ligula luctus tincidunt. Nullam vel felis
              pellentesque, fermentum sapien nec, tincidunt odio. Nulla
              facilisi. Nullam nec purus nec ligula luctus tincidunt. Nullam vel
              felis pellentesque, fermentum sapien nec, tincidunt odio. Nulla
              facilisi.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoBox;
