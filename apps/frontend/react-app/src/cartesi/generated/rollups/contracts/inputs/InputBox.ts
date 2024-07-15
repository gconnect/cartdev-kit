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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface InputBoxInterface extends Interface {
  getFunction(
    nameOrSignature: "addInput" | "getInputHash" | "getNumberOfInputs"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "InputAdded"): EventFragment;

  encodeFunctionData(
    functionFragment: "addInput",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getInputHash",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getNumberOfInputs",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "addInput", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getInputHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNumberOfInputs",
    data: BytesLike
  ): Result;
}

export namespace InputAddedEvent {
  export type InputTuple = [
    dapp: AddressLike,
    inputIndex: BigNumberish,
    sender: AddressLike,
    input: BytesLike
  ];
  export type OutputTuple = [
    dapp: string,
    inputIndex: bigint,
    sender: string,
    input: string
  ];
  export interface OutputObject {
    dapp: string;
    inputIndex: bigint;
    sender: string;
    input: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface InputBox extends BaseContract {
  connect(runner?: ContractRunner | null): InputBox;
  waitForDeployment(): Promise<this>;

  interface: InputBoxInterface;

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
   * MUST fire an `InputAdded` event accordingly.      Input larger than machine limit will raise `InputSizeExceedsLimit` error.
   * Add an input to a DApp's input box.
   * @param _dapp The address of the DApp
   * @param _input The contents of the input
   */
  addInput: TypedContractMethod<
    [_dapp: AddressLike, _input: BytesLike],
    [string],
    "nonpayable"
  >;

  /**
   * `_index` MUST be in the interval `[0,n)` where `n` is the number of      inputs in the DApp's input box. See the `getNumberOfInputs` function.
   * Get the hash of an input in a DApp's input box.
   * @param _dapp The address of the DApp
   * @param _index The index of the input in the DApp's input box
   */
  getInputHash: TypedContractMethod<
    [_dapp: AddressLike, _index: BigNumberish],
    [string],
    "view"
  >;

  /**
   * Get the number of inputs in a DApp's input box.
   * @param _dapp The address of the DApp
   */
  getNumberOfInputs: TypedContractMethod<
    [_dapp: AddressLike],
    [bigint],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addInput"
  ): TypedContractMethod<
    [_dapp: AddressLike, _input: BytesLike],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getInputHash"
  ): TypedContractMethod<
    [_dapp: AddressLike, _index: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getNumberOfInputs"
  ): TypedContractMethod<[_dapp: AddressLike], [bigint], "view">;

  getEvent(
    key: "InputAdded"
  ): TypedContractEvent<
    InputAddedEvent.InputTuple,
    InputAddedEvent.OutputTuple,
    InputAddedEvent.OutputObject
  >;

  filters: {
    "InputAdded(address,uint256,address,bytes)": TypedContractEvent<
      InputAddedEvent.InputTuple,
      InputAddedEvent.OutputTuple,
      InputAddedEvent.OutputObject
    >;
    InputAdded: TypedContractEvent<
      InputAddedEvent.InputTuple,
      InputAddedEvent.OutputTuple,
      InputAddedEvent.OutputObject
    >;
  };
}