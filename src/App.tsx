import React, { useEffect, useState } from "react";
import "./App.css";
import {
  fecthDetails,
  fetchData,
  type areaFloodData,
  type detailedData,
  type floodWarning,
} from "./api/floodData";
import Map from "./Map/Map.tsx";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from "@mui/material/Typography";

const mapsApiKey: string = "AIzaSyAs60wpHMVEJN32t9j7D49tEG1iS55-_Aw"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [floodData, setFloodData] = useState<Array<areaFloodData>>([]);
  const [regionNames, setRegionNames] = useState<Array<areaFloodData>>([]);
  const [areaNames, setAreaNames] = useState<Array<string>>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("no data");
  const [selectedArea, setSelectedArea] = useState<string>("no data");
  const [warningDetail, setWarningDetail] = useState<floodWarning>();
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {   //Initial load - fetches full flood warning dataset
    fetchData().then(setFloodData);
  }, []);

  useEffect(() => {
    console.log("Loading=", loading)
  }, [loading]);

  useEffect(() => {   //Filters unique top-level area names from items
    const names = floodData.map((area) => area.eaAreaName);
    setAreaNames([...new Set(names)].sort());
    setLoading(false)
  }, [floodData]);

  useEffect(() => {   //Filters options for sub-region based on selected area
    setRegionNames(
      floodData.filter((region) => region.eaAreaName === selectedArea).sort()
    );
  }, [selectedArea]);

  useEffect(() => {   //Fetches detailed flood warning info for chosen region
    if (selectedRegion !== "no data") {
      fecthDetails(selectedRegion).then((detail) =>
        setWarningDetail(detail.items.currentWarning)
      )
    }
  }, [selectedRegion]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Backdrop
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h3">Flood Warnings</Typography>
      <Typography variant="subtitle1">Real-time data from the Environment Agency API</Typography>

      {!loading && (
        <>
          <FormControl fullWidth>
            <Select id="areaSelect" onChange={(e: SelectChangeEvent) => setSelectedArea(e.target.value)} defaultValue="">
              {areaNames.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              id="regionSelect"
              onChange={(e: SelectChangeEvent) => setSelectedRegion(e.target.value)} defaultValue=""
            >
              {regionNames.map((item) => (item &&
                <MenuItem key={item.floodAreaID} value={item.floodAreaID}>
                  {item.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Map />
        </>
      )
      }
    </ThemeProvider >
  );
}

export default App;
