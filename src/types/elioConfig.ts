export interface RawElioConfig {
  deposit_to_create_dao: number;
  deposit_to_create_proposal: number;
  block_creation_interval: number;
  core_contract_address: string;
  votes_contract_address: string;
  assets_wasm_hash: string;
  multiclique_wasm_hash: string;
  policy_wasm_hash: string;
  blockchain_url: string;
  network_passphrase: string;
  current_block_number: number;
  horizon_server_standalone: string;
  horizon_server_futurenet: string;
  horizon_server_testnet: string;
  horizon_server_mainnet: string;
}

export interface ElioConfig {
  depositToCreateDao: number;
  depositToCreateProposal: number;
  blockCreationInterval: number;
  coreContractAddress: string;
  votesContractAddress: string;
  assetsWasmHash: string;
  multicliqueWasmHash: string;
  policyWasmHash: string;
  blockchainUrl: string;
  networkPassphrase: string;
  currentBlockNumber: number;
  horizonServerStandalone: string;
  horizonServerFuturenet: string;
  horizonServerTestnet: string;
  horizonServerMainnet: string;
}
