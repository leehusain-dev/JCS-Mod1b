import { useEffect, useState } from "react";
import "./App.css";
import {
  processData,
  type detailedData,
  type warningInfo,
} from "./api/floodData";
import Map from "./Map/Map.tsx";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [floodData, setFloodData] = useState<warningInfo[]>([]);
  const [regionNames, setRegionNames] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [regionalData, setRegionalData] = useState<warningInfo[]>([]);

  useEffect(() => {
    //Initial load - fetches full flood warning dataset
    processData()
      .then(setFloodData)
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("Loading=", loading);
  }, [loading]);

  useEffect(() => {
    //Filters unique top-level area names from items
    const names = floodData.map((detail) => detail.warning.eaAreaName);
    setRegionNames([...new Set(names)].sort());
  }, [floodData]);

  useEffect(() => {
    //Filters map markers by selected area
    setRegionalData(
      selectedRegion === "All"
        ? floodData
        : floodData.filter(
            (detail) => detail.warning.eaAreaName === selectedRegion
          )
    );
  }, [selectedRegion, floodData]);

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
        <Typography variant="subtitle1">
          Fetching and processing Environment Agency dataset
        </Typography>
      </Backdrop>
      <Typography variant="h3">Flood Warnings</Typography>
      <Typography variant="subtitle1">
        Real-time data from the Environment Agency API
      </Typography>

      {!loading && (
        <>
          <FormControl fullWidth>
            <Select
              id="areaSelect"
              onChange={(e: SelectChangeEvent) =>
                setSelectedRegion(e.target.value)
              }
              defaultValue="All"
            >
              <MenuItem disabled value="">
                <em>Select Region</em>
              </MenuItem>
              <MenuItem value="All">All</MenuItem>
              {regionNames.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Map markers={regionalData} selectionState={selectedRegion} />
        </>
      )}
    </>
  );
}

export default App;
