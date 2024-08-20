import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { libraries } from "../enums/libraries";
import { startingPoint } from "../enums/startingPoint";
import { useEffect, useRef, useState } from "react";
import { MarkerService } from "../services/markerService";
import { IMarker } from "../interfaces/IMarker";
import { createCustomMarkerIcon } from "./CustomMarker";
import { mapContainer } from "../enums/mapContainer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Loader from "./Loader";

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const markerService = new MarkerService();

export const Map = () => {
  const [markers, setMarkers] = useState<{ id: string; data: IMarker }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerClusterRef = useRef<MarkerClusterer | null>(null);
  const markerRefs = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    markerService.getAllMarkers((markersList) => {
      setMarkers(markersList);
    });
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (markerClusterRef.current) {
        markerClusterRef.current.clearMarkers();
      }

      markerRefs.current = markers.map((marker) => {
        return new google.maps.Marker({
          position: {
            lat: marker.data.location._lat,
            lng: marker.data.location._long,
          },
          icon: createCustomMarkerIcon(`${marker.data.quest}`),
          map: mapRef.current!,
          draggable: true,
        });
      });

      markerClusterRef.current = new MarkerClusterer({
        map: mapRef.current,
        markers: markerRefs.current,
      });

      markerRefs.current.forEach((markerInstance, index) => {
        markerInstance.addListener(
          "dragend",
          (event: google.maps.MapMouseEvent) => {
            handleMarkerDragEnd(markers[index].id, event);
          }
        );

        markerInstance.addListener("rightclick", () => {
          handleDeleteMarker(markers[index].id);
        });
      });
    }
  }, [markers]);

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

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setIsLoading(false);
  };

  return (
    <div className='map-item'>
      {isLoading && <Loader />}
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
          onLoad={handleMapLoad}
        ></GoogleMap>
      </LoadScript>
      {!isLoading && (
        <button onClick={handleDeleteAllMarkers}>Delete All Markers</button>
      )}
    </div>
  );
};
