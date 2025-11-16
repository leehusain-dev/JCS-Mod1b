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

export interface warningInfo {
  warning: floodWarning;
  lat: number;
  long: number;
  radius: number;
}

const getRadius = (envelope: {
  lowerCorner: {
    x: number;
    y: number;
  };
  upperCorner: {
    x: number;
    y: number;
  };
}) => {
  const { lowerCorner, upperCorner } = envelope;
  return Math.max(
    Math.abs(lowerCorner.x - upperCorner.x),
    Math.abs(lowerCorner.y - upperCorner.y)
  );
};

const fetchData = async (): Promise<Array<areaFloodData>> => {
  const result = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/floods`
  );
  const dataset = await result.json();
  return dataset.items;
};

const fetchDetails = async (id: string): Promise<detailedData> => {
  const result = await fetch(
    `https://environment.data.gov.uk/flood-monitoring/id/floodAreas/${id}`
  );
  const data = await result.json();
  return data;
};

export const processData = async (): Promise<warningInfo[]> => {
  const areaIDs: string[] = (await fetchData()).map((area) => area.floodAreaID);
  const warnings: detailedData[] = [];
  await Promise.all(
    areaIDs.map(async (area) => {
      warnings.push(await fetchDetails(area));
    })
  );
  const strippedWarnings: warningInfo[] = [];
  warnings.map((detail) =>
    strippedWarnings.push({
      warning: detail.items.currentWarning,
      lat: detail.items.lat,
      long: detail.items.long,
      radius: getRadius(detail.items.envelope),
    })
  );
  return strippedWarnings;
};
