import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

const CONTRACT_NAME = "ConfidentialUSDT";

async function resolveDeploymentAddress(hre: any, taskArguments: TaskArguments) {
  if (taskArguments.address) {
    return taskArguments.address as string;
  }

  const deployment = await hre.deployments.get(CONTRACT_NAME);
  return deployment.address as string;
}

task("task:token-address", "Prints the ConfidentialUSDT address").setAction(async function (_taskArguments, hre) {
  const address = await resolveDeploymentAddress(hre, _taskArguments);
  console.log(`${CONTRACT_NAME} address is ${address}`);
});

task("task:mint", "Mints ConfidentialUSDT to an address")
  .addParam("amount", "Amount to mint expressed in the smallest unit")
  .addOptionalParam("to", "Recipient address")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index to use", "0")
  .setAction(async function (taskArguments, hre) {
    const contractAddress = await resolveDeploymentAddress(hre, taskArguments);
    const { ethers, fhevm } = hre;

    const amount = BigInt(taskArguments.amount);
    const recipients = taskArguments.to ? [taskArguments.to] : [];

    const signerIndex = parseInt(taskArguments.signer, 10);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractAddress, signer);
    const target = recipients.length > 0 ? recipients[0] : signer.address;

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signer.address)
      .add64(amount)
      .encrypt();

    const tx = await contract.mint(target, encryptedInput.handles[0], encryptedInput.inputProof);
    console.log(`Mint tx sent: ${tx.hash}`);
    await tx.wait();
    console.log(`Minted to ${target}`);
  });

task("task:stake", "Stake ConfidentialUSDT tokens")
  .addParam("amount", "Amount to stake in the smallest unit")
  .addParam("duration", "Lock duration in seconds")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index to use", "0")
  .setAction(async function (taskArguments, hre) {
    const contractAddress = await resolveDeploymentAddress(hre, taskArguments);
    const { ethers, fhevm } = hre;

    const amount = BigInt(taskArguments.amount);
    const duration = BigInt(taskArguments.duration);

    const signerIndex = parseInt(taskArguments.signer, 10);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractAddress, signer);

    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signer.address)
      .add64(amount)
      .encrypt();

    const tx = await contract.stake(encryptedInput.handles[0], encryptedInput.inputProof, Number(duration));
    console.log(`Stake tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Stake confirmed in block ${receipt?.blockNumber ?? ""}`);
  });

task("task:withdraw", "Withdraw staked ConfidentialUSDT")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index to use", "0")
  .setAction(async function (taskArguments, hre) {
    const contractAddress = await resolveDeploymentAddress(hre, taskArguments);
    const { ethers } = hre;

    const signerIndex = parseInt(taskArguments.signer, 10);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractAddress, signer);

    const tx = await contract.withdraw();
    console.log(`Withdraw tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Withdraw confirmed in block ${receipt?.blockNumber ?? ""}`);
  });

task("task:claim", "Claim the default test token allocation")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index to use", "0")
  .setAction(async function (taskArguments, hre) {
    const contractAddress = await resolveDeploymentAddress(hre, taskArguments);
    const { ethers } = hre;

    const signerIndex = parseInt(taskArguments.signer, 10);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractAddress, signer);

    const tx = await contract.claimTestTokens();
    console.log(`Claim tx sent: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Claimed test tokens in block ${receipt?.blockNumber ?? ""}`);
  });

task("task:decrypt-stake", "Decrypt a staker position")
  .addOptionalParam("staker", "Staker address")
  .addOptionalParam("address", "Contract address override")
  .addOptionalParam("signer", "Signer index to use", "0")
  .setAction(async function (taskArguments, hre) {
    const contractAddress = await resolveDeploymentAddress(hre, taskArguments);
    const { ethers, fhevm } = hre;

    const signerIndex = parseInt(taskArguments.signer, 10);
    const signers = await ethers.getSigners();
    const signer = signers[signerIndex];

    const target = taskArguments.staker ?? signer.address;

    const contract = await ethers.getContractAt(CONTRACT_NAME, contractAddress, signer);

    const stakeData = await contract.stakeInfo(target);
    if (!stakeData[2]) {
      console.log(`No active stake for ${target}`);
      return;
    }

    const decryptedAmount = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      stakeData[0],
      contractAddress,
      signer,
    );

    console.log(`Stake for ${target}`);
    console.log(`  amount       : ${decryptedAmount}`);
    console.log(`  unlock time  : ${stakeData[1]}`);
    console.log(`  active       : ${stakeData[2]}`);
  });
