import React, { useEffect, useContext } from 'react';
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { HomeContext } from '../../context/HomeContext';

function Map() {
  const { position, setPosition } = useContext(HomeContext);
  const GoToCoordinates = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, map.getZoom());
      }
    }, [position, map]);

    return null;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        setPosition([lat, lng]);
      },
    });
    return null;
  };

  // const handleButtonClick = () => {
  //   const lat = prompt('Enter latitude:');
  //   const lng = prompt('Enter longitude:');
  //   if (lat && lng) {
  //     const newPosition = [parseFloat(lat), parseFloat(lng)];
  //     setPosition(newPosition);
  //   }
  // };

  return (
    <div>
      <MapContainer
        style={{ height: '100vh', width: '100vw', zIndex: 0 }}
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        {/* Normal View */}
        <TileLayer
          style={{ zIndex: -1 }}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Satellite View  Stadia.AlidadeSatellite*/}
        {/* <TileLayer
          attribution='&copy; CNES, Distribution Airbus DS, &copy; Airbus DS, &copy; PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
          maxZoom={20}
        /> */}

        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <MapClickHandler />
        <GoToCoordinates position={position} />
      </MapContainer>
      {/* <button onClick={handleButtonClick}>Go to Location</button> */}
    </div>
  );
}

export default Map;
