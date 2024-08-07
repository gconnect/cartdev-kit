import { useMemo } from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './utils/providers';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import { GRAPHQL_BASE_URL } from "./utils/constants";
import {
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from 'urql';
import PageRoutes from "./PageRoutes"

export default function Layout() {

  const apolloClient = new ApolloClient({
    uri: GRAPHQL_BASE_URL,
    cache: new InMemoryCache(),
  })

  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    });
    const client = createClient({
      url: GRAPHQL_BASE_URL,
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
    });

    return [client, ssr];
  }, []);



  return (
      <div className={` bg-bcolor`}>
        <ChakraProvider theme= {theme}>
        {/* <UrqlProvider client={client} ssr={ssr}> */}
        <ApolloProvider client={apolloClient}>
          <Providers>
          <Header/>
          <PageRoutes/>
          <Footer/>
        </Providers>
        </ApolloProvider>
        {/* </UrqlProvider> */}
        <Toaster />
      </ChakraProvider> 
      </div> 
  );
}
