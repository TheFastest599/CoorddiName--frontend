import React from 'react';
import Map from './Map';
import LocationSearch from './LocationSearch';
import InfoBox from './InfoBox';

function Home() {
  return (
    <div>
      <Map />
      <LocationSearch />
      <InfoBox />
    </div>
  );
}

export default Home;
