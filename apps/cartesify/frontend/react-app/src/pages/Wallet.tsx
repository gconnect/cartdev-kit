import { FC, useState } from "react"
import { Input, Box, InputGroup, InputLeftAddon, Stack, SimpleGrid} from "@chakra-ui/react"
import { Balance } from "../cartesi/Balance";
import Transfers from "../cartesi/Transfers";
import { DAPP_ADDRESS } from "../utils/constants";

const WalletExamples: FC = () => {
  const [dappAddress, setDappAddress] = useState<string>(DAPP_ADDRESS);

  return (
      <SimpleGrid columns={1} marginTop={'48px'} marginLeft={'25%'} marginRight={'25%'}>  
          <Stack>
              <Box alignItems='baseline' marginLeft='2' mt='0'>
                  
              <InputGroup size='xs'>
              <InputLeftAddon>
                  Dapp Address
              </InputLeftAddon> 
              <Input 
                  textColor="slategrey"
                  borderColor="#09324C"
                  width='auto'
                  size='xs'
                  className="address-textbox"
                  type="text"
                  value={dappAddress}
                  onChange={(e) => setDappAddress(e.target.value)}
              />
              </ InputGroup >
              <br /><br />
              </Box>
          </Stack>
              <br />
                  <Balance />
                  <br /> <br />
                  <Transfers />
                  <br /> <br />
      </SimpleGrid>
  );
};

export default WalletExamples;