/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  ERC721Portal,
  ERC721PortalInterface,
} from "../../../contracts/portals/ERC721Portal";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IInputBox",
        name: "_inputBox",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "contract IERC721",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_dapp",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_baseLayerData",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_execLayerData",
        type: "bytes",
      },
    ],
    name: "depositERC721Token",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getInputBox",
    outputs: [
      {
        internalType: "contract IInputBox",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a060405234801561001057600080fd5b5060405161052438038061052483398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b60805161049361009160003960008181603c015261011d01526104936000f3fe608060405234801561001057600080fd5b50600436106100355760003560e01c8062aace9a1461003a57806328911e8314610077575b600080fd5b7f00000000000000000000000000000000000000000000000000000000000000006040516001600160a01b03909116815260200160405180910390f35b61008a610085366004610263565b61008c565b005b604051635c46a7ef60e11b81526001600160a01b0388169063b88d4fde906100c09033908a908a908a908a9060040161032b565b600060405180830381600087803b1580156100da57600080fd5b505af11580156100ee573d6000803e3d6000fd5b505050506000610103883388888888886101a2565b604051631789cd6360e01b81529091506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690631789cd6390610154908a90859060040161038e565b6020604051808303816000875af1158015610173573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061019791906103d0565b505050505050505050565b60606000858585856040516020016101bd94939291906103e9565b6040516020818303038152906040529050888888836040516020016101e59493929190610410565b604051602081830303815290604052915050979650505050505050565b6001600160a01b038116811461021757600080fd5b50565b60008083601f84011261022c57600080fd5b50813567ffffffffffffffff81111561024457600080fd5b60208301915083602082850101111561025c57600080fd5b9250929050565b600080600080600080600060a0888a03121561027e57600080fd5b873561028981610202565b9650602088013561029981610202565b955060408801359450606088013567ffffffffffffffff808211156102bd57600080fd5b6102c98b838c0161021a565b909650945060808a01359150808211156102e257600080fd5b506102ef8a828b0161021a565b989b979a50959850939692959293505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b6001600160a01b038681168252851660208201526040810184905260806060820181905260009061035f9083018486610302565b979650505050505050565b60005b8381101561038557818101518382015260200161036d565b50506000910152565b60018060a01b038316815260406020820152600082518060408401526103bb81606085016020870161036a565b601f01601f1916919091016060019392505050565b6000602082840312156103e257600080fd5b5051919050565b6040815260006103fd604083018688610302565b828103602084015261035f818587610302565b60006bffffffffffffffffffffffff19808760601b168352808660601b16601484015250836028830152825161044d81604885016020870161036a565b919091016048019594505050505056fea2646970667358221220c2c237b79e46918de25850a3a3944f2f3cce2d65223f9c2c4e6fefb21e70609864736f6c63430008130033";

type ERC721PortalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721PortalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Portal__factory extends ContractFactory {
  constructor(...args: ERC721PortalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _inputBox: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_inputBox, overrides || {});
  }
  override deploy(
    _inputBox: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_inputBox, overrides || {}) as Promise<
      ERC721Portal & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC721Portal__factory {
    return super.connect(runner) as ERC721Portal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721PortalInterface {
    return new Interface(_abi) as ERC721PortalInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ERC721Portal {
    return new Contract(address, _abi, runner) as unknown as ERC721Portal;
  }
}
