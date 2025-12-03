<div align="center">
  <h1>ChainFiliates Programs</h1>
</div>

<div align="center">
  <strong>Embed Partner Programs and Data Collection</strong>
</div>

<div align="center">
  Accelerate your partner management processes with technology integrated into blockchains and decentralised data networks, capable of facilitating link sharing processes that culminate in conversion tracking and automatic reward distribution.
</div>
<br/>

![ChainFiliates Banner](https://chainfiliates-pub.s3.amazonaws.com/misc/banners/Banner.jpg)

<div align="center">
   <a href="https://ts-docs.programs.chainfiliates.so">Typescript Docs</a>
   <span> | </span>
   <a href="https://www.chainfiliates.so">Website</a>
   <span> | </span>
   <a href="https://docs.chainfiliates.so">Full Docs</a>
   <span> | </span>
   <a href="https://go.chainfiliates.so/discord">Discord</a>
   <span> | </span>
   <a href="https://go.chainfiliates.so/twitter">Twitter</a>
</div>

# Programs

**Programs** is a monorepo containing the packages necessary to integrate ChainFiliates's partner programs & data collection technology into a new dApp or software environment.
These features include:

- Authentication
- Link sharing over decentralised data
- Wallet connections
- Affiliate marketing campaigns with crypto rewards

> **Project Status:**  
> ChainFiliates is live and ready to accept newly created campaigns whereby rewards can be distributed to partners that refer people to the campaign's configured destination URL. Campaigns can also include reference to Smart Contract events, whereby wallets can be connected upon invite link visits, and then tracked as referred users when their associated wallet triggers a tracked Smart Contract events.
>
> **Upcoming changes:**  
> ChainFiliates is preparing a new release where the link sharing and conversion tracking features can also be used purely for data collection and insights. While affiliate marketing rewards can still be associated to conversions, ChainFiliates is evolving the user expeirence to offer value through insights.

## Packages

| Name         | Package                                         | Description                                                                                                                                  |
| ------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth         | [@chainfiliates/auth](packages/auth)                 | Produce an authenticated DID using a wallet connection like Metamask, ArConnect, etc. and interface with the Ceramic Network or ChainFiliates's APIs |
| Campaigns    | [@chainfiliates/campaigns](packages/campaigns)       | Create your own ChainFiliates Campaigns directly within your dApp                                                                                    |
| Partnerships | [@chainfiliates/partnerships](packages/partnerships) | Manage your users' partnerships against one or more Campaigns                                                                                |
| Shared       | [@chainfiliates/shared](packages/shared)             | A package of facets shared throughout the ChainFiliates codebase.                                                                                    |
| CLI          | [@chainfiliates/cli](packages/cli)                   | Manage your ChainFiliates Campaigns directly from your Terminal                                                                                      |

> To learn more about each individual package, navigate to the relevant package folder.

## Quick start

Learn the basics by creating a new Camapign and indexing it on ChainFiliates with the ChainFiliates CLI. [CLI guide →](packages/cli)

## Installation and usage

Full documentation on installation and usage can be found on the [ChainFiliates documentation site →](https://docs.chainfiliates.so/)

## Troubleshooting

- For Typescript docs: [https://ts-docs.programs.chainfiliates.so](https://ts-docs.programs.chainfiliates.so)
- For questions, support, and discussions: [Join the ChainFiliates Discord](https://go.chainfiliates.so/discord)
- For bugs and feature requests: [Create an issue on Github](https://github.com/chainfiliateslabs/programs/issues)

## Contributing

We are happy to accept small and large contributions, feel free to make a suggestion or submit a pull request.

This monorepo is managed with [Nx](https://nx.dev).

### Building the Repo

Run `yarn build` or `npx nx build <package_name>` to build the library.

## Maintainers

- rsoury ([@rsoury](https://github.com/rsoury))
- victorshevtsov ([@victorshevtsov](https://github.com/victorshevtsov))

## License

Fully open source and licensed under MIT.
