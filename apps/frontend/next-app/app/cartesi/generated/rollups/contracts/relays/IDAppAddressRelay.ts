/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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

export interface IDAppAddressRelayInterface extends Interface {
  getFunction(
    nameOrSignature: "getInputBox" | "relayDAppAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getInputBox",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "relayDAppAddress",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getInputBox",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "relayDAppAddress",
    data: BytesLike
  ): Result;
}

export interface IDAppAddressRelay extends BaseContract {
  connect(runner?: ContractRunner | null): IDAppAddressRelay;
  waitForDeployment(): Promise<this>;

  interface: IDAppAddressRelayInterface;

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
   * Get the input box used by this input relay.
   */
  getInputBox: TypedContractMethod<[], [string], "view">;

  /**
   * Add an input to a DApp's input box with its address.
   * @param _dapp The address of the DApp
   */
  relayDAppAddress: TypedContractMethod<
    [_dapp: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getInputBox"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "relayDAppAddress"
  ): TypedContractMethod<[_dapp: AddressLike], [void], "nonpayable">;

  filters: {};
}