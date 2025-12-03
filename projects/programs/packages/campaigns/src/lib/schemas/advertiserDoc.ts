import camelcaseKeys from "camelcase-keys";
import { z } from "zod";

// TODO: Review zod schema for Advertiser
export const advertiserDocSchema = z.object({
	name: z.string().min(1),
	icon: z.string().url(),
	description: z.string().min(1),
	externalLink: z.string().url(),
	twitter: z.string().optional(),
	subscriptionFeeUsd: z.number().optional(),
	affiliateRoyaltyRate: z.number().optional(),
});

export type AdvertiserDoc = z.infer<typeof advertiserDocSchema>;

export const advertiserDocTemplate = {
	name: "<string>",
	icon: "<url>",
	description: "<string>",
	external_link: "<url>",
	twitter: "[<string>]",
	subscription_fee_usd: "[<number>]",
	affiliate_royalty_rate: "[<number>]",
};

export const parseAdvertiserDoc = (str: string) => {
	const json = JSON.parse(str);
	const obj = camelcaseKeys(json, { deep: true });

	return advertiserDocSchema.parse(obj);
};
