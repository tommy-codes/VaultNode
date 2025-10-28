import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedToken = await deploy("ConfidentialUSDT", {
    from: deployer,
    log: true,
    args: [""],
  });

  console.log(`ConfidentialUSDT contract: `, deployedToken.address);
};
export default func;
func.id = "deploy_confidential_usdt"; // id required to prevent reexecution
func.tags = ["ConfidentialUSDT"];
