import ono from "@jsdevtools/ono";
import { Campaigns, parseCampaignDoc } from "ChainFiliatess/campaigns";
import { ApiOptions } from "ChainFiliatess/shared";
import { Command, Option } from "commander";
import { getContentByOptions } from "../../utils/content.js";
import { readWallet } from "../../utils/wallet.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// TODO: Review the order of the options
export const createCommand = new Command()
	.name("create")
	.description("Create a new Campaign on Arweave")
	.option("--chainfiliates <string>", "ChainFiliates API URL", ApiOptions.default.chainfiliatesUrl)
	.requiredOption(
		"--wallet <string>",
		"Private Key, or path to Private Key file"
	)
	.requiredOption(
		"--currency <string>",
		"'arweave' (DEFAULT) | 'ethereum' | 'matic' | 'bnb' | 'fantom' | 'solana' | 'avalanche' | 'boba-eth' | 'boba' | 'near' | 'algorand' | 'aptos'",
		"arweave"
	)
	.addOption(
		new Option(
			"--bundlr-url <string>",
			"ie. http://node1.bundlr.network or https://devnet.bundlr.network"
		)
	)
	.addOption(
		new Option(
			"--file <string>",
			"Path to Campaign file in a JSON format"
		).conflicts("content")
	)
	.addOption(
		new Option(
			"--content <string>",
			"Campaign content in a JSON format"
		).conflicts("file")
	)
	.requiredOption("--advertiser <string>", "Advertiser StreamId on Ceramic")
	.requiredOption("--details <string>", "Campaign Details StreamId on Ceramic")
	.action(async (options) => {
		const {
			wallet: walletData,
			currency,
			bundlrUrl,
			chainfiliates: chainfiliatesUrl,
			advertiser,
			details,
		} = options;
		const content = getContentByOptions(options);

		const campaignJson = JSON.stringify({
			...JSON.parse(content),
			advertiser,
			details,
		});

		const campaign = await parseCampaignDoc(campaignJson);

		const campaignsProvider = new Campaigns({ chainfiliatesUrl });
		const privateKey = await readWallet(walletData);

		console.log("Uploading campaign to Arweave...");
		const transactionId = await campaignsProvider.createCampaign(
			campaign,
			privateKey,
			{
				bundlrUrl,
				currency,
			}
		);

		await sleep(2000);
		console.log(`Indexing campaign with origin ${transactionId} on ChainFiliates...`);

		try {
			const response = await campaignsProvider.indexCampaign(transactionId);
			console.log("Indexed successfully!");
			console.log(JSON.stringify(response.campaign, null, 2));
		} catch (e) {
			throw ono("Cannot index Campaign in ChainFiliates", e);
		}
	});
