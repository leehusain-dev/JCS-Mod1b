import { useMemo, Fragment } from "react";
import "leaflet/dist/leaflet.css";
import type { warningInfo } from "../api/floodData";
import { Circle, MapContainer, Popup, TileLayer } from "react-leaflet";

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
              <Circle
                center={[marker.lat, marker.long]}
                pathOptions={{
                  color: warningColours[marker.warning.severityLevel - 1],
                }}
                radius={marker.radius}
              >
                <Popup>
                  <strong>Area: {marker.warning.description}</strong>
                  <br />
                  {marker.warning.message}
                </Popup>
              </Circle>
            </Fragment>
          );
        })}
      </MapContainer>
    ),
    [mapProps]
  );
  return <>{displayMap}</>;
}
