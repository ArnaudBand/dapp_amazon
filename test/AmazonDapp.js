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
    const ID = 1;
    const NAME = "iPhone 12";
    const CATEGORY = "Electronic";
    const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/drone.jpg";
    const PRICE = tokens(1);
    const RATING = 5;
    const QUANTITY = 3;

    beforeEach(async () => {
      transaction =await amazonDapp.connect(deployer).listProduct(1, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY);
      await transaction.wait();
    });
    it("Should return item attribute", async () => {
      const item = await amazonDapp.products(ID);
      expect(item.id).to.equal(ID);
    });
  });
})
