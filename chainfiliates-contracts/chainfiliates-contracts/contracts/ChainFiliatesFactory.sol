// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AffiliateSplitter.sol";

/**
 * @title ChainFiliatesFactory
 * @notice Deploys AffiliateSplitter contracts and manages subscriptions
 * @dev 
 *   - $150/month or $1500/year subscription (in USDC or accepted stablecoin)
 *   - Deploys a unique splitter per business
 *   - Can deactivate splitters for non-payment or bypass violations
 */
contract ChainFiliatesFactory is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    uint256 public constant MONTHLY_FEE = 150 * 10**6;  // $150 USDC (6 decimals)
    uint256 public constant ANNUAL_FEE = 1500 * 10**6;  // $1500 USDC (save 2 months)
    uint256 public constant MONTH = 30 days;
    uint256 public constant YEAR = 365 days;

    // ============ State ============
    address public treasury;
    IERC20 public paymentToken; // USDC or accepted stablecoin
    
    // Business data
    struct Business {
        address splitter;
        address owner;
        address wallet;
        uint256 subscriptionEnd;
        bool active;
        uint256 defaultCommissionBps;
        uint256 createdAt;
    }
    
    mapping(address => Business) public businesses; // businessOwner => Business
    mapping(address => address) public splitterToOwner; // splitter => businessOwner
    address[] public allSplitters;

    // ============ Events ============
    event BusinessRegistered(
        address indexed owner,
        address indexed splitter,
        address wallet,
        uint256 subscriptionEnd
    );
    event SubscriptionRenewed(
        address indexed owner,
        uint256 amount,
        uint256 newEnd,
        bool isAnnual
    );
    event BusinessDeactivated(address indexed owner, address indexed splitter, string reason);
    event BusinessReactivated(address indexed owner, address indexed splitter);
    event TreasuryUpdated(address indexed newTreasury);
    event PaymentTokenUpdated(address indexed newToken);

    // ============ Errors ============
    error AlreadyRegistered();
    error NotRegistered();
    error InvalidAddress();
    error SubscriptionExpired();
    error InsufficientPayment();
    error BusinessNotActive();

    // ============ Constructor ============
    constructor(
        address _treasury,
        address _paymentToken
    ) Ownable(msg.sender) {
        if (_treasury == address(0)) revert InvalidAddress();
        if (_paymentToken == address(0)) revert InvalidAddress();
        
        treasury = _treasury;
        paymentToken = IERC20(_paymentToken);
    }

    // ============ Registration ============

    /**
     * @notice Register a new business and deploy their splitter
     * @param businessWallet Wallet where business receives payments
     * @param defaultCommissionBps Default affiliate commission (e.g., 1000 = 10%)
     * @param annual True for annual subscription ($1500), false for monthly ($150)
     */
    function registerBusiness(
        address businessWallet,
        uint256 defaultCommissionBps,
        bool annual
    ) external nonReentrant returns (address splitter) {
        if (businesses[msg.sender].splitter != address(0)) revert AlreadyRegistered();
        if (businessWallet == address(0)) revert InvalidAddress();

        // Collect subscription payment
        uint256 fee = annual ? ANNUAL_FEE : MONTHLY_FEE;
        uint256 duration = annual ? YEAR : MONTH;
        
        paymentToken.safeTransferFrom(msg.sender, treasury, fee);

        // Deploy splitter
        splitter = address(new AffiliateSplitter(
            treasury,
            businessWallet,
            msg.sender,
            defaultCommissionBps
        ));

        // Record business
        businesses[msg.sender] = Business({
            splitter: splitter,
            owner: msg.sender,
            wallet: businessWallet,
            subscriptionEnd: block.timestamp + duration,
            active: true,
            defaultCommissionBps: defaultCommissionBps,
            createdAt: block.timestamp
        });

        splitterToOwner[splitter] = msg.sender;
        allSplitters.push(splitter);

        emit BusinessRegistered(msg.sender, splitter, businessWallet, block.timestamp + duration);
    }

    // ============ Subscription Management ============

    /**
     * @notice Renew subscription
     * @param annual True for annual ($1500), false for monthly ($150)
     */
    function renewSubscription(bool annual) external nonReentrant {
        Business storage biz = businesses[msg.sender];
        if (biz.splitter == address(0)) revert NotRegistered();

        uint256 fee = annual ? ANNUAL_FEE : MONTHLY_FEE;
        uint256 duration = annual ? YEAR : MONTH;

        paymentToken.safeTransferFrom(msg.sender, treasury, fee);

        // Extend from current end or from now if expired
        uint256 startFrom = biz.subscriptionEnd > block.timestamp 
            ? biz.subscriptionEnd 
            : block.timestamp;
        
        biz.subscriptionEnd = startFrom + duration;

        // Reactivate if was deactivated for non-payment
        if (!biz.active) {
            biz.active = true;
            AffiliateSplitter(biz.splitter).activate();
            emit BusinessReactivated(msg.sender, biz.splitter);
        }

        emit SubscriptionRenewed(msg.sender, fee, biz.subscriptionEnd, annual);
    }

    /**
     * @notice Check and deactivate expired subscriptions (callable by anyone)
     * @param businessOwner Address of the business owner to check
     */
    function checkSubscription(address businessOwner) external {
        Business storage biz = businesses[businessOwner];
        if (biz.splitter == address(0)) revert NotRegistered();
        
        if (biz.active && block.timestamp > biz.subscriptionEnd) {
            biz.active = false;
            AffiliateSplitter(biz.splitter).deactivate();
            emit BusinessDeactivated(businessOwner, biz.splitter, "subscription_expired");
        }
    }

    // ============ Admin Functions (ChainFiliates) ============

    /**
     * @notice Deactivate a business for bypass violation
     * @param businessOwner Address of the violating business
     */
    function deactivateForViolation(address businessOwner) external onlyOwner {
        Business storage biz = businesses[businessOwner];
        if (biz.splitter == address(0)) revert NotRegistered();
        
        biz.active = false;
        AffiliateSplitter(biz.splitter).deactivate();
        emit BusinessDeactivated(businessOwner, biz.splitter, "bypass_violation");
    }

    /**
     * @notice Reactivate a business after resolving issues
     * @param businessOwner Address of the business
     */
    function reactivateBusiness(address businessOwner) external onlyOwner {
        Business storage biz = businesses[businessOwner];
        if (biz.splitter == address(0)) revert NotRegistered();
        if (block.timestamp > biz.subscriptionEnd) revert SubscriptionExpired();
        
        biz.active = true;
        AffiliateSplitter(biz.splitter).activate();
        emit BusinessReactivated(businessOwner, biz.splitter);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        if (_newTreasury == address(0)) revert InvalidAddress();
        treasury = _newTreasury;
        emit TreasuryUpdated(_newTreasury);
    }

    function setPaymentToken(address _newToken) external onlyOwner {
        if (_newToken == address(0)) revert InvalidAddress();
        paymentToken = IERC20(_newToken);
        emit PaymentTokenUpdated(_newToken);
    }

    // ============ View Functions ============

    function isSubscriptionActive(address businessOwner) external view returns (bool) {
        Business storage biz = businesses[businessOwner];
        return biz.active && block.timestamp <= biz.subscriptionEnd;
    }

    function getBusinessInfo(address businessOwner) external view returns (
        address splitter,
        address wallet,
        uint256 subscriptionEnd,
        bool active,
        uint256 defaultCommissionBps
    ) {
        Business storage biz = businesses[businessOwner];
        return (
            biz.splitter,
            biz.wallet,
            biz.subscriptionEnd,
            biz.active,
            biz.defaultCommissionBps
        );
    }

    function getSplitterByOwner(address businessOwner) external view returns (address) {
        return businesses[businessOwner].splitter;
    }

    function getOwnerBySplitter(address splitter) external view returns (address) {
        return splitterToOwner[splitter];
    }

    function totalBusinesses() external view returns (uint256) {
        return allSplitters.length;
    }

    function daysUntilExpiry(address businessOwner) external view returns (int256) {
        Business storage biz = businesses[businessOwner];
        if (biz.splitter == address(0)) return -1;
        
        if (block.timestamp > biz.subscriptionEnd) {
            return -int256((block.timestamp - biz.subscriptionEnd) / 1 days);
        }
        return int256((biz.subscriptionEnd - block.timestamp) / 1 days);
    }
}
