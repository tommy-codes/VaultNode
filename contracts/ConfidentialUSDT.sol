// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {FHE, externalEuint64, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {ERC7984} from "@openzeppelin/confidential-contracts/token/ERC7984/ERC7984.sol";

contract ConfidentialUSDT is ERC7984, SepoliaConfig {
    struct StakeInfo {
        euint64 amount;
        uint64 unlockTimestamp;
        bool active;
    }

    address private _owner;
    mapping(address account => StakeInfo) private _stakes;
    mapping(address account => bool) private _testTokensClaimed;

    uint64 public constant TEST_FAUCET_AMOUNT = 1_000_000_000;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TokensMinted(address indexed account, euint64 amount);
    event TokensStaked(address indexed account, euint64 amount, uint64 unlockTimestamp);
    event TokensWithdrawn(address indexed account, euint64 amount);
    event TestTokensClaimed(address indexed account, euint64 amount);

    error ConfidentialUSDTAlreadyStaked(address account);
    error ConfidentialUSDTNoStake(address account);
    error ConfidentialUSDTStakeLocked(uint64 unlockTimestamp);
    error ConfidentialUSDTInvalidLockDuration();
    error ConfidentialUSDTInvalidAddress(address account);
    error ConfidentialUSDTTestTokensAlreadyClaimed(address account);

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not authorized");
        _;
    }

    constructor(string memory contractURI_) ERC7984("Confidential USDT", "cUSDT", contractURI_) {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function owner() external view returns (address) {
        return _owner;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) {
            revert ConfidentialUSDTInvalidAddress(newOwner);
        }
        address previousOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    function mint(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external onlyOwner returns (euint64 mintedAmount) {
        if (to == address(0)) {
            revert ConfidentialUSDTInvalidAddress(to);
        }

        euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
        mintedAmount = _mint(to, amount);

        FHE.allow(mintedAmount, to);
        FHE.allowThis(mintedAmount);

        emit TokensMinted(to, mintedAmount);
    }

    function claimTestTokens() external returns (euint64 mintedAmount) {
        if (_testTokensClaimed[msg.sender]) {
            revert ConfidentialUSDTTestTokensAlreadyClaimed(msg.sender);
        }

        _testTokensClaimed[msg.sender] = true;

        euint64 amount = FHE.asEuint64(TEST_FAUCET_AMOUNT);
        mintedAmount = _mint(msg.sender, amount);

        FHE.allow(mintedAmount, msg.sender);
        FHE.allowThis(mintedAmount);

        emit TestTokensClaimed(msg.sender, mintedAmount);
    }

    function stake(
        externalEuint64 encryptedAmount,
        bytes calldata inputProof,
        uint64 lockDuration
    ) external returns (uint64 unlockTimestamp, euint64 stakedAmount) {
        if (_stakes[msg.sender].active) {
            revert ConfidentialUSDTAlreadyStaked(msg.sender);
        }
        if (lockDuration == 0) {
            revert ConfidentialUSDTInvalidLockDuration();
        }

        euint64 amount = FHE.fromExternal(encryptedAmount, inputProof);
        euint64 transferred = _transfer(msg.sender, address(this), amount);

        unlockTimestamp = uint64(block.timestamp + lockDuration);

        StakeInfo storage info = _stakes[msg.sender];
        info.amount = transferred;
        info.unlockTimestamp = unlockTimestamp;
        info.active = true;

        FHE.allow(transferred, msg.sender);
        FHE.allowThis(transferred);

        stakedAmount = transferred;

        emit TokensStaked(msg.sender, transferred, unlockTimestamp);
    }

    function withdraw() external returns (euint64 withdrawnAmount) {
        StakeInfo storage info = _stakes[msg.sender];
        if (!info.active) {
            revert ConfidentialUSDTNoStake(msg.sender);
        }
        if (block.timestamp < info.unlockTimestamp) {
            revert ConfidentialUSDTStakeLocked(info.unlockTimestamp);
        }

        euint64 amount = info.amount;
        withdrawnAmount = _transfer(address(this), msg.sender, amount);

        FHE.allow(withdrawnAmount, msg.sender);
        FHE.allowThis(withdrawnAmount);

        delete _stakes[msg.sender];

        emit TokensWithdrawn(msg.sender, withdrawnAmount);
    }

    function stakeInfo(address account)
        external
        view
        returns (euint64 amount, uint64 unlockTimestamp, bool active)
    {
        StakeInfo storage info = _stakes[account];
        amount = info.amount;
        unlockTimestamp = info.unlockTimestamp;
        active = info.active;
    }

    function hasActiveStake(address account) external view returns (bool) {
        return _stakes[account].active;
    }

    function canWithdraw(address account) external view returns (bool) {
        StakeInfo storage info = _stakes[account];
        return info.active && block.timestamp >= info.unlockTimestamp;
    }

    function testTokensClaimed(address account) external view returns (bool) {
        return _testTokensClaimed[account];
    }
}
