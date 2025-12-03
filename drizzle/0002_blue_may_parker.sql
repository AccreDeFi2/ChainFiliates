CREATE TABLE `billingTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`campaignId` int,
	`transactionType` enum('subscription','commission','refund') NOT NULL,
	`amount` varchar(255) NOT NULL,
	`commissionAmount` varchar(255),
	`totalPayoutAmount` varchar(255),
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`transactionHash` varchar(255),
	`paymentWallet` varchar(255) DEFAULT '0x0bc01063610a23883110c95fab8951c818f4b7e2',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `billingTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blockchainConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chainId` int NOT NULL,
	`chainName` varchar(64) NOT NULL,
	`displayName` varchar(128) NOT NULL,
	`rpcUrl` varchar(255) NOT NULL,
	`explorerUrl` varchar(255) NOT NULL,
	`nativeCurrency` varchar(64) NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blockchainConfigs_id` PRIMARY KEY(`id`),
	CONSTRAINT `blockchainConfigs_chainId_unique` UNIQUE(`chainId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('active','paused','cancelled','expired') DEFAULT 'active',
	`monthlyFee` varchar(255) DEFAULT '150',
	`commissionRate` varchar(10) DEFAULT '5',
	`nextBillingDate` timestamp,
	`lastBilledDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
