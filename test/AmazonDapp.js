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

    it("should update the contract balance", async () => {
      const balance = await ethers.provider.getBalance(amazonDapp.address);
      expect(balance).to.equal(PRICE);
    });

    it("should update the buyer's order count", async() => {
      const orderCount = await amazonDapp.orderCount(buyer.address);
      expect(orderCount).to.equal(2);
    });

    it("should add the order to the orders mapping", async () => {
      const order = await amazonDapp.orders(buyer.address, ID);
      expect(order.time).to.be.greaterThan(0);
      expect(order.product.id).to.equal(ID);
    });

    it("should emit a PurchaseProduct event", async () => {
      expect(transaction).to.emit(amazonDapp, "ProductPurchased").withArgs(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY);
    });
  });

  describe("Withdraw", async () => {
    let balanceBefore;

    beforeEach(async () => {
      // List product
      let transaction = await amazonDapp.connect(deployer).listProduct(ID, NAME, CATEGORY, IMAGE, PRICE, RATING, QUANTITY);
      await transaction.wait();

      // Purchase product
      transaction = await amazonDapp.connect(buyer).purchaseProduct(ID, { value: PRICE });
      await transaction.wait();

      // Get balance before withdraw
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // Withdraw balance
      transaction = await amazonDapp.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("should update the owner balance", async() => {
      const balance = await ethers.provider.getBalance(deployer.address);
      expect(balance).to.be.greaterThan(balanceBefore);
    });

    it("should update the contract balance", async () => {
      const balance = await ethers.provider.getBalance(amazonDapp.address);
      expect(balance).to.equal(0);
    });
  });
})
