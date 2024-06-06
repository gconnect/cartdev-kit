import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { Chain, toHex } from "viem";
import { useEthersSigner } from "../../utils/useEtherSigner";
import {
    CartesiDApp,
    CartesiDApp__factory,
    InputBox,
    InputBox__factory,
    EtherPortal,
    EtherPortal__factory,
    ERC20Portal,
    ERC20Portal__factory,
    ERC721Portal,
    ERC721Portal__factory,
    DAppAddressRelay,
    DAppAddressRelay__factory,
    ERC1155SinglePortal,
    ERC1155SinglePortal__factory,
    ERC1155BatchPortal,
    ERC1155BatchPortal__factory
} from "../generated/rollups";
import configFile from "../config.json";
const config: any = configFile;


export interface RollupsContracts {
    dappContract: CartesiDApp;
    signer: any;
    relayContract: DAppAddressRelay;
    inputContract: InputBox;
    etherPortalContract: EtherPortal;
    erc20PortalContract: ERC20Portal;
    erc721PortalContract: ERC721Portal;
    erc1155SinglePortalContract: ERC1155SinglePortal;
    erc1155BatchPortalContract: ERC1155BatchPortal;
}

export const useRollups = (dAddress: string): RollupsContracts | undefined => {
    const [contracts, setContracts] = useState<RollupsContracts | undefined>();
    const [dappAddress] = useState<string>(dAddress);
    const { address, chain } = useAccount();
    const signer = useEthersSigner();

    useEffect(() => {
        const connect = async (
            chain: Chain
            ): Promise<RollupsContracts> => {
            let dappRelayAddress = "";
            if(config[toHex(chain.id)].DAppRelayAddress) {
                dappRelayAddress = config[toHex(chain.id)].DAppRelayAddress;
            } else {
                console.error(`No dapp relay address address defined for chain ${toHex(chain.id)} ${chain.id}`);
            }

            let inputBoxAddress = "";
            if(config[toHex(chain.id)]?.InputBoxAddress) {
                inputBoxAddress = config[toHex(chain.id)].InputBoxAddress;
            } else {
                console.error(`No input box address address defined for chain ${toHex(chain.id)}`);
            }

            let etherPortalAddress = "";
            if(config[toHex(chain.id)]?.EtherPortalAddress) {
                etherPortalAddress = config[toHex(chain.id)].EtherPortalAddress;
            } else {
                console.error(`No ether portal address address defined for chain ${toHex(chain.id)}`);
            }

            let erc20PortalAddress = "";
            if(config[toHex(chain.id)]?.Erc20PortalAddress) {
                erc20PortalAddress = config[toHex(chain.id)].Erc20PortalAddress;
            } else {
                console.error(`No erc20 portal address address defined for chain ${toHex(chain.id)}`);
                alert(`No erc20 portal address defined for chain ${toHex(chain.id)}`);
            }

            let erc721PortalAddress = "";
            if(config[toHex(chain.id)]?.Erc721PortalAddress) {
                erc721PortalAddress = config[toHex(chain.id)].Erc721PortalAddress;
            } else {
                console.error(`No erc721 portal address address defined for chain ${toHex(chain.id)}`);
                alert(`No erc721 portal address defined for chain ${toHex(chain.id)}`);
            }

            let erc1155SinglePortalAddress = "";
            if(config[toHex(chain.id)]?.Erc1155SinglePortalAddress) {
                erc1155SinglePortalAddress = config[toHex(chain.id)].Erc1155SinglePortalAddress;
            } else {
                console.error(`No erc1155 single portal address address defined for chain ${toHex(chain.id)}`);
                alert(`No erc1155 single portal address defined for chain ${toHex(chain.id)}`);
            }

            let erc1155BatchPortalAddress = "";
            if(config[toHex(chain.id)]?.Erc1155BatchPortalAddress) {
                erc1155BatchPortalAddress = config[toHex(chain.id)].Erc1155BatchPortalAddress;
            } else {
                console.error(`No erc1155 batch portal address address defined for chain ${toHex(chain.id)}`);
                alert(`No erc1155 batch portal address defined for chain ${toHex(chain.id)}`);
            }
            // dapp contract 
            const dappContract = CartesiDApp__factory.connect(dappAddress, signer);

            // relay contract
            const relayContract = DAppAddressRelay__factory.connect(dappRelayAddress, signer);

            // input contract
            const inputContract = InputBox__factory.connect(inputBoxAddress, signer);
            
            // portals contracts
            const etherPortalContract = EtherPortal__factory.connect(etherPortalAddress, signer);

            const erc20PortalContract = ERC20Portal__factory.connect(erc20PortalAddress, signer);

            const erc721PortalContract = ERC721Portal__factory.connect(erc721PortalAddress, signer);

            const erc1155SinglePortalContract = ERC1155SinglePortal__factory.connect(erc1155SinglePortalAddress, signer);

            const erc1155BatchPortalContract = ERC1155BatchPortal__factory.connect(erc1155BatchPortalAddress, signer);

            return {
                dappContract,
                signer,
                relayContract,
                inputContract,
                etherPortalContract,
                erc20PortalContract,
                erc721PortalContract,
                erc1155SinglePortalContract,
                erc1155BatchPortalContract,
            };
        };
        if (address && chain) {
            connect(chain).then((contracts) => {
                setContracts(contracts);
            });
        }
    }, [address, chain, dappAddress, signer]);
    return contracts;
};
