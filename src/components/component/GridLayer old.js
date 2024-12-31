import { useEffect, useCallback, useState, useRef } from 'react';
import { useMap, Polyline } from 'react-leaflet';
import debounce from 'lodash.debounce';

// Completly made by AI with GitHub Copilot through pair programming with me. Hehehehe
const GridLayer = () => {
  const map = useMap();
  const [gridLines, setGridLines] = useState([]);
  const currentGridBoundsRef = useRef(null);

  const toDecimal = useCallback(({ degrees, minutes, seconds }) => {
    return degrees + minutes / 60 + seconds / 3600;
  }, []);

  const toDMS = useCallback(decimal => {
    const degrees = Math.floor(decimal);
    const minutesFloat = (decimal - degrees) * 60;
    const minutes = Math.floor(minutesFloat);
    const seconds = Math.round((minutesFloat - minutes) * 60);
    return { degrees, minutes, seconds };
  }, []);

  const drawGrid = useCallback(() => {
    const bounds = map.getBounds();
    if (
      currentGridBoundsRef.current &&
      currentGridBoundsRef.current.equals(bounds)
    ) {
      return; // Grid is already drawn for the current bounds
    }
    currentGridBoundsRef.current = bounds;
    const gridSize = 1; // 1 second by 1 second grid

    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    const southWestDMS = toDMS(southWest.lat);
    const northEastDMS = toDMS(northEast.lat);
    const westDMS = toDMS(southWest.lng);
    const eastDMS = toDMS(northEast.lng);

    const latStart = southWestDMS.degrees;
    const latEnd = northEastDMS.degrees;
    const lngStart = westDMS.degrees;
    const lngEnd = eastDMS.degrees;

    const totalLatLines = ((latEnd - latStart + 1) * 60 * 60) / gridSize;
    const totalLngLines = ((lngEnd - lngStart + 1) * 60 * 60) / gridSize;

    const newGridLines = [];

    for (let i = 0; i < totalLatLines; i++) {
      const latDecimal = toDecimal({
        degrees: latStart + Math.floor(i / 3600),
        minutes: Math.floor((i % 3600) / 60),
        seconds: (i % 3600) % 60,
      });

      if (latDecimal >= southWest.lat && latDecimal <= northEast.lat) {
        const latLng1 = [latDecimal, southWest.lng];
        const latLng2 = [latDecimal, northEast.lng];
        newGridLines.push([latLng1, latLng2]);
      }
    }

    for (let i = 0; i < totalLngLines; i++) {
      const lngDecimal = toDecimal({
        degrees: lngStart + Math.floor(i / 3600),
        minutes: Math.floor((i % 3600) / 60),
        seconds: (i % 3600) % 60,
      });

      if (lngDecimal >= southWest.lng && lngDecimal <= northEast.lng) {
        const latLng1 = [southWest.lat, lngDecimal];
        const latLng2 = [northEast.lat, lngDecimal];
        newGridLines.push([latLng1, latLng2]);
      }
    }

    setGridLines(newGridLines);
  }, [map, toDecimal, toDMS]);

  const removeGrid = useCallback(() => {
    setGridLines([]);
    currentGridBoundsRef.current = null;
  }, []);

  useEffect(() => {
    const handleClick = debounce(e => {
      const clickedLatLng = e.latlng;

      if (
        !currentGridBoundsRef.current ||
        !currentGridBoundsRef.current.contains(clickedLatLng)
      ) {
        drawGrid();
      } else {
        console.log('Clicked position is already within the drawn grid.');
      }
    }, 300);

    const handleZoomEnd = () => {
      if (map.getZoom() >= 14) {
        drawGrid();
      } else {
        removeGrid();
      }
    };

    if (map.getZoom() >= 14) {
      drawGrid();
    } else {
      removeGrid();
    }

    map.on('click', handleClick);
    map.on('zoomend', handleZoomEnd);
    map.on('moveend', handleZoomEnd); // Add this line to handle setView and other view changes

    return () => {
      map.off('click', handleClick);
      map.off('zoomend', handleZoomEnd);
      map.off('moveend', handleZoomEnd); // Clean up the event listener
      removeGrid();
    };
  }, [map, drawGrid, removeGrid]);

  return (
    <>
      {gridLines.map((line, index) => (
        <Polyline key={index} positions={line} color="red" weight={1} />
      ))}
    </>
  );
};

export default GridLayer;
