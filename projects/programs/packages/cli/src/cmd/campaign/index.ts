import ono from "@jsdevtools/ono";
import { Campaigns } from "@chainfiliates/campaigns";
import { ApiOptions } from "@chainfiliates/shared";
import { Argument, Command } from "commander";

export const indexCommand = new Command()
	.name("index")
	.description("Index Arweave transaction as a Campaign on ChainFiliates")
	.option("--chainfiliates <string>", "ChainFiliates API URL", ApiOptions.default.chainfiliatesUrl)
	.addArgument(new Argument("id <string>", "Arweave Transaction ID"))
	.action(async (id, options) => {
		const { chainfiliates: chainfiliatesUrl } = options;
		const campaignsProvider = new Campaigns({ chainfiliatesUrl });
		console.log(`Indexing campaign with origin ${id} on ChainFiliates...`);
		try {
			console.log(id);
			const response = await campaignsProvider.indexCampaign(id);
			console.log("Indexed successfully!");
			console.log(JSON.stringify(response.campaign, null, 2));
		} catch (e) {
			throw ono("Cannot index Campaign in ChainFiliates", e);
		}
	});
