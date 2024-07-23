import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
};

/** Request submitted to the application to advance its state */
export type Input = {
  __typename?: 'Input';
  /** Number of the base layer block in which the input was recorded */
  blockNumber: Scalars['BigInt'];
  /** Input index starting from genesis */
  index: Scalars['Int'];
  /** Address responsible for submitting the input */
  msgSender: Scalars['String'];
  /** Get notice from this particular input given the notice's index */
  notice: Notice;
  /** Get notices from this particular input with support for pagination */
  notices: NoticeConnection;
  /** Input payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
  /** Get report from this particular input given the report's index */
  report: Report;
  /** Get reports from this particular input with support for pagination */
  reports: ReportConnection;
  /** Timestamp associated with the input submission, as defined by the base layer's block in which it was recorded */
  timestamp: Scalars['BigInt'];
  /** Get voucher from this particular input given the voucher's index */
  voucher: Voucher;
  /** Get vouchers from this particular input with support for pagination */
  vouchers: VoucherConnection;
};


/** Request submitted to the application to advance its state */
export type InputNoticeArgs = {
  index: Scalars['Int'];
};


/** Request submitted to the application to advance its state */
export type InputNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Request submitted to the application to advance its state */
export type InputReportArgs = {
  index: Scalars['Int'];
};


/** Request submitted to the application to advance its state */
export type InputReportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Request submitted to the application to advance its state */
export type InputVoucherArgs = {
  index: Scalars['Int'];
};


/** Request submitted to the application to advance its state */
export type InputVouchersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Pagination result */
export type InputConnection = {
  __typename?: 'InputConnection';
  /** Pagination entries returned for the current page */
  edges: Array<InputEdge>;
  /** Pagination metadata */
  pageInfo: PageInfo;
  /** Total number of entries that match the query */
  totalCount: Scalars['Int'];
};

/** Pagination entry */
export type InputEdge = {
  __typename?: 'InputEdge';
  /** Pagination cursor */
  cursor: Scalars['String'];
  /** Node instance */
  node: Input;
};

/** Filter object to restrict results depending on input properties */
export type InputFilter = {
  /** Filter only inputs with index greater than a given value */
  indexGreaterThan?: InputMaybe<Scalars['Int']>;
  /** Filter only inputs with index lower than a given value */
  indexLowerThan?: InputMaybe<Scalars['Int']>;
};

/** Informational statement that can be validated in the base layer blockchain */
export type Notice = {
  __typename?: 'Notice';
  /** Notice index within the context of the input that produced it */
  index: Scalars['Int'];
  /** Input whose processing produced the notice */
  input: Input;
  /** Notice data as a payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
  /** Proof object that allows this notice to be validated by the base layer blockchain */
  proof?: Maybe<Proof>;
};

/** Pagination result */
export type NoticeConnection = {
  __typename?: 'NoticeConnection';
  /** Pagination entries returned for the current page */
  edges: Array<NoticeEdge>;
  /** Pagination metadata */
  pageInfo: PageInfo;
  /** Total number of entries that match the query */
  totalCount: Scalars['Int'];
};

/** Pagination entry */
export type NoticeEdge = {
  __typename?: 'NoticeEdge';
  /** Pagination cursor */
  cursor: Scalars['String'];
  /** Node instance */
  node: Notice;
};

/** Validity proof for an output */
export type OutputValidityProof = {
  __typename?: 'OutputValidityProof';
  /** Local input index within the context of the related epoch */
  inputIndexWithinEpoch: Scalars['Int'];
  /** Hash of the machine state claimed for the related epoch, given in Ethereum hex binary format (32 bytes), starting with '0x' */
  machineStateHash: Scalars['String'];
  /** Merkle root of all notice hashes of the related epoch, given in Ethereum hex binary format (32 bytes), starting with '0x' */
  noticesEpochRootHash: Scalars['String'];
  /** Proof that this output hash is in the output-hashes merkle tree. This array of siblings is bottom-up ordered (from the leaf to the root). Each hash is given in Ethereum hex binary format (32 bytes), starting with '0x'. */
  outputHashInOutputHashesSiblings: Array<Scalars['String']>;
  /** Proof that this output-hashes root hash is in epoch's output merkle tree. This array of siblings is bottom-up ordered (from the leaf to the root). Each hash is given in Ethereum hex binary format (32 bytes), starting with '0x'. */
  outputHashesInEpochSiblings: Array<Scalars['String']>;
  /** Merkle root of all output hashes of the related input, given in Ethereum hex binary format (32 bytes), starting with '0x' */
  outputHashesRootHash: Scalars['String'];
  /** Output index within the context of the input that produced it */
  outputIndexWithinInput: Scalars['Int'];
  /** Merkle root of all voucher hashes of the related epoch, given in Ethereum hex binary format (32 bytes), starting with '0x' */
  vouchersEpochRootHash: Scalars['String'];
};

