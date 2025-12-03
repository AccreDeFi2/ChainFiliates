import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("ChainFiliates", function () {
  async function deployFixture() {
    const [owner, treasury, business, affiliate, customer] = await ethers.getSigners();

    // Deploy mock USDC
    const MockToken = await ethers.getContractFactory("MockERC20");
    const usdc = await MockToken.deploy("USD Coin", "USDC", 6);
    
    // Mint USDC to business and customer
    await usdc.mint(business.address, ethers.parseUnits("10000", 6));
    await usdc.mint(customer.address, ethers.parseUnits("10000", 6));

    // Deploy Factory
    const Factory = await ethers.getContractFactory("ChainFiliatesFactory");
    const factory = await Factory.deploy(treasury.address, await usdc.getAddress());

    return { factory, usdc, owner, treasury, business, affiliate, customer };
  }

  describe("Factory", function () {
    it("Should register a business and deploy splitter", async function () {
      const { factory, usdc, business } = await loadFixture(deployFixture);

      // Approve subscription fee
      const monthlyFee = ethers.parseUnits("150", 6);
      await usdc.connect(business).approve(await factory.getAddress(), monthlyFee);

      // Register business
      const tx = await factory.connect(business).registerBusiness(
        business.address, // business wallet
        1000, // 10% commission
        false // monthly
      );

      const receipt = await tx.wait();
      
      // Get splitter address from event
      const event = receipt?.logs.find(
        (log: any) => log.fragment?.name === "BusinessRegistered"
      );
      
      expect(event).to.not.be.undefined;

      // Verify business is registered
      const info = await factory.getBusinessInfo(business.address);
      expect(info.active).to.be.true;
      expect(info.defaultCommissionBps).to.equal(1000);
    });

    it("Should handle annual subscription", async function () {
      const { factory, usdc, business } = await loadFixture(deployFixture);

      const annualFee = ethers.parseUnits("1500", 6);
      await usdc.connect(business).approve(await factory.getAddress(), annualFee);

      await factory.connect(business).registerBusiness(
        business.address,
        1000,
        true // annual
      );

      const info = await factory.getBusinessInfo(business.address);
      const daysLeft = await factory.daysUntilExpiry(business.address);
      
      expect(daysLeft).to.be.greaterThan(360); // ~365 days
    });
  });

  describe("AffiliateSplitter", function () {
    async function deployWithSplitter() {
      const base = await loadFixture(deployFixture);
      const { factory, usdc, business, treasury } = base;

      // Register business
      const monthlyFee = ethers.parseUnits("150", 6);
      await usdc.connect(business).approve(await factory.getAddress(), monthlyFee);
      await factory.connect(business).registerBusiness(business.address, 1000, false);

      // Get splitter
      const splitterAddress = await factory.getSplitterByOwner(business.address);
      const splitter = await ethers.getContractAt("AffiliateSplitter", splitterAddress);

      return { ...base, splitter, splitterAddress };
    }

    it("Should split ETH payment correctly", async function () {
      const { splitter, treasury, business, affiliate, customer } = await loadFixture(deployWithSplitter);

      const paymentAmount = ethers.parseEther("1"); // 1 ETH

      const treasuryBefore = await ethers.provider.getBalance(treasury.address);
      const affiliateBefore = await ethers.provider.getBalance(affiliate.address);
      const businessBefore = await ethers.provider.getBalance(business.address);

      // Customer pays
      await splitter.connect(customer).payWithETH(affiliate.address, { value: paymentAmount });

      const treasuryAfter = await ethers.provider.getBalance(treasury.address);
      const affiliateAfter = await ethers.provider.getBalance(affiliate.address);
      const businessAfter = await ethers.provider.getBalance(business.address);

      // 5% platform fee = 0.05 ETH
      expect(treasuryAfter - treasuryBefore).to.equal(ethers.parseEther("0.05"));
      
      // 10% affiliate commission = 0.1 ETH
      expect(affiliateAfter - affiliateBefore).to.equal(ethers.parseEther("0.1"));
      
      // 85% to business = 0.85 ETH
      expect(businessAfter - businessBefore).to.equal(ethers.parseEther("0.85"));
    });

    it("Should split ERC20 payment correctly", async function () {
      const { splitter, splitterAddress, usdc, treasury, business, affiliate, customer } = await loadFixture(deployWithSplitter);

      const paymentAmount = ethers.parseUnits("100", 6); // $100 USDC

      // Approve splitter
      await usdc.connect(customer).approve(splitterAddress, paymentAmount);

      const treasuryBefore = await usdc.balanceOf(treasury.address);
      const affiliateBefore = await usdc.balanceOf(affiliate.address);
      const businessBefore = await usdc.balanceOf(business.address);

      // Customer pays
      await splitter.connect(customer).payWithToken(
        await usdc.getAddress(),
        paymentAmount,
        affiliate.address
      );

      const treasuryAfter = await usdc.balanceOf(treasury.address);
      const affiliateAfter = await usdc.balanceOf(affiliate.address);
      const businessAfter = await usdc.balanceOf(business.address);

      // 5% platform fee = $5
      expect(treasuryAfter - treasuryBefore).to.equal(ethers.parseUnits("5", 6));
      
      // 10% affiliate commission = $10
      expect(affiliateAfter - affiliateBefore).to.equal(ethers.parseUnits("10", 6));
      
      // 85% to business = $85
      expect(businessAfter - businessBefore).to.equal(ethers.parseUnits("85", 6));
    });

    it("Should handle direct payment (no affiliate)", async function () {
      const { splitter, treasury, business, customer } = await loadFixture(deployWithSplitter);

      const paymentAmount = ethers.parseEther("1");

      const treasuryBefore = await ethers.provider.getBalance(treasury.address);
      const businessBefore = await ethers.provider.getBalance(business.address);

      await splitter.connect(customer).payDirectETH({ value: paymentAmount });

      const treasuryAfter = await ethers.provider.getBalance(treasury.address);
      const businessAfter = await ethers.provider.getBalance(business.address);

      // 5% platform fee
      expect(treasuryAfter - treasuryBefore).to.equal(ethers.parseEther("0.05"));
      
      // 95% to business (no affiliate)
      expect(businessAfter - businessBefore).to.equal(ethers.parseEther("0.95"));
    });

    it("Should allow custom commission per affiliate", async function () {
      const { splitter, treasury, business, affiliate, customer } = await loadFixture(deployWithSplitter);

      // Set custom 20% commission for this affiliate
      await splitter.connect(business).setAffiliateCommission(affiliate.address, 2000);

      const paymentAmount = ethers.parseEther("1");

      const affiliateBefore = await ethers.provider.getBalance(affiliate.address);

      await splitter.connect(customer).payWithETH(affiliate.address, { value: paymentAmount });

      const affiliateAfter = await ethers.provider.getBalance(affiliate.address);

      // 20% commission = 0.2 ETH
      expect(affiliateAfter - affiliateBefore).to.equal(ethers.parseEther("0.2"));
    });

    it("Should reject payment when deactivated", async function () {
      const { splitter, business, affiliate, customer } = await loadFixture(deployWithSplitter);

      await splitter.connect(business).deactivate();

      await expect(
        splitter.connect(customer).payWithETH(affiliate.address, { value: ethers.parseEther("1") })
      ).to.be.revertedWithCustomError(splitter, "InactiveContract");
    });
  });
});

// Mock ERC20 for testing
// Add this to contracts/mocks/MockERC20.sol
