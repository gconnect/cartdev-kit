# React Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

CartDevkit support React boilerplate template with TailwindCSS and ChakraUI. This is a starter kit with no additional boilerplate code. It's a perfect starter kit to get your project started on Cartesi.

When working on the frontend, here are the required steps:

* Navigate into the frontend project directory
* Install all required dependencies using either `npm i` or `yarn install`

### Environment Variables <a href="#environment-variable" id="environment-variable"></a>

Once you generate the frontend template, ensure to create a `.env` file and provide your project Id as it's an important requirement when working with Rainbowkit and wagmi.

Your `.env` file should look like this 👇&#x20;

&#x20;If you are not working on localhost, replace the values here to match with your deployed urls and the correct RPC url obtained from any of the node service providers of your choice.  You can obtain your WALLET\_CONNECT\_PROJECT\_ID from [here](https://cloud.walletconnect.com/app).

```

VITE_WALLET_CONNECT_PROJECT_ID = 61aeba5659fdc68cec3a40d7359401de
VITE_DAPP_ADDRESS = 0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e
VITE_BASE_URL = http://127.0.0.1:8383
VITE_GRAPHQL_BASE_URL = http://localhost:8080/graphql
VITE_INSPECT_BASE_URL = http://localhost:8080/inspect
VITE_RPC_URL = http://localhost:8545

```

* Start up the local server using the below command.

```
npm run dev 
```

## Note

If you deployed to testnet or mainnet. You can set your RPC in the `utils/providers.ts` file inside the transport in the Rainbowkit `getDefaultConfig` object. You might want to consider adding the API key to your `.env` file.

## Architecture

* /src/pages includes the example components (specifically Greetings.tsx and Wallet.tsx)
* /src/cartesi includes Cartesi specific contract interaction code that you can easily call/import from anywhere in your component
* /src/components includes example components as well as header and footer
* /public includes static files

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
