import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Campaigns table - stores ChainFiliates affiliate campaigns created by users
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users table
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  chainId: int("chainId").notNull(), // Ethereum chain ID (1 for mainnet, 5 for Goerli, etc.)
  chainName: varchar("chainName", { length: 64 }).notNull(), // e.g., "ethereum", "polygon", "arbitrum"
  rewardType: mysqlEnum("rewardType", ["ERC20", "PST"]).notNull(), // Reward token type
  rewardAddress: varchar("rewardAddress", { length: 255 }).notNull(), // Smart contract address
  rewardSymbol: varchar("rewardSymbol", { length: 64 }), // Token symbol (e.g., "USDC")
  rewardDecimals: int("rewardDecimals").default(18), // Token decimals
  rewardPerReferral: varchar("rewardPerReferral", { length: 255 }).notNull(), // Amount as string to preserve precision
  campaignManagerAddress: varchar("campaignManagerAddress", { length: 255 }).notNull(), // Campaign creator's wallet
  status: mysqlEnum("status", ["draft", "active", "paused", "completed"]).default("draft").notNull(),
  totalBudget: varchar("totalBudget", { length: 255 }), // Total rewards budget as string
  totalDistributed: varchar("totalDistributed", { length: 255 }).default("0"), // Total rewards distributed
  totalReferrals: int("totalReferrals").default(0), // Total referral count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * Partnerships table - tracks partners/affiliates in a campaign
 */
export const partnerships = mysqlTable("partnerships", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(), // Foreign key to campaigns
  partnerWallet: varchar("partnerWallet", { length: 255 }).notNull(), // Partner's wallet address
  partnerEmail: varchar("partnerEmail", { length: 320 }),
  status: mysqlEnum("status", ["pending", "active", "inactive"]).default("pending").notNull(),
  totalEarnings: varchar("totalEarnings", { length: 255 }).default("0"), // Total rewards earned
  referralCount: int("referralCount").default(0), // Number of successful referrals
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = typeof partnerships.$inferInsert;

/**
 * Referral links table - tracks unique referral links and their performance
 */
export const referralLinks = mysqlTable("referralLinks", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(), // Foreign key to campaigns
  partnershipId: int("partnershipId").notNull(), // Foreign key to partnerships
  linkToken: varchar("linkToken", { length: 255 }).notNull().unique(), // Unique referral token
  shortLink: varchar("shortLink", { length: 255 }), // Short URL representation
  clicks: int("clicks").default(0), // Number of times link was clicked
  conversions: int("conversions").default(0), // Number of successful conversions
  conversionRate: varchar("conversionRate", { length: 10 }).default("0"), // Percentage as string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReferralLink = typeof referralLinks.$inferSelect;
export type InsertReferralLink = typeof referralLinks.$inferInsert;

/**
 * Referral events table - tracks individual referral events and conversions
 */
export const referralEvents = mysqlTable("referralEvents", {
  id: int("id").autoincrement().primaryKey(),
  referralLinkId: int("referralLinkId").notNull(), // Foreign key to referralLinks
  campaignId: int("campaignId").notNull(), // Denormalized for easier querying
  partnershipId: int("partnershipId").notNull(), // Denormalized for easier querying
  referrerAddress: varchar("referrerAddress", { length: 255 }).notNull(), // Address that was referred
  eventType: mysqlEnum("eventType", ["click", "conversion", "claim"]).notNull(),
  transactionHash: varchar("transactionHash", { length: 255 }), // Blockchain transaction hash if applicable
  rewardAmount: varchar("rewardAmount", { length: 255 }), // Reward amount for this event
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReferralEvent = typeof referralEvents.$inferSelect;
export type InsertReferralEvent = typeof referralEvents.$inferInsert;

/**
 * Campaign configurations table - stores advanced settings and metadata
 */
export const campaignConfigs = mysqlTable("campaignConfigs", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull().unique(), // One config per campaign
  whitelistEnabled: boolean("whitelistEnabled").default(false), // Whether to restrict to whitelisted partners
  maxPartners: int("maxPartners"), // Maximum number of partners (null = unlimited)
  maxReferralsPerPartner: int("maxReferralsPerPartner"), // Max referrals per partner (null = unlimited)
  minRewardThreshold: varchar("minRewardThreshold", { length: 255 }), // Minimum reward before payout
  payoutFrequency: mysqlEnum("payoutFrequency", ["manual", "daily", "weekly", "monthly"]).default("manual"),
  autoClaimEnabled: boolean("autoClaimEnabled").default(false), // Auto-claim rewards
  customMetadata: text("customMetadata"), // JSON string for additional config
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CampaignConfig = typeof campaignConfigs.$inferSelect;
export type InsertCampaignConfig = typeof campaignConfigs.$inferInsert;


/**
 * Blockchain configurations table - stores RPC endpoints and network details
 */
export const blockchainConfigs = mysqlTable("blockchainConfigs", {
  id: int("id").autoincrement().primaryKey(),
  chainId: int("chainId").notNull().unique(),
  chainName: varchar("chainName", { length: 64 }).notNull(),
  displayName: varchar("displayName", { length: 128 }).notNull(),
  rpcUrl: varchar("rpcUrl", { length: 255 }).notNull(),
  explorerUrl: varchar("explorerUrl", { length: 255 }).notNull(),
  nativeCurrency: varchar("nativeCurrency", { length: 64 }).notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlockchainConfig = typeof blockchainConfigs.$inferSelect;
export type InsertBlockchainConfig = typeof blockchainConfigs.$inferInsert;

/**
 * Subscription billing table - tracks user subscriptions and billing
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "expired"]).default("active"),
  monthlyFee: varchar("monthlyFee", { length: 255 }).default("150"),
  commissionRate: varchar("commissionRate", { length: 10 }).default("5"),
  nextBillingDate: timestamp("nextBillingDate"),
  lastBilledDate: timestamp("lastBilledDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Billing transactions table - tracks all payments and commissions
 */
export const billingTransactions = mysqlTable("billingTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId"),
  transactionType: mysqlEnum("transactionType", ["subscription", "commission", "refund"]).notNull(),
  amount: varchar("amount", { length: 255 }).notNull(),
  commissionAmount: varchar("commissionAmount", { length: 255 }),
  totalPayoutAmount: varchar("totalPayoutAmount", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  transactionHash: varchar("transactionHash", { length: 255 }),
  paymentWallet: varchar("paymentWallet", { length: 255 }).default("0x0bc01063610a23883110c95fab8951c818f4b7e2"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BillingTransaction = typeof billingTransactions.$inferSelect;
export type InsertBillingTransaction = typeof billingTransactions.$inferInsert;
