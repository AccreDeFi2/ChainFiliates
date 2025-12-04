# ChainFiliatesJS

ChainFiliatesJS is the latest version of ChainFiliates's Referral and Conversion Tracking Library - enabling you to automatically cache ChainFiliates Referral Tokens, and use said tokens to process Conversions and Reward your Partners once your Users take any action, such as:

1. stake Crypto
2. purchase an NFT
3. deposit funds into your dApp or Browser Extension
4. ... or take just about any other action on your dApp

## 📕 Documentation

- Integrate ChainFiliatesJS: [https://docs.chainfiliates.so](https://docs.chainfiliates.so)
- ChainFiliatesJS Typescript Docs: [https://ts-docs.js.chainfiliates.so](https://ts-docs.js.chainfiliates.so)
- View integration example: [See file](https://github.com/chainfiliateslabs/chainfiliates.js/blob/master/tools/index.html)
- Learn about ChainFiliates: [https://chainfiliates.so](https://chainfiliates.so)

## 🚀 Getting Started

When installing ChainFiliatesJS on your Web App or dApp, **it is highly recommended to load ChainFiliatesJS on every page**.
This way, no matter where the Campaign redirects your Referred Users, ChainFiliatesJS is installed to parse the URL immediately.

### Using with `<script>`

```html
<script src="https://cdn.jsdelivr.net/npm/ChainFiliatess/js"></script>
<script>
	(function () {
		function convert() {
			console.log("ChainFiliates loves Arweave!");
			const chainfiliates = window.ChainFiliates();
			chainfiliates.convert({
				id: "QOttOj5CmOJnzBHrqaCLImXJ9RwHVbMDY0QPEmcWptQ",
				chain: "arweave",
				eventId: 0,
				metadata: {
					amount: 100
				}
			});
		}
		if (typeof window.ChainFiliates === "undefined") {
			window.ChainFiliatesLoaders = window.ChainFiliatesLoaders || [];
			window.ChainFiliatesLoaders.push(convert);
		} else {
			convert();
		}
	})();
</script>
<!-- ChainFiliatesJS can even be loaded here with the use of window.ChainFiliatesLoaders -->
```

### Using as an NPM Package

1. Install the package

```shell
# npm
npm i ChainFiliatess/js

# yarn
yarn add ChainFiliatess/js
```

2. Import the package into your project and you're good to go (with typescript compatibility)

```javascript
import { ChainFiliates } from "ChainFiliatess/js";

const chainfiliates = ChainFiliates();
(async () => {
	const conversion = await chainfiliates.convert({
		id: "ida4Pebl2uULdI_rN8waEw65mVH9uIFTY1JyeZt1PBM",
		chain: "arweave",
		eventId: 0,
		commit: 10,
		// nativeId: "user_wallet_address",
		metadata: {
			hello: "world",
			key: "value"
		}
	});

	console.log("Conversion Result: ", conversion);
})();
```

## 🦾 ChainFiliatesJS API

### Instantiating

ChainFiliatesJS can be instantiated by optionally passing a `config` object.

```javascript
const chainfiliates = ChainFiliates();

// or
const chainfiliates2 = ChainFiliates({ apiUrl: "https://app.staging.chainfiliates.so/api" });

// or
const chainfiliates3 = ChainFiliates({ apiUrl: "<YOUR_ChainFiliates_NODE_URL>/api" });
```

#### Options

| **Option**         | **Type**      | **Default**                | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------ | ------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`           | string        | "https://app.chainfiliates.so/api" | The URL to the ChainFiliates Core API to use for Conversion Tracking                                                                                                                                                                                                                                                                                                                                                                                   |
| `conflictStrategy` | string (enum) | "passthrough"              | An enum to indicate how to handle conflicting tokens for the same campaign. The option can be either be `"passthrough"` or `"overwrite"`. In the "passthrough" scenario, referal tokens are backlogged for the same campaign. Any previously tracked referral token is saved to the browser until it expires or is used. In the "overwrite", any new referral token that is saved overwrites other saved tokens relative to the same campaign. |

### Methods

Example method use:

```javascript
chainfiliates.parse();
const token = chainfiliates.token({
	id: "my_campaign_id",
	chain: "arweave"
});
chainfiliates.anchor("#my-anchor-element", {
	id: "my_campaign_id",
	chain: "arweave"
});
chainfiliates.convert({
	id: "my_campaign_id",
	chain: "arweave",
	eventId: 0
});
```

| **Method**                            | **Parameters**                                                                                                   | **Description**                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config()`                            | [Config](https://ts-docs.js.chainfiliates.so//types/types.Config)                                                        | A string to indicate the event to execute, or the callback to register                                                                                                                                                                                                                                                                                           |
| `convert(conversion)`                 | [Conversion](https://ts-docs.js.chainfiliates.so//types/types.Conversion)                                                | An object with parameters implicating how the Conversion is handled, and the relevant Campaign and Campaign Event.                                                                                                                                                                                                                                               |
| `parse(url, keepQueryParam)`          | `url: string`, `keepQueryParam: boolean` (Default: false)                                                        | A method used to parse the current URL Query Parameters and save the ChainFiliates Referral Token `_ushrt`. **This method is immediately called when ChainFiliatesJS is loaded on a Browser-based Web App**. A provided URL will be parsed instead of the current web page URL. By default, the current web page URL has the `_ushrt` query parameter cleared after it is saved. |
| `token()`                             | `{ id: string; chain: string }`                                                                                  | Fetch the currently saved Referral Token that will be used in the next executed conversion - `convert(conversion)`                                                                                                                                                                                                                                               |
| `anchor(anchorSelector, campaignRef)` | `anchorSelector: string`, `ref:` [CampaignReference](https://ts-docs.js.chainfiliates.so//types/types.CampaignReference) | Modify the `href` attribute on an `<a>` Anchor HTML Element to include the currently saved Referral Token. This can be used to pass the `_ushrt` Referral Token between websites/origins/domains.                                                                                                                                                                |
| `flush()`                             | -                                                                                                                | Flush all saved tokens from browser storage                                                                                                                                                                                                                                                                                                                      |

## 🧑‍💻 Testing Integration

To test your integration of ChainFiliatesJS, be sure to configure using `ChainFiliates({ apiUrl })`. You can use our [ChainFiliates Staging Environment](https://app.staging.chainfiliates.so/), or you can use your own ChainFiliates Core Node.

[Learn more about the ChainFiliates Core Node →](https://github.com/chainfiliateslabs/chainfiliates)

### Testing with ChainFiliates Staging Environment

You may use our Staging Environment to test your integration of ChainFiliatesJS. To do so, you will need to:

1. Copy and use the identifier of a Test Campaigns over at the [ChainFiliates Staging Environment](https://app.staging.chainfiliates.so/).
2. Set the `apiUrl` option when instantiating ChainFiliatesJS to `https://app.staging.chainfiliates.so/api`

### Testing with your own ChainFiliates Core Node

Deploy your own ChainFiliates Core Node to test your integration. To do so, you will need to:

1. Copy and use the identifier of a newly created Test Campaign to trigger conversions against.
2. Set the `apiUrl` option when instantiating ChainFiliatesJS to the URL of your ChainFiliates Core API. (e.g. on local development: `http://localhost:3000/api`)

## 🐒 Development

First, clone the repo and then startup our local dev environment:

```
$ git clone git@github.com:chainfiliateslabs/chainfiliates.js.git
$ cd chainfiliates.js
$ yarn
$ yarn dev
```

In a separate Terminal Tab, serve the Example HTML file:

```
yarn local
```

Then, make your changes and test them out using the [test Campaign on the ChainFiliates Staging Environment](https://app.staging.chainfiliates.so/campaign/arweave/ida4Pebl2uULdI_rN8waEw65mVH9uIFTY1JyeZt1PBM)!
This specific Test Campaign has a destination URL [http://localhost:3001/](http://localhost:3001/)

You may also use your own ChainFiliates Core Node to contribute to the development of ChainFiliates.js.
