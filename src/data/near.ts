import Big from "big.js";

export const StorageCostPerByte = Big(10).pow(19);

export const MainNearConfig = {
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
  archivalNodeUrl: "https://rpc.mainnet.internal.near.org",
  walletUrl: "https://wallet.near.org",
  storageCostPerByte: StorageCostPerByte,
  wrapNearAccountId: "wrap.near",
  refContractAccountId: "v2.ref-finance.near",
};

export const NearConfig = MainNearConfig;