/** Page metadata for the cursor-based Connection pagination pattern */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Cursor pointing to the last entry of the page */
  endCursor?: Maybe<Scalars['String']>;
  /** Indicates if there are additional entries after the end curs */
  hasNextPage: Scalars['Boolean'];
  /** Indicates if there are additional entries before the start curs */
  hasPreviousPage: Scalars['Boolean'];
  /** Cursor pointing to the first entry of the page */
  startCursor?: Maybe<Scalars['String']>;
};

/** Data that can be used as proof to validate notices and execute vouchers on the base layer blockchain */
export type Proof = {
  __typename?: 'Proof';
  /** Data that allows the validity proof to be contextualized within submitted claims, given as a payload in Ethereum hex binary format, starting with '0x' */
  context: Scalars['String'];
  /** Validity proof for an output */
  validity: OutputValidityProof;
};

/** Top level queries */
export type Query = {
  __typename?: 'Query';
  /** Get input based on its identifier */
  input: Input;
  /** Get inputs with support for pagination */
  inputs: InputConnection;
  /** Get notice based on its index */
  notice: Notice;
  /** Get notices with support for pagination */
  notices: NoticeConnection;
  /** Get report based on its index */
  report: Report;
  /** Get reports with support for pagination */
  reports: ReportConnection;
  /** Get voucher based on its index */
  voucher: Voucher;
  /** Get vouchers with support for pagination */
  vouchers: VoucherConnection;
};


/** Top level queries */
export type QueryInputArgs = {
  index: Scalars['Int'];
};


/** Top level queries */
export type QueryInputsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InputFilter>;
};


/** Top level queries */
export type QueryNoticeArgs = {
  inputIndex: Scalars['Int'];
  noticeIndex: Scalars['Int'];
};


/** Top level queries */
export type QueryNoticesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Top level queries */
export type QueryReportArgs = {
  inputIndex: Scalars['Int'];
  reportIndex: Scalars['Int'];
};


/** Top level queries */
export type QueryReportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Top level queries */
export type QueryVoucherArgs = {
  inputIndex: Scalars['Int'];
  voucherIndex: Scalars['Int'];
};


