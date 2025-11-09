# JHUB coding scheme module 1b - Live Flood Warnings project

Interactive map of current flood warnings across the UK. Data is fetched from the [Environment Agency Real Time flood-monitoring API](https://environment.data.gov.uk/flood-monitoring/doc/reference)

## How to run

1. In the project root folder, use the command `npm install` to install relevant dependepncies
2. Edit `./src/Map/mapConfig.ts` to assign the API key string in the project submission to the `MAPTILER_API_KEY` variable
3. Use the command `npm run dev` to run the build, then open the localhost port linked in the terminal output
