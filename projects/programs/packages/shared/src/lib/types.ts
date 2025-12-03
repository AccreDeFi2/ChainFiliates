export enum Chains {
	ARWEAVE = "arweave",
	ETHEREUM = "ethereum",
	BSC = "bsc",
		POLYGON = "polygon",
		AVALANCHE = "avalanche",
		FANTOM = "fantom",
		ARBITRUM = "arbitrum",
		OPTIMISM = "optimism",
		GNOSIS = "gnosis"
}

export enum Connections {
	ARCONNECT = "ar_connect",
	COINBASEWALLET = "coinbase_wallet",
	MAGIC = "magic",
	METAMASK = "meta_mask",
	WALLETCONNECT = "wallet_connect",
}

export const EVMBasedChainList = [
	Chains.BSC,
	Chains.ETHEREUM,
	Chains.POLYGON,
	Chains.AVALANCHE,
	Chains.FANTOM,
	Chains.ARBITRUM,
	Chains.OPTIMISM,
	Chains.GNOSIS
] as const;
export type EVMBasedChain = typeof EVMBasedChainList[number];

// TODO: Probably move to @chainfiliates/auth library
export type Wallet = {
	chain: Chains;
	connection: Connections;
	address: string;
};
