import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createCampaign,
  getCampaignById,
  getCampaignsByUserId,
  updateCampaign,
  createPartnership,
  getPartnershipsByCampaignId,
  getPartnershipById,
  updatePartnership,
  createReferralLink,
  getReferralLinkByToken,
  getReferralLinksByPartnershipId,
  updateReferralLink,
  createReferralEvent,
  getReferralEventsByReferralLinkId,
  createCampaignConfig,
  getCampaignConfigByCampaignId,
  updateCampaignConfig,
  getOrCreateSubscription,
  getBillingTransactionsByUserId,
} from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Campaign management procedures
  campaigns: router({
    // Create a new campaign
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Campaign name is required"),
          description: z.string().optional(),
          chainId: z.number(),
          chainName: z.string(),
          rewardType: z.enum(["ERC20", "PST"]),
          rewardAddress: z.string().min(1, "Reward address is required"),
          rewardSymbol: z.string().optional(),
          rewardDecimals: z.number().default(18),
          rewardPerReferral: z.string().min(1, "Reward per referral is required"),
          campaignManagerAddress: z.string().min(1, "Campaign manager address is required"),
          totalBudget: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const campaign = await createCampaign({
          userId: ctx.user.id,
          ...input,
          status: "draft",
          totalDistributed: "0",
          totalReferrals: 0,
        });
        
        return campaign;
      }),

    // Get campaign by ID
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const campaign = await getCampaignById(input.id);
        if (!campaign) return null;
        
        // Verify ownership
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return campaign;
      }),

    // List all campaigns for the current user
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await getCampaignsByUserId(ctx.user.id);
      }),

    // Update campaign
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            status: z.enum(["draft", "active", "paused", "completed"]).optional(),
            totalBudget: z.string().optional(),
            totalDistributed: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const campaign = await getCampaignById(input.id);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await updateCampaign(input.id, input.data);
      }),
  }),

  // Partnership management procedures
  partnerships: router({
    // Create a partnership (add partner to campaign)
    create: protectedProcedure
      .input(
        z.object({
          campaignId: z.number(),
          partnerWallet: z.string().min(1, "Partner wallet is required"),
          partnerEmail: z.string().email().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const campaign = await getCampaignById(input.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await createPartnership({
          campaignId: input.campaignId,
          partnerWallet: input.partnerWallet,
          partnerEmail: input.partnerEmail,
          status: "pending",
          totalEarnings: "0",
          referralCount: 0,
        });
      }),

    // Get partnerships for a campaign
    getByCampaignId: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(async ({ ctx, input }) => {
        const campaign = await getCampaignById(input.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await getPartnershipsByCampaignId(input.campaignId);
      }),

    // Update partnership status
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "active", "inactive"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const partnership = await getPartnershipById(input.id);
        if (!partnership) throw new Error("Partnership not found");
        
        const campaign = await getCampaignById(partnership.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await updatePartnership(input.id, { status: input.status });
      }),
  }),

  // Referral link management procedures
  referralLinks: router({
    // Generate a new referral link
    create: protectedProcedure
      .input(
        z.object({
          partnershipId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const partnership = await getPartnershipById(input.partnershipId);
        if (!partnership) throw new Error("Partnership not found");
        
        const campaign = await getCampaignById(partnership.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        const linkToken = nanoid(12);
        return await createReferralLink({
          campaignId: partnership.campaignId,
          partnershipId: input.partnershipId,
          linkToken,
          clicks: 0,
          conversions: 0,
        });
      }),

    // Get referral links for a partnership
    getByPartnershipId: protectedProcedure
      .input(z.object({ partnershipId: z.number() }))
      .query(async ({ ctx, input }) => {
        const partnership = await getPartnershipById(input.partnershipId);
        if (!partnership) throw new Error("Partnership not found");
        
        const campaign = await getCampaignById(partnership.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await getReferralLinksByPartnershipId(input.partnershipId);
      }),

    // Track a referral click (public endpoint)
    trackClick: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const link = await getReferralLinkByToken(input.token);
        if (!link) throw new Error("Referral link not found");
        
        await updateReferralLink(link.id, {
          clicks: (link.clicks ?? 0) + 1,
        });
        
        return { success: true };
      }),
  }),

  // Referral event tracking
  referralEvents: router({
    // Record a referral event
    create: protectedProcedure
      .input(
        z.object({
          referralLinkId: z.number(),
          referrerAddress: z.string(),
          eventType: z.enum(["click", "conversion", "claim"]),
          rewardAmount: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const link = await getReferralLinkByToken("");
        if (!link) throw new Error("Referral link not found");
        
        const partnership = await getPartnershipById(link.partnershipId);
        if (!partnership) throw new Error("Partnership not found");
        
        const campaign = await getCampaignById(link.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await createReferralEvent({
          referralLinkId: input.referralLinkId,
          campaignId: link.campaignId,
          partnershipId: link.partnershipId,
          referrerAddress: input.referrerAddress,
          eventType: input.eventType,
          rewardAmount: input.rewardAmount,
          status: "pending",
        });
      }),

    // Get events for a referral link
    getByReferralLinkId: protectedProcedure
      .input(z.object({ referralLinkId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getReferralEventsByReferralLinkId(input.referralLinkId);
      }),
  }),

  // Campaign configuration
  campaignConfig: router({
    // Get campaign configuration
    get: protectedProcedure
      .input(z.object({ campaignId: z.number() }))
      .query(async ({ ctx, input }) => {
        const campaign = await getCampaignById(input.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await getCampaignConfigByCampaignId(input.campaignId);
      }),

    // Update campaign configuration
    update: protectedProcedure
      .input(
        z.object({
          campaignId: z.number(),
          data: z.object({
            whitelistEnabled: z.boolean().optional(),
            maxPartners: z.number().optional(),
            maxReferralsPerPartner: z.number().optional(),
            minRewardThreshold: z.string().optional(),
            payoutFrequency: z.enum(["manual", "daily", "weekly", "monthly"]).optional(),
            autoClaimEnabled: z.boolean().optional(),
            customMetadata: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const campaign = await getCampaignById(input.campaignId);
        if (!campaign) throw new Error("Campaign not found");
        
        if (campaign.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        
        return await updateCampaignConfig(input.campaignId, input.data);
      }),
   }),
  // Billing management
  billing: router({
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      return await getOrCreateSubscription(ctx.user.id);
    }),
    getTransactions: protectedProcedure.query(async ({ ctx }) => {
      return await getBillingTransactionsByUserId(ctx.user.id);
    }),
  }),
});
export type AppRouter = typeof appRouter;
