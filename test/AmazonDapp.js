const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("AmazonDapp", () => {
  let amazonDapp;
  before(async () => {
    const AmazonDapp = await ethers.getContractFactory("AmazonDapp")
    amazonDapp = await AmazonDapp.deploy()
    // await amazonDapp.deployed()
  });

  it("Should have a name", async () => {
    expect(await amazonDapp.name()).to.equal("AmazonDapp");
  });
})