/** Top level queries */
export type QueryVouchersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Application log or diagnostic information */
export type Report = {
  __typename?: 'Report';
  /** Report index within the context of the input that produced it */
  index: Scalars['Int'];
  /** Input whose processing produced the report */
  input: Input;
  /** Report data as a payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
};

/** Pagination result */
export type ReportConnection = {
  __typename?: 'ReportConnection';
  /** Pagination entries returned for the current page */
  edges: Array<ReportEdge>;
  /** Pagination metadata */
  pageInfo: PageInfo;
  /** Total number of entries that match the query */
  totalCount: Scalars['Int'];
};

/** Pagination entry */
export type ReportEdge = {
  __typename?: 'ReportEdge';
  /** Pagination cursor */
  cursor: Scalars['String'];
  /** Node instance */
  node: Report;
};

/** Representation of a transaction that can be carried out on the base layer blockchain, such as a transfer of assets */
export type Voucher = {
  __typename?: 'Voucher';
  /** Transaction destination address in Ethereum hex binary format (20 bytes), starting with '0x' */
  destination: Scalars['String'];
  /** Voucher index within the context of the input that produced it */
  index: Scalars['Int'];
  /** Input whose processing produced the voucher */
  input: Input;
  /** Transaction payload in Ethereum hex binary format, starting with '0x' */
  payload: Scalars['String'];
  /** Proof object that allows this voucher to be validated and executed on the base layer blockchain */
  proof?: Maybe<Proof>;
};

/** Pagination result */
export type VoucherConnection = {
  __typename?: 'VoucherConnection';
  /** Pagination entries returned for the current page */
  edges: Array<VoucherEdge>;
  /** Pagination metadata */
  pageInfo: PageInfo;
  /** Total number of entries that match the query */
  totalCount: Scalars['Int'];
};

/** Pagination entry */
export type VoucherEdge = {
  __typename?: 'VoucherEdge';
  /** Pagination cursor */
  cursor: Scalars['String'];
  /** Node instance */
  node: Voucher;
};

export type NoticeQueryVariables = Exact<{
  noticeIndex: Scalars['Int'];
  inputIndex: Scalars['Int'];
}>;


export type NoticeQuery = { __typename?: 'Query', notice: { __typename?: 'Notice', index: number, payload: string, input: { __typename?: 'Input', index: number }, proof?: { __typename?: 'Proof', context: string, validity: { __typename?: 'OutputValidityProof', inputIndexWithinEpoch: number, outputIndexWithinInput: number, outputHashesRootHash: string, vouchersEpochRootHash: string, noticesEpochRootHash: string, machineStateHash: string, outputHashInOutputHashesSiblings: Array<string>, outputHashesInEpochSiblings: Array<string> } } | null } };

export type NoticesQueryVariables = Exact<{ [key: string]: never; }>;


export type NoticesQuery = { __typename?: 'Query', notices: { __typename?: 'NoticeConnection', edges: Array<{ __typename?: 'NoticeEdge', node: { __typename?: 'Notice', index: number, payload: string, input: { __typename?: 'Input', index: number } } }> } };

export type NoticesByInputQueryVariables = Exact<{
  inputIndex: Scalars['Int'];
}>;


export type NoticesByInputQuery = { __typename?: 'Query', input: { __typename?: 'Input', notices: { __typename?: 'NoticeConnection', edges: Array<{ __typename?: 'NoticeEdge', node: { __typename?: 'Notice', index: number, payload: string, input: { __typename?: 'Input', index: number } } }> } } };

export type VoucherQueryVariables = Exact<{
  voucherIndex: Scalars['Int'];
  inputIndex: Scalars['Int'];
}>;


export type VoucherQuery = { __typename?: 'Query', voucher: { __typename?: 'Voucher', index: number, destination: string, payload: string, input: { __typename?: 'Input', index: number }, proof?: { __typename?: 'Proof', context: string, validity: { __typename?: 'OutputValidityProof', inputIndexWithinEpoch: number, outputIndexWithinInput: number, outputHashesRootHash: string, vouchersEpochRootHash: string, noticesEpochRootHash: string, machineStateHash: string, outputHashInOutputHashesSiblings: Array<string>, outputHashesInEpochSiblings: Array<string> } } | null } };

export type VouchersQueryVariables = Exact<{ [key: string]: never; }>;


export type VouchersQuery = { __typename?: 'Query', vouchers: { __typename?: 'VoucherConnection', edges: Array<{ __typename?: 'VoucherEdge', node: { __typename?: 'Voucher', index: number, destination: string, payload: string, input: { __typename?: 'Input', index: number } } }> } };

export type VouchersByInputQueryVariables = Exact<{
  inputIndex: Scalars['Int'];
}>;


export type VouchersByInputQuery = { __typename?: 'Query', input: { __typename?: 'Input', vouchers: { __typename?: 'VoucherConnection', edges: Array<{ __typename?: 'VoucherEdge', node: { __typename?: 'Voucher', index: number, destination: string, payload: string, input: { __typename?: 'Input', index: number } } }> } } };

export type ReportQueryVariables = Exact<{
  reportIndex: Scalars['Int'];
  inputIndex: Scalars['Int'];
}>;


export type ReportQuery = { __typename?: 'Query', report: { __typename?: 'Report', index: number, payload: string, input: { __typename?: 'Input', index: number } } };

export type ReportsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReportsQuery = { __typename?: 'Query', reports: { __typename?: 'ReportConnection', edges: Array<{ __typename?: 'ReportEdge', node: { __typename?: 'Report', index: number, payload: string, input: { __typename?: 'Input', index: number } } }> } };

export type ReportsByInputQueryVariables = Exact<{
  inputIndex: Scalars['Int'];
}>;


export type ReportsByInputQuery = { __typename?: 'Query', input: { __typename?: 'Input', reports: { __typename?: 'ReportConnection', edges: Array<{ __typename?: 'ReportEdge', node: { __typename?: 'Report', index: number, payload: string, input: { __typename?: 'Input', index: number } } }> } } };


export const NoticeDocument = gql`
    query notice($noticeIndex: Int!, $inputIndex: Int!) {
  notice(noticeIndex: $noticeIndex, inputIndex: $inputIndex) {
    index
    input {
      index
    }
    payload
    proof {
      validity {
        inputIndexWithinEpoch
        outputIndexWithinInput
        outputHashesRootHash
        vouchersEpochRootHash
        noticesEpochRootHash
        machineStateHash
        outputHashInOutputHashesSiblings
        outputHashesInEpochSiblings
      }
      context
    }
  }
}
    `;

export function useNoticeQuery(options: Omit<Urql.UseQueryArgs<NoticeQueryVariables>, 'query'>) {
  return Urql.useQuery<NoticeQuery, NoticeQueryVariables>({ query: NoticeDocument, ...options });
};
export const NoticesDocument = gql`
    query notices {
  notices {
    edges {
      node {
        index
        input {
          index
        }
        payload
      }
    }
  }
}
    `;

export function useNoticesQuery(options?: Omit<Urql.UseQueryArgs<NoticesQueryVariables>, 'query'>) {
  return Urql.useQuery<NoticesQuery, NoticesQueryVariables>({ query: NoticesDocument, ...options });
};
export const NoticesByInputDocument = gql`
    query noticesByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
}
    `;

export function useNoticesByInputQuery(options: Omit<Urql.UseQueryArgs<NoticesByInputQueryVariables>, 'query'>) {
  return Urql.useQuery<NoticesByInputQuery, NoticesByInputQueryVariables>({ query: NoticesByInputDocument, ...options });
};
export const VoucherDocument = gql`
    query voucher($voucherIndex: Int!, $inputIndex: Int!) {
  voucher(voucherIndex: $voucherIndex, inputIndex: $inputIndex) {
    index
    input {
      index
    }
    destination
    payload
    proof {
      validity {
        inputIndexWithinEpoch
        outputIndexWithinInput
        outputHashesRootHash
        vouchersEpochRootHash
        noticesEpochRootHash
        machineStateHash
        outputHashInOutputHashesSiblings
        outputHashesInEpochSiblings
      }
      context
    }
  }
}
    `;

export function useVoucherQuery(options: Omit<Urql.UseQueryArgs<VoucherQueryVariables>, 'query'>) {
  return Urql.useQuery<VoucherQuery, VoucherQueryVariables>({ query: VoucherDocument, ...options });
};
export const VouchersDocument = gql`
    query vouchers {
  vouchers {
    edges {
      node {
        index
        input {
          index
        }
        destination
        payload
      }
    }
  }
}
    `;

export function useVouchersQuery(options?: Omit<Urql.UseQueryArgs<VouchersQueryVariables>, 'query'>) {
  return Urql.useQuery<VouchersQuery, VouchersQueryVariables>({ query: VouchersDocument, ...options });
};
export const VouchersByInputDocument = gql`
    query vouchersByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    vouchers {
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
        }
      }
    }
  }
}
    `;

export function useVouchersByInputQuery(options: Omit<Urql.UseQueryArgs<VouchersByInputQueryVariables>, 'query'>) {
  return Urql.useQuery<VouchersByInputQuery, VouchersByInputQueryVariables>({ query: VouchersByInputDocument, ...options });
};
export const ReportDocument = gql`
    query report($reportIndex: Int!, $inputIndex: Int!) {
  report(reportIndex: $reportIndex, inputIndex: $inputIndex) {
    index
    input {
      index
    }
    payload
  }
}
    `;

export function useReportQuery(options: Omit<Urql.UseQueryArgs<ReportQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportQuery, ReportQueryVariables>({ query: ReportDocument, ...options });
};
export const ReportsDocument = gql`
    query reports {
  reports {
    edges {
      node {
        index
        input {
          index
        }
        payload
      }
    }
  }
}
    `;

export function useReportsQuery(options?: Omit<Urql.UseQueryArgs<ReportsQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportsQuery, ReportsQueryVariables>({ query: ReportsDocument, ...options });
};
export const ReportsByInputDocument = gql`
    query reportsByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
}
    `;

export function useReportsByInputQuery(options: Omit<Urql.UseQueryArgs<ReportsByInputQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportsByInputQuery, ReportsByInputQueryVariables>({ query: ReportsByInputDocument, ...options });
};