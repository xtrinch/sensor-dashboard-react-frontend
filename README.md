# Ark blockhain sensors browser

This repo will pull data from ARK devnet blockhain, interpret its `vendor data` field as a sensor measurement and display it on a 4-sensor dashboard. You can add as many sensors as your want to the dashboard, displaying only those you want visible with the visibility toggle.
Read more about the ARK blockchain and how to send your own sensor data to it at [Ark](https://ark.io/) pages.

## Technology stack:

- React
- MobX for state management
- Eslint for linting
- VictoryCharts for chart display

## Setup

Copy `.env.example` over to `env.local` and/or customize environment variables.
Run with `yarn start`.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

### `yarn format`

Runs `eslint` and `prettier` and writes what they could fix to filesystem.
