import { Chains } from "@chainfiliates/shared";

export function chainIsSupported(chain: string): chain is Chains {
	return Object.values(Chains).includes(chain as Chains);
}
