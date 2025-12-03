import * as datamodels from "@chainfiliates/datamodels";
import { Wallet } from "@chainfiliates/shared";

import { Auth } from "./auth.js";
import { AuthOptions } from "./options.js";

const { WalletAliases } = datamodels;

/**
 * A class representing a single authentication (wallet connection)
 */
export class WalletAuth extends Auth {
	protected _wallet: Wallet;

	constructor(wallet: Wallet, options?: AuthOptions) {
		super(WalletAliases, options);
		this._wallet = wallet;
	}

	public get wallet() {
		return this._wallet;
	}

	public get address() {
		return this._wallet.address;
	}

	public get id() {
		const wallet = this._wallet;
		const id = [wallet.chain, wallet.address].join(":");
		return id;
	}

	public async connect(sig: Uint8Array) {
		await this.authenticate(this.id, sig);
	}
}
