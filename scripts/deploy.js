// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  const [deployer] = ethers.getSigners();

  // Deployer AmazonDapp
  const AmazonDapp = await hre.ethers.getContractFactory("AmazonDapp");
  const amazonDapp = await AmazonDapp.deploy();
  await amazonDapp.deployed();

  console.log("AmazonDapp deployed to:", amazonDapp.address);

  // List of products
  for(let i = 0; i < items.length; i++) {
    const item = items[i];
    const transaction = await amazonDapp.connect(deployer).listProduct(
      item.id,
      item.name,
      item.category,
      item.image,
      tokens(item.price),
      item.rating,
      item.quantity
    )
    await transaction.wait();

    console.log(`Product ${item.name} listed!`)
  }
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
