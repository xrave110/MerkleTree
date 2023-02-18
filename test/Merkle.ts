import { expect } from "chai";
import { ethers } from "hardhat";
import { generateTree } from "../scripts/merkle-tree"
import { keccak256 } from "ethers/lib/utils"

describe("MerkleTree", function () {
    it("Should verify a valid proof", async function () {
        const tree = await generateTree();
        const root = tree.getHexRoot();
        const [addr] = await ethers.getSigners();
        const hashedAddr = keccak256(addr.address);
        console.log('Looking for: ' + addr.address + '->' + hashedAddr);
        const proof = tree.getHexProof(hashedAddr);
        const Merkle = await ethers.getContractFactory("Merkle");
        const merkle = await Merkle.deploy(root);
        await merkle.deployed();

        expect(await merkle.verify(proof)).to.equal(true);
    })
    it("Should NOT verify a invalid proof", async function () {
        const tree = await generateTree();
        const root = tree.getHexRoot();
        const [_, addr2] = await ethers.getSigners();
        const hashedAddr = keccak256(addr2.address);
        console.log('Looking for: ' + addr2.address + '->' + hashedAddr);
        const proof = tree.getHexProof(hashedAddr);
        const Merkle = await ethers.getContractFactory("Merkle");
        const merkle = await Merkle.deploy(root);
        await merkle.deployed();

        expect(await merkle.connect(addr2).verify(proof)).to.equal(false);
    })
})
