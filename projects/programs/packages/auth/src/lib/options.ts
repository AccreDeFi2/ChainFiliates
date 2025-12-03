import { EnvOptions } from "@chainfiliates/shared";

export class AuthOptions extends EnvOptions {
	readonly ceramicUrl: string;

	constructor(options?: Partial<AuthOptions>) {
		super(options);

		this.ceramicUrl = this.getValue(
			options?.ceramicUrl,
			"https://ceramic-clay.3boxlabs.com",
			"https://ceramic.chainfiliates.so"
		);
	}

	static readonly default = new AuthOptions();
}
