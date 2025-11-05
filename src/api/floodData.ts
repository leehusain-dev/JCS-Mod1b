export interface areaFloodData {
  "@id": string;
  description: string;
  eaAreaName: string;
  eaRegionName: string;
  floodArea: {
    "@id": string;
    county: string;
    notation: string;
    polygon: string;
    riverOrSea: string;
  };
  floodAreaID: string;
  isTidal: true;
  message: string;
  severity: string;
  severityLevel: number;
  timeMessageChanged: Date;
  timeRaised: Date;
  timeSeverityChanged: Date;
}

export interface floodWarning {
  "@id": string;
  description: string;
  eaAreaName: string;
  eaRegionName: string;
  floodArea: string;
  floodAreaID: string;
  isTidal: boolean;
  message: string;
  severity: string;
  severityLevel: number;
  timeMessageChanged: Date;
  timeRaised: Date;
  timeSeverityChanged: Date;
  type: string;
}

export interface detailedData {
  "@context": string;
  meta: {
    publisher: string;
    licence: string;
    documentation: string;
    version: string;
    comment: string;
    hasFormat: [string, string, string];
  };
  items: {
    "@id": string;
    county: string;
    currentWarning: floodWarning;
    description: string;
    eaAreaName: string;
    envelope: {
      lowerCorner: {
        x: number;
        y: number;
      };
      upperCorner: {
        x: number;
        y: number;
      };
    };
    fwdCode: string;
    label: string;
    lat: number;
    long: number;
    notation: string;
    polygon: string;
    quickDialNumber: string;
    riverOrSea: string;
    type: string[];
  };
}

export const fetchData = async (): Promise<Array<areaFloodData>> => {
  const result = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/floods`
  );
  const dataset = await result.json();
  return dataset.items;
};

export const fecthDetails = async (id: string): Promise<detailedData> => {
  const result = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${id}`
  );
  const data = await result.json();
  return data;
};
