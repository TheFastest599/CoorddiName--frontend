import React, { useContext } from 'react';
import Map from './Map';
import LocationSearch from './LocationSearch';
import InfoBox from './InfoBox';
import { HomeContext } from '../context/HomeContext';

function Home() {
  const { setStat } = useContext(HomeContext);
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
