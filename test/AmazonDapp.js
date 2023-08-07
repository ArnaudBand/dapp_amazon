const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("AmazonDapp", () => {
  let amazonDapp, deployer, buyer;

  const ID = 1;
  const NAME = "iPhone 12";
  const CATEGORY = "Electronic";
  const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/drone.jpg";
  const PRICE = tokens(1);
  const RATING = 5;
  const QUANTITY = 3;

  before(async () => {
    // Get signers
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const AmazonDapp = await ethers.getContractFactory("AmazonDapp");
    amazonDapp = await AmazonDapp.deploy();
    await amazonDapp.deployed();
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
      transaction =await amazonDapp.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY);
      await transaction.wait();
    });
    it("only owner can list new product", async () => {
      await expect(amazonDapp.connect(buyer).listProduct(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY)).to.be.revertedWith("Only owner can list products");
    });
   it("Should return item attribute", async () => {
      const item = await amazonDapp.products(ID);
      expect(item.id).to.equal(ID);
    });
    it("should emit a ListProduct event", async () => {
      expect(transaction).to.emit(amazonDapp, "ProductListed").withArgs(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY);
    });
  });

  describe("PurchaseProduct", async () => {
    let transaction;

    beforeEach(async () => {
      transaction =await amazonDapp.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY);
      await transaction.wait();

      transaction = await amazonDapp.connect(buyer).purchaseProduct(ID, { value: PRICE });
    });

    it("should upddate the contract balance", async () => {
      const balance = await ethers.provider.getBalance(amazonDapp.address);
      expect(balance).to.equal(PRICE);
    });
  });
})
