// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const path = require("path");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/**
 * Used to redirect from old docs to new docs
 */
const {
	getRedirectsFromMapping
} = require("./config-utils/redirect/get-redirects-from-map");
const redirects = getRedirectsFromMapping(
	require("./config-utils/redirect/old-to-new-routes.json")
);

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "ChainFiliates Docs",
	tagline:
		"Helping people advertise and grow their Web3 brand with partnerships",
	favicon: "img/favicon.ico",

	url: "https://chainfiliateslabs.github.io",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/chainfiliates-referrals/",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "chainfiliateslabs",
	projectName: "chainfiliates-referrals",
	trailingSlash: false,

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"]
	},
	plugins: [
		"docusaurus-plugin-sass",
		"@docusaurus/plugin-content-pages",
		"@docusaurus/plugin-debug",
		"@docusaurus/plugin-sitemap",
		[
			"@docusaurus/plugin-content-docs",
			{
				routeBasePath: "/",
				sidebarPath: require.resolve("./sidebars.js"),
				// Please change this to your repo.
				// Remove this to remove the "edit this page" links.
				editUrl: "https://github.com/chainfiliateslabs/chainfiliates-docs/tree/main/"
			}
		],
		// This plugin enables tailwind
		async function myPlugin(context, options) {
			return {
				name: "docusaurus-tailwindcss",
				configurePostCss(postcssOptions) {
					// Appends TailwindCSS and AutoPrefixer.
					postcssOptions.plugins.push(require("tailwindcss"));
					postcssOptions.plugins.push(require("autoprefixer"));
					return postcssOptions;
				}
			};
		},
		[
			// This plugin is deactivated on devlopment, only runs on production
			"@docusaurus/plugin-client-redirects",
			{
				redirects: redirects
			}
		],
		process.env.GTAG_TRACKING_ID
			? [
					"@docusaurus/plugin-google-gtag",
					{
						trackingID: process.env.GTAG_TRACKING_ID,
						anonymizeIP: true
					}
			  ]
			: ""
	].filter((p) => p !== ""),

	// algolia: { // INITIAL TODO to activate algolia search. Fill according to your needs
	//     appId: '',
	//     apiKey: '',
	//     indexName: '',
	//     contextualSearch: true,
	// },

	themes: [
		[
			path.resolve(__dirname, "./node_modules/@docusaurus/theme-classic"),
			{
				customCss: [
					require.resolve(
						"./node_modules/modern-normalize/modern-normalize.css"
					),
					require.resolve("./src/styles/custom.scss")
				]
			}
		]
		// path.resolve(__dirname, './node_modules/@docusaurus/theme-search-algolia'), // INITIAL TODO if needed to activate algolia
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			// INITIAL TODO: Replace with your project's social card
			image: "img/docusaurus-social-card.jpg",
			navbar: {
				hideOnScroll: true,
				logo: {
					alt: "Site Logo", // no need to change, it's the default for accessibility reasons
					src: "logos/ChainFiliatesLearnLogomark.svg",
					srcDark: "logos/ChainFiliatesLearnLogomark_drk.svg",
					target: "_self",
					href: "/"
				},
				items: [
					{
						type: "docSidebar",
						sidebarId: "guide",
						position: "left",
						label: "Guide"
					},
					{
						type: "docSidebar",
						sidebarId: "ecosystem",
						label: "Ecosystem",
						position: "left"
					},

					// Right side starts here
					{
						type: "search",
						position: "right"
					},
					{
						label: "Stay tuned",
						position: "right",
						items: [
							{
								href: "https://chainfiliates.so",
								label: "Our Homepage",
								target: "_blank",
								rel: null
							},
							{
								href: "https://chainfiliates.so/blog",
								label: "Blog",
								target: "_blank",
								rel: null
							}
						]
					},
					{
						// INITIAL TODO may change if you would want different action from user
						type: "custom-cta",
						position: "right",
						label: "Register your interest",
						target: "_blank",
						href: "https://www.chainfiliates.so/brands/register-interest"
					},
					{
						type: "custom-separator",
						position: "right"
					},
					{
						type: "custom-iconLink",
						position: "right",
						icon: {
							alt: "twitter logo",
							src: `/logos/twitter.svg`,
							href: "https://twitter.com/chainfiliates_web3",
							target: "_blank"
						}
					},
					{
						type: "custom-iconLink",
						position: "right",
						icon: {
							alt: "github logo",
							src: `/logos/github.svg`,
							href: "https://github.com/chainfiliateslabs/", // INITIAL TODO
							target: "_blank"
						}
					},
					{
						type: "custom-iconLink",
						position: "right",
						icon: {
							alt: "discord logo",
							src: `/logos/discord.svg`,
							href: "https://go.chainfiliates.so/discord",
							target: "_blank"
						}
					}
				]
			},
			colorMode: {
				defaultMode: "light"
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme
			}
		})
};

module.exports = config;
