import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { libraries } from "../enums/libraries";
import { startingPoint } from "../enums/starting_point";
import { useEffect, useState } from "react";
import { MarkerService } from "../services/markerService";
import { IMarker } from "../interfaces/IMarker";
import { createCustomMarkerIcon } from "./CustomMarker";
import { mapContainer } from "../enums/mapContainer";

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const markerService = new MarkerService();

export const Map = () => {
  const [markers, setMarkers] = useState<{ id: string; data: IMarker }[]>([]);

  useEffect(() => {
    markerService.getAllMarkers((markersList) => {
      setMarkers(markersList);
    });
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker: IMarker = {
        quest: markers.length + 1,
        location: {
          _lat: event.latLng.lat(),
          _long: event.latLng.lng(),
        },
        next: "",
        timestamp: new Date(),
      };

      markerService.createMarker(newMarker);
    }
  };

  const handleDeleteMarker = (markerId: string) => {
    markerService.deleteMarker(markerId);
    setMarkers((prevMarkers) => prevMarkers.filter((m) => m.id !== markerId));
  };

  const handleMarkerDragEnd = (
    markerId: string,
    event: google.maps.MapMouseEvent
  ) => {
    if (event.latLng) {
      const newLocation = {
        _lat: event.latLng.lat(),
        _long: event.latLng.lng(),
      };
      markerService.updateMarkerLocation(markerId, newLocation);
    }
  };

  const handleDeleteAllMarkers = () => {
    markerService.deleteAllMarkers();
    setMarkers([]);
  };

  return (
    <div className='map-item'>
      <LoadScript
        googleMapsApiKey={googleMapsKey}
        libraries={libraries}
        id='google-map-script'
        version='weekly'
      >
        <GoogleMap
          mapContainerStyle={mapContainer}
          center={startingPoint}
          zoom={10}
          onClick={handleMapClick}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={{
                lat: marker.data.location._lat,
                lng: marker.data.location._long,
              }}
              draggable={true}
              onDragEnd={(event) => handleMarkerDragEnd(marker.id, event)}
              onRightClick={() => handleDeleteMarker(marker.id)}
              icon={createCustomMarkerIcon(`${marker.data.quest}`)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <button onClick={handleDeleteAllMarkers}>Delete All Markers</button>
    </div>
  );
};
