import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";
import configData from "./mapConfig";
import Box from "@mui/material/Box";
import type { warningInfo } from "../api/floodData";
import { Popup } from "maplibre-gl";

interface MapProps {
  markers: Array<warningInfo>;
}

export default function Map(data: MapProps) {
  const warningColours: string[] = [
    "rgba(255, 0, 0, 1)", //severity 1
    "rgba(255, 120, 0, 1)", //severity 2
    "rgba(255, 255, 0, 1)", //severity 3
    "rgba(0, 255, 0, 1)", //severity 4
  ];
  const mapContainer = useRef(null);
  const map: React.RefObject<null> = useRef(null);
  const center = { lng: -2.5, lat: 54.5 };
  const [zoom] = useState(5.5);
  maptilersdk.config.apiKey = configData.MAPTILER_API_KEY;

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    data.markers.forEach((marker) => {
      new maptilersdk.Marker({
        color: warningColours[marker.warning.severityLevel - 1],
      })
        .setLngLat([marker.long, marker.lat])
        .addTo(map.current)
        .setPopup(
          new Popup({ offset: 25 }).setText(
            `Region:\n${marker.warning.description} \n\nMessage:\n${marker.warning.message}`
          )
        );
    });
  }, [center.lng, center.lat, zoom]);

  return (
    <Box sx={{ display: "flex" }}>
      <div className="container">
        <div ref={mapContainer} id="map" className="map" />
      </div>
    </Box>
  );
}
