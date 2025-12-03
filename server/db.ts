import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, campaigns, partnerships, referralLinks, referralEvents, campaignConfigs, blockchainConfigs, subscriptions, billingTransactions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Campaign queries
export async function createCampaign(data: typeof campaigns.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(campaigns).values(data);
  return result;
}

export async function getCampaignById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCampaignsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
}

export async function updateCampaign(id: number, data: Partial<typeof campaigns.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(campaigns).set(data).where(eq(campaigns.id, id));
}

// Partnership queries
export async function createPartnership(data: typeof partnerships.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(partnerships).values(data);
}

export async function getPartnershipsByCampaignId(campaignId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(partnerships).where(eq(partnerships.campaignId, campaignId));
}

export async function getPartnershipById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(partnerships).where(eq(partnerships.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePartnership(id: number, data: Partial<typeof partnerships.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(partnerships).set(data).where(eq(partnerships.id, id));
}

// Referral link queries
export async function createReferralLink(data: typeof referralLinks.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(referralLinks).values(data);
}

export async function getReferralLinkByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(referralLinks).where(eq(referralLinks.linkToken, token)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getReferralLinksByPartnershipId(partnershipId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(referralLinks).where(eq(referralLinks.partnershipId, partnershipId));
}

export async function updateReferralLink(id: number, data: Partial<typeof referralLinks.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(referralLinks).set(data).where(eq(referralLinks.id, id));
}

// Referral event queries
export async function createReferralEvent(data: typeof referralEvents.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(referralEvents).values(data);
}

export async function getReferralEventsByReferralLinkId(referralLinkId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(referralEvents).where(eq(referralEvents.referralLinkId, referralLinkId));
}

export async function updateReferralEvent(id: number, data: Partial<typeof referralEvents.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(referralEvents).set(data).where(eq(referralEvents.id, id));
}

// Campaign config queries
export async function createCampaignConfig(data: typeof campaignConfigs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(campaignConfigs).values(data);
}

export async function getCampaignConfigByCampaignId(campaignId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(campaignConfigs).where(eq(campaignConfigs.campaignId, campaignId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateCampaignConfig(campaignId: number, data: Partial<typeof campaignConfigs.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(campaignConfigs).set(data).where(eq(campaignConfigs.campaignId, campaignId));
}

// Blockchain configuration queries
export async function getBlockchainConfigs() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(blockchainConfigs).where(eq(blockchainConfigs.isActive, true));
}

export async function getBlockchainConfigByChainId(chainId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(blockchainConfigs).where(eq(blockchainConfigs.chainId, chainId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Subscription queries
export async function getOrCreateSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  
  // Create new subscription
  await db.insert(subscriptions).values({ userId, status: "active" });
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getSubscriptionByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateSubscription(userId: number, data: Partial<typeof subscriptions.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(subscriptions).set(data).where(eq(subscriptions.userId, userId));
}

// Billing transaction queries
export async function createBillingTransaction(data: typeof billingTransactions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(billingTransactions).values(data);
}

export async function getBillingTransactionsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(billingTransactions).where(eq(billingTransactions.userId, userId));
}

export async function updateBillingTransaction(id: number, data: Partial<typeof billingTransactions.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(billingTransactions).set(data).where(eq(billingTransactions.id, id));
}
