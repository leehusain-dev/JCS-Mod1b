export const fetchDatasets = async (): Promise<Array<string>> => {
  const result = await fetch(`https://api.beta.ons.gov.uk/v1/datasets`);
  const datasets = await result.json();
  const ids = datasets.items.map((dataset: { id: any }) => dataset.id);
  return ids;
};
