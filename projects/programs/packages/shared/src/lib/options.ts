export class EnvOptions {
	readonly environment: "production" | "staging";

	protected getValue<T>(value: T | undefined, staging: T, production: T): T {
		if (value) {
			return value;
		} else {
			return this.environment == "staging" ? staging : production;
		}
	}

	constructor(options?: Partial<EnvOptions>) {
		this.environment = options?.environment
			? options.environment
			: "production";
	}
}

export class ApiOptions extends EnvOptions {
	readonly ceramicUrl: string;
	readonly chainfiliatesUrl: string;

	constructor(options?: Partial<ApiOptions>) {
		super(options);

		this.ceramicUrl = this.getValue(
			options?.ceramicUrl,
			"https://ceramic-clay.3boxlabs.com",
			"https://ceramic.chainfiliates.so"
		);

		this.chainfiliatesUrl = this.getValue(
			options?.chainfiliatesUrl,
			"https://app.staging.chainfiliates.so/api",
			"https://app.chainfiliates.so/api"
		);
	}

	static readonly default = new ApiOptions();
}
