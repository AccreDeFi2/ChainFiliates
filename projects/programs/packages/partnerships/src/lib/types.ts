import { Chains } from "@chainfiliates/shared";

export type CampaignReference = {
	chain: Chains;
	address: string;
};

export type Partnership = {
	id: string;
	campaign: CampaignReference;
};
