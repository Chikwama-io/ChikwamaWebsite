const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Cashpoints", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCashpointsContract() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const Cashpoints = await ethers.getContractFactory("CashPoints");
    const cashpoints = await Cashpoints.deploy();

    return { cashpoints, owner, otherAccount };

  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { cashpoints, owner } = await loadFixture(deployCashpointsContract);
      expect(await cashpoints.Owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply of tokens to the owner", async function () {
      
      const { cashpoints, owner } = await loadFixture(deployCashpointsContract);
      const ownerBalance = await cashpoints.balanceOf(owner.address);
      expect(await cashpoints.totalSupply()).to.equal(ownerBalance);
    });

  
  });

  describe("Transactions", function () {

    it("Should fail if a holder tries to withdraw when there is no value in contract", async function () {
      const { cashpoints, owner } = await loadFixture(deployCashpointsContract);
      expect(await cashpoints.connect(owner).withdraw(20)).to.be.revertedWith('There is no value in this contract');
    })
  })
});
