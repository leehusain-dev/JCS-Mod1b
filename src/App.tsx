import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  fecthDetails,
  fetchData,
  type areaFloodData,
  type detailedData,
  type floodWarning,
} from "./api";

function App() {
  const [floodData, setFloodData] = useState<Array<areaFloodData>>([]);
  const [regionNames, setRegionNames] = useState<Array<areaFloodData>>([]);
  const [areaNames, setAreaNames] = useState<Array<string>>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("no data");
  const [selectedArea, setSelectedArea] = useState<string>("no data");
  const [warningDetail, setWarningDetail] = useState<floodWarning>();

  useEffect(() => {
    fetchData().then(setFloodData);
  }, []);

  useEffect(() => {
    const names = floodData.map((region) => region.eaAreaName);
    setAreaNames([...new Set(names)]);
  }, [floodData]);

  useEffect(() => {
    setRegionNames(
      floodData.filter((item) => item.eaAreaName === selectedArea)
    );
  }, [selectedArea]);

  useEffect(() => {
    if (selectedRegion !== "no data") {
      fecthDetails(selectedRegion).then((detail) =>
        setWarningDetail(detail.items.currentWarning)
      );
    }
  }, [selectedRegion]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <select id="areaSelect" onChange={(e) => setSelectedArea(e.target.value)}>
        {areaNames.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        id="regionSelect"
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        {regionNames.map((item) => (
          <option key={item.floodAreaID} value={item.floodAreaID}>
            {item.description}
          </option>
        ))}
      </select>
    </>
  );
}

export default App;
