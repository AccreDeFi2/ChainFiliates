import { int, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

/**
 * Token metadata cache table - stores ERC20 token information
 * This allows us to cache token symbol, decimals, and other metadata
 * to avoid repeated on-chain calls
 */
export const tokenMetadata = mysqlTable("tokenMetadata", {
  id: int("id").autoincrement().primaryKey(),
  chainId: int("chainId").notNull(), // Blockchain chain ID
  tokenAddress: varchar("tokenAddress", { length: 255 }).notNull(), // ERC20 contract address
  symbol: varchar("symbol", { length: 64 }).notNull(), // Token symbol (e.g., "USDC")
  name: varchar("name", { length: 255 }), // Token name
  decimals: int("decimals").notNull(), // Token decimals (usually 18 or 6)
  totalSupply: varchar("totalSupply", { length: 255 }), // Total supply as string
  isValid: int("isValid").default(1).notNull(), // Whether the token is a valid ERC20
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TokenMetadata = typeof tokenMetadata.$inferSelect;
export type InsertTokenMetadata = typeof tokenMetadata.$inferInsert;
