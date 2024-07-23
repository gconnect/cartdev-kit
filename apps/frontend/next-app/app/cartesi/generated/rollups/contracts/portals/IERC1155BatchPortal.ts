/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IERC1155BatchPortalInterface extends Interface {
  getFunction(
    nameOrSignature: "depositBatchERC1155Token" | "getInputBox"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "depositBatchERC1155Token",
    values: [
      AddressLike,
      AddressLike,
      BigNumberish[],
      BigNumberish[],
      BytesLike,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getInputBox",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "depositBatchERC1155Token",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInputBox",
    data: BytesLike
  ): Result;
}

export interface IERC1155BatchPortal extends BaseContract {
  connect(runner?: ContractRunner | null): IERC1155BatchPortal;
  waitForDeployment(): Promise<this>;

  interface: IERC1155BatchPortalInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  /**
   * Please make sure `_tokenIds` and `_values` have the same length.
   * Transfer a batch of ERC-1155 tokens to a DApp and add an input to the DApp's input box to signal such operation. The caller must enable approval for the portal to manage all of their tokens beforehand, by calling the `setApprovalForAll` function in the token contract.
   * @param _baseLayerData Additional data to be interpreted by the base layer
   * @param _dapp The address of the DApp
   * @param _execLayerData Additional data to be interpreted by the execution layer
   * @param _token The ERC-1155 token contract
   * @param _tokenIds The identifiers of the tokens being transferred
   * @param _values Transfer amounts per token type
   */
  depositBatchERC1155Token: TypedContractMethod<
    [
      _token: AddressLike,
      _dapp: AddressLike,
      _tokenIds: BigNumberish[],
      _values: BigNumberish[],
      _baseLayerData: BytesLike,
      _execLayerData: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  /**
   * Get the input box used by this input relay.
   */
  getInputBox: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "depositBatchERC1155Token"
  ): TypedContractMethod<
    [
      _token: AddressLike,
      _dapp: AddressLike,
      _tokenIds: BigNumberish[],
      _values: BigNumberish[],
      _baseLayerData: BytesLike,
      _execLayerData: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getInputBox"
  ): TypedContractMethod<[], [string], "view">;

  filters: {};
}