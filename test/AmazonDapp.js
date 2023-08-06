const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("AmazonDapp", () => {
  let amazonDapp, deployer, buyer;
  before(async () => {
    // Get signers
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const AmazonDapp = await ethers.getContractFactory("AmazonDapp");
    amazonDapp = await AmazonDapp.deploy();
  });

  describe("Deployment", async () => {
    it("Should have the owner", async () => {
      let owner = await amazonDapp.owner();
      expect(owner).to.equal(deployer.address);
    });
  });
})
