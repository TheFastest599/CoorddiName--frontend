import React, { useContext } from 'react';
import Map from '../component/Map';
import LocationSearch from '../component/LocationSearch';
import InfoBox from '../component/InfoBox';
import { HomeContext } from '../../context/HomeContext';

function Home() {
  const { setStat } = useContext(HomeContext);
  // Front React
  return (
    <div>
      <Map />
      <LocationSearch />
      <InfoBox />
      <button
        className="fixed top-32 right-20 bg-lime-400 rounded-lg px-4 py-2 z-5 "
        onClick={() => {
          console.log('Grid button clicked');
          setStat(s => ({ ...s, grid: !s.grid }));
        }}
      >
        Grid
      </button>
    </div>
  );
}

export default Home;
