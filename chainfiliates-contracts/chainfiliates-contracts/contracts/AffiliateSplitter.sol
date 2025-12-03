// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AffiliateSplitter
 * @notice Instant payment splitting for affiliate sales
 * @dev Deployed per business via ChainFiliatesFactory
 * 
 * Flow:
 * 1. Customer pays to this contract with affiliate address
 * 2. Contract instantly splits:
 *    - 5% to ChainFiliates (platform fee)
 *    - X% to Affiliate (commission)
 *    - Remainder to Business
 */
contract AffiliateSplitter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant PLATFORM_FEE_BPS = 500; // 5%

    // ============ State ============
    address public immutable chainFiliatesTreasury;
    address public businessWallet;
    uint256 public defaultCommissionBps; // e.g., 1000 = 10%
    bool public active;

    // Custom commission rates per affiliate (optional override)
    mapping(address => uint256) public affiliateCommissionBps;
    mapping(address => bool) public hasCustomCommission;

    // Stats
    uint256 public totalVolume;
    uint256 public totalPlatformFees;
    uint256 public totalAffiliatePayouts;
    mapping(address => uint256) public affiliateEarnings;

    // ============ Events ============
    event PaymentProcessed(
        address indexed customer,
        address indexed affiliate,
        address indexed token,
        uint256 amount,
        uint256 platformFee,
        uint256 affiliateCommission,
        uint256 businessAmount
    );
    event CommissionUpdated(address indexed affiliate, uint256 newBps);
    event DefaultCommissionUpdated(uint256 newBps);
    event BusinessWalletUpdated(address indexed newWallet);
    event SplitterActivated();
    event SplitterDeactivated();

    // ============ Errors ============
    error InactiveContract();
    error InvalidAddress();
    error InvalidAmount();
    error InvalidCommission();
    error TransferFailed();

    // ============ Constructor ============
    constructor(
        address _chainFiliatesTreasury,
        address _businessWallet,
        address _businessOwner,
        uint256 _defaultCommissionBps
    ) Ownable(_businessOwner) {
        if (_chainFiliatesTreasury == address(0)) revert InvalidAddress();
        if (_businessWallet == address(0)) revert InvalidAddress();
        if (_defaultCommissionBps > BASIS_POINTS - PLATFORM_FEE_BPS) revert InvalidCommission();

        chainFiliatesTreasury = _chainFiliatesTreasury;
        businessWallet = _businessWallet;
        defaultCommissionBps = _defaultCommissionBps;
        active = true;
    }

    // ============ Payment Functions ============

    /**
     * @notice Process a native ETH payment with affiliate attribution
     * @param affiliate Address of the referring affiliate
     */
    function payWithETH(address affiliate) external payable nonReentrant {
        if (!active) revert InactiveContract();
        if (msg.value == 0) revert InvalidAmount();
        if (affiliate == address(0)) revert InvalidAddress();

        (uint256 platformFee, uint256 commission, uint256 businessAmount) = _calculateSplit(msg.value, affiliate);

        // Transfer platform fee
        (bool success1, ) = chainFiliatesTreasury.call{value: platformFee}("");
        if (!success1) revert TransferFailed();

        // Transfer affiliate commission
        (bool success2, ) = affiliate.call{value: commission}("");
        if (!success2) revert TransferFailed();

        // Transfer to business
        (bool success3, ) = businessWallet.call{value: businessAmount}("");
        if (!success3) revert TransferFailed();

        _recordStats(affiliate, address(0), msg.value, platformFee, commission);

        emit PaymentProcessed(
            msg.sender,
            affiliate,
            address(0),
            msg.value,
            platformFee,
            commission,
            businessAmount
        );
    }

    /**
     * @notice Process an ERC20 payment with affiliate attribution
     * @param token ERC20 token address
     * @param amount Amount of tokens
     * @param affiliate Address of the referring affiliate
     */
    function payWithToken(
        address token,
        uint256 amount,
        address affiliate
    ) external nonReentrant {
        if (!active) revert InactiveContract();
        if (amount == 0) revert InvalidAmount();
        if (affiliate == address(0)) revert InvalidAddress();
        if (token == address(0)) revert InvalidAddress();

        IERC20 paymentToken = IERC20(token);

        // Pull tokens from customer
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        (uint256 platformFee, uint256 commission, uint256 businessAmount) = _calculateSplit(amount, affiliate);

        // Transfer platform fee
        paymentToken.safeTransfer(chainFiliatesTreasury, platformFee);

        // Transfer affiliate commission
        paymentToken.safeTransfer(affiliate, commission);

        // Transfer to business
        paymentToken.safeTransfer(businessWallet, businessAmount);

        _recordStats(affiliate, token, amount, platformFee, commission);

        emit PaymentProcessed(
            msg.sender,
            affiliate,
            token,
            amount,
            platformFee,
            commission,
            businessAmount
        );
    }

    /**
     * @notice Direct sale without affiliate (business keeps all minus platform fee)
     */
    function payDirectETH() external payable nonReentrant {
        if (!active) revert InactiveContract();
        if (msg.value == 0) revert InvalidAmount();

        uint256 platformFee = (msg.value * PLATFORM_FEE_BPS) / BASIS_POINTS;
        uint256 businessAmount = msg.value - platformFee;

        (bool success1, ) = chainFiliatesTreasury.call{value: platformFee}("");
        if (!success1) revert TransferFailed();

        (bool success2, ) = businessWallet.call{value: businessAmount}("");
        if (!success2) revert TransferFailed();

        totalVolume += msg.value;
        totalPlatformFees += platformFee;

        emit PaymentProcessed(
            msg.sender,
            address(0),
            address(0),
            msg.value,
            platformFee,
            0,
            businessAmount
        );
    }

    /**
     * @notice Direct ERC20 sale without affiliate
     */
    function payDirectToken(address token, uint256 amount) external nonReentrant {
        if (!active) revert InactiveContract();
        if (amount == 0) revert InvalidAmount();
        if (token == address(0)) revert InvalidAddress();

        IERC20 paymentToken = IERC20(token);
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 platformFee = (amount * PLATFORM_FEE_BPS) / BASIS_POINTS;
        uint256 businessAmount = amount - platformFee;

        paymentToken.safeTransfer(chainFiliatesTreasury, platformFee);
        paymentToken.safeTransfer(businessWallet, businessAmount);

        totalVolume += amount;
        totalPlatformFees += platformFee;

        emit PaymentProcessed(
            msg.sender,
            address(0),
            token,
            amount,
            platformFee,
            0,
            businessAmount
        );
    }

    // ============ Internal Functions ============

    function _calculateSplit(uint256 amount, address affiliate) 
        internal 
        view 
        returns (uint256 platformFee, uint256 commission, uint256 businessAmount) 
    {
        platformFee = (amount * PLATFORM_FEE_BPS) / BASIS_POINTS;
        
        uint256 commissionBps = hasCustomCommission[affiliate] 
            ? affiliateCommissionBps[affiliate] 
            : defaultCommissionBps;
        
        commission = (amount * commissionBps) / BASIS_POINTS;
        businessAmount = amount - platformFee - commission;
    }

    function _recordStats(
        address affiliate,
        address token,
        uint256 amount,
        uint256 platformFee,
        uint256 commission
    ) internal {
        totalVolume += amount;
        totalPlatformFees += platformFee;
        totalAffiliatePayouts += commission;
        affiliateEarnings[affiliate] += commission;
    }

    // ============ Admin Functions (Business Owner) ============

    function setDefaultCommission(uint256 _newBps) external onlyOwner {
        if (_newBps > BASIS_POINTS - PLATFORM_FEE_BPS) revert InvalidCommission();
        defaultCommissionBps = _newBps;
        emit DefaultCommissionUpdated(_newBps);
    }

    function setAffiliateCommission(address affiliate, uint256 _newBps) external onlyOwner {
        if (_newBps > BASIS_POINTS - PLATFORM_FEE_BPS) revert InvalidCommission();
        if (affiliate == address(0)) revert InvalidAddress();
        
        affiliateCommissionBps[affiliate] = _newBps;
        hasCustomCommission[affiliate] = true;
        emit CommissionUpdated(affiliate, _newBps);
    }

    function removeCustomCommission(address affiliate) external onlyOwner {
        hasCustomCommission[affiliate] = false;
        affiliateCommissionBps[affiliate] = 0;
        emit CommissionUpdated(affiliate, defaultCommissionBps);
    }

    function updateBusinessWallet(address _newWallet) external onlyOwner {
        if (_newWallet == address(0)) revert InvalidAddress();
        businessWallet = _newWallet;
        emit BusinessWalletUpdated(_newWallet);
    }

    function deactivate() external onlyOwner {
        active = false;
        emit SplitterDeactivated();
    }

    function activate() external onlyOwner {
        active = true;
        emit SplitterActivated();
    }

    // ============ View Functions ============

    function getCommissionRate(address affiliate) external view returns (uint256) {
        return hasCustomCommission[affiliate] 
            ? affiliateCommissionBps[affiliate] 
            : defaultCommissionBps;
    }

    function previewSplit(uint256 amount, address affiliate) 
        external 
        view 
        returns (uint256 platformFee, uint256 commission, uint256 businessAmount) 
    {
        return _calculateSplit(amount, affiliate);
    }
}
