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

  describe("ListProducts", async () => {
    let transaction;
    beforeEach(async () => {
      transaction =await amazonDapp.connect(deployer).listProduct(1, "iPhone 12", "Elctronic", "Image", tokens(1), 5, 3);
      await transaction.wait();
    });
    it("Should return item attribute", async () => {
      const item = await amazonDapp.products(1);
      expect(item.id).to.equal(1);
    });
  });
})
