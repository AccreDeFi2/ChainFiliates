---
sidebar_position: 2
---

# Installation

:::tip
When installing ChainFiliatesJS on your Web App or dApp, **it is highly recommended to load ChainFiliatesJS on every page**. This way, no matter where the Campaign redirects your Referred Users, ChainFiliatesJS is installed to parse the current URL immediately.
:::

### Using with `<script>`

```html
<script src="https://cdn.jsdelivr.net/npm/@chainfiliates/js"></script>
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
:::note
`window.ChainFiliatesLoaders` can be used to register a function that will execute when ChainFiliatesJS loads onto the page.
:::


### Using as an NPM Package

1. Install the package

```shell
# npm
npm i @chainfiliates/js

# yarn
yarn add @chainfiliates/js
```

2. Import the package into your project and you're good to go (with typescript compatibility)

```javascript
import { ChainFiliates } from "@chainfiliates/js";

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
