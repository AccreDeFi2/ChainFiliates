CREATE TABLE `campaignConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`whitelistEnabled` boolean DEFAULT false,
	`maxPartners` int,
	`maxReferralsPerPartner` int,
	`minRewardThreshold` varchar(255),
	`payoutFrequency` enum('manual','daily','weekly','monthly') DEFAULT 'manual',
	`autoClaimEnabled` boolean DEFAULT false,
	`customMetadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaignConfigs_id` PRIMARY KEY(`id`),
	CONSTRAINT `campaignConfigs_campaignId_unique` UNIQUE(`campaignId`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`chainId` int NOT NULL,
	`chainName` varchar(64) NOT NULL,
	`rewardType` enum('ERC20','PST') NOT NULL,
	`rewardAddress` varchar(255) NOT NULL,
	`rewardSymbol` varchar(64),
	`rewardDecimals` int DEFAULT 18,
	`rewardPerReferral` varchar(255) NOT NULL,
	`campaignManagerAddress` varchar(255) NOT NULL,
	`status` enum('draft','active','paused','completed') NOT NULL DEFAULT 'draft',
	`totalBudget` varchar(255),
	`totalDistributed` varchar(255) DEFAULT '0',
	`totalReferrals` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`partnerWallet` varchar(255) NOT NULL,
	`partnerEmail` varchar(320),
	`status` enum('pending','active','inactive') NOT NULL DEFAULT 'pending',
	`totalEarnings` varchar(255) DEFAULT '0',
	`referralCount` int DEFAULT 0,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referralEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referralLinkId` int NOT NULL,
	`campaignId` int NOT NULL,
	`partnershipId` int NOT NULL,
	`referrerAddress` varchar(255) NOT NULL,
	`eventType` enum('click','conversion','claim') NOT NULL,
	`transactionHash` varchar(255),
	`rewardAmount` varchar(255),
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referralEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referralLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`partnershipId` int NOT NULL,
	`linkToken` varchar(255) NOT NULL,
	`shortLink` varchar(255),
	`clicks` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`conversionRate` varchar(10) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referralLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `referralLinks_linkToken_unique` UNIQUE(`linkToken`)
);
