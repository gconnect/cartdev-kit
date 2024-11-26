# Nextjs Template

The Nextjs template is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

CartDevkit support Nextjs boilerplate template with TailwindCSS and ChakraUI. This is a starter kit with no additional boilerplate code. It's a perfect starter kit to get your project started on Cartesi.

When working on the frontend, here are the required steps:

* Navigate into the frontend project directory
* Install all required dependencies using either `npm i` or `yarn install`

### Environment Variables <a href="#environment-variable" id="environment-variable"></a>

Once you generate the frontend template, ensure to create a `.env` file and provide your project ID as it's an important requirement when working with Rainbowkit and Wagmi.

Your `.env` file should look like this 👇&#x20;

&#x20;If you are not working on localhost, replace the values here to match with your deployed urls and the correct RPC url obtained from any of the node service providers of your choice.  You can obtain your WALLET\_CONNECT\_PROJECT\_ID from [here](https://cloud.walletconnect.com/app).

```

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = 61aeba5659fdc68cec3a40d7359401de
NEXT_PUBLIC_DAPP_ADDRESS = 0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e
NEXT_PUBLIC_BASE_URL = http://127.0.0.1:8383
NEXT_PUBLIC_GRAPHQL_BASE_URL = http://localhost:8080/graphql
NEXT_PUBLIC_INSPECT_BASE_URL = http://localhost:8080/inspect
NEXT_PUBLIC_RPC_URL = http://localhost:8545

```

* Start up the local server using the below command.

```
npm run dev 
```

## Note

If you deployed to testnet or mainnet. You can set your RPC in the `utils/providers.ts` file inside the transport in the Rainbowkit `getDefaultConfig` object. You might want to consider adding the API key to your `.env` file.

## Architecture

* /app/components/examples includes the example components used in the template
* /app/components/ includes other components like header, footer and customButton
* /app/wallet is an example wallet page
* /app/cartesi includes Cartesi specific contract interaction code that you can easily call/import from anywhere in your component. These functions are specially arranged in Portals.ts file
* /app includes other components, utils and helper functions
* /public includes static files

### Learn More

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template\&filter=next.js\&utm_source=create-next-app\&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
