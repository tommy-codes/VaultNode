import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { ConfidentialUSDT, ConfidentialUSDT__factory } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

describe("ConfidentialUSDT", function () {
  let signers: Signers;
  let token: ConfidentialUSDT;
  let contractAddress: string;

  before(async function () {
    const [deployer, alice, bob] = await ethers.getSigners();
    signers = { deployer, alice, bob };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("ConfidentialUSDT tests require the FHEVM mock. Skipping.");
      this.skip();
    }

    const factory = (await ethers.getContractFactory("ConfidentialUSDT", signers.deployer)) as ConfidentialUSDT__factory;
    token = (await factory.deploy("")) as ConfidentialUSDT;
    contractAddress = await token.getAddress();
  });

  async function mintTo(account: HardhatEthersSigner, amount: bigint) {
    const encrypted = await fhevm
      .createEncryptedInput(contractAddress, signers.deployer.address)
      .add64(amount)
      .encrypt();

    await (await token.mint(account.address, encrypted.handles[0], encrypted.inputProof)).wait();
  }

  async function decryptBalance(account: HardhatEthersSigner) {
    const encryptedBalance = await token.confidentialBalanceOf(account.address);
    if (encryptedBalance === ethers.ZeroHash) {
      return 0n;
    }

    const decrypted = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedBalance,
      contractAddress,
      account,
    );

    return BigInt(decrypted.toString());
  }

  it("mints confidential tokens to a recipient", async function () {
    const mintAmount = 1_000_000n;

    await mintTo(signers.alice, mintAmount);

    const balance = await decryptBalance(signers.alice);
    expect(balance).to.equal(mintAmount);
  });

  it("allows claiming test tokens only once", async function () {
    const faucetAmount = await token.TEST_FAUCET_AMOUNT();
    const claimTx = await token.connect(signers.alice).claimTestTokens();
    await claimTx.wait();

    const balance = await decryptBalance(signers.alice);
    expect(balance).to.equal(BigInt(faucetAmount.toString()));

    await expect(token.connect(signers.alice).claimTestTokens()).to.be.revertedWithCustomError(
      token,
      "ConfidentialUSDTTestTokensAlreadyClaimed",
    );
  });

  it("only allows the owner to mint", async function () {
    const mintAmount = 500n;
    const encrypted = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add64(mintAmount)
      .encrypt();

    await expect(
      token.connect(signers.alice).mint(signers.alice.address, encrypted.handles[0], encrypted.inputProof),
    ).to.be.revertedWith("Not authorized");
  });

  it("handles staking and withdrawal after lock expires", async function () {
    const mintAmount = 50_000n;
    const stakeAmount = 20_000n;
    const lockDuration = 3600; // 1 hour

    await mintTo(signers.alice, mintAmount);

    const stakeInput = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add64(stakeAmount)
      .encrypt();

    const stakeTx = await token
      .connect(signers.alice)
      .stake(stakeInput.handles[0], stakeInput.inputProof, lockDuration);
    const stakeReceipt = await stakeTx.wait();
    expect(stakeReceipt?.status).to.equal(1);

    const stakeInfo = await token.stakeInfo(signers.alice.address);
    expect(stakeInfo[2]).to.equal(true);
    expect(Number(stakeInfo[1])).to.be.greaterThan(0);

    await expect(token.connect(signers.alice).withdraw()).to.be.revertedWithCustomError(
      token,
      "ConfidentialUSDTStakeLocked",
    );

    await ethers.provider.send("evm_increaseTime", [lockDuration + 1]);
    await ethers.provider.send("evm_mine", []);

    const withdrawTx = await token.connect(signers.alice).withdraw();
    await withdrawTx.wait();

    const updatedStake = await token.stakeInfo(signers.alice.address);
    expect(updatedStake[2]).to.equal(false);

    const finalBalance = await decryptBalance(signers.alice);
    expect(finalBalance).to.equal(mintAmount);
  });
});
