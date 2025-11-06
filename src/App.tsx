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

const mapsApiKey: string = "AIzaSyAs60wpHMVEJN32t9j7D49tEG1iS55-_Aw";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [floodData, setFloodData] = useState<warningInfo[]>([]);
  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [areaDescs, setAreaDescs] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("no data");
  const [selectedDesc, setSelectedDesc] = useState<string>("no data");
  const [warningDetail, setWarningDetail] = useState<warningInfo>();

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
    setAreaNames([...new Set(names)].sort());
  }, [floodData]);

  useEffect(() => {
    //Filters options for sub-region based on selected area
    const descs = floodData
      .filter((detail) => detail.warning.eaAreaName === selectedArea)
      .map((area) => area.warning.description);
    setAreaDescs([...new Set(descs)].sort());
  }, [selectedArea]);

  useEffect(() => {
    //Fetches detailed flood warning info for chosen region
    if (selectedDesc !== "no data") {
      setWarningDetail(
        floodData.find((detail) => detail.warning.description === selectedDesc)
      );
    }
  }, [selectedDesc]);

  useEffect(() => {
    //Fetches detailed flood warning info for chosen region
    console.log(warningDetail?.warning.message);
  }, [warningDetail]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
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
                setSelectedArea(e.target.value)
              }
              defaultValue=""
            >
              <MenuItem disabled value="">
                <em>Select Area</em>
              </MenuItem>
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
              onChange={(e: SelectChangeEvent) =>
                setSelectedDesc(e.target.value)
              }
              defaultValue=""
            >
              <MenuItem disabled value="">
                <em>Select region</em>
              </MenuItem>
              {areaDescs.map(
                (item) =>
                  item && (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  )
              )}
            </Select>
          </FormControl>

          <Map />
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
