import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  type FC,
  Fragment,
} from "react";
import "leaflet/dist/leaflet.css";
import Box from "@mui/material/Box";
import type { warningInfo } from "../api/floodData";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface MapPropsType {
  markers: Array<warningInfo>;
  selectionState: string;
}

export default function Map(mapProps: MapPropsType) {
  const warningColours: string[] = [
    "rgba(255, 0, 0, 1)", //severity 1
    "rgba(255, 120, 0, 1)", //severity 2
    "rgba(255, 255, 0, 1)", //severity 3
    "rgba(0, 255, 0, 1)", //severity 4
  ];
  const displayMap = useMemo(
    () => (
      <MapContainer
        center={[53, 0]}
        zoom={7}
        scrollWheelZoom={true}
        style={{
          height: parent.innerHeight * 0.7,
          width: parent.innerWidth * 0.9,
          position: "relative",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapProps.markers.map((marker, index) => {
          return (
            <Fragment key={index}>
              <Marker position={[marker.lat, marker.long]}>
                <Popup>{marker.warning.message}</Popup>
              </Marker>
            </Fragment>
          );
        })}
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    ),
    [mapProps]
  );
  return <>{displayMap}</>;
}
