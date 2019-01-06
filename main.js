const SHA256 = require("crypto-js/sha256");
const moment = require("moment");

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		const message = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data);

		return SHA256(message).toString();
	}
}

class Blockchain {
	constructor() {
		this.chain  = [ this.createGenesisBlock() ]
	}

	createGenesisBlock() {
		const date = moment().format('L');

		return new Block(0, date, 'genesis block', 0)
	}

	getTheLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getTheLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isBlockchainValid() {
		let isValid = true;

		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const prevBlock = this.chain[i - 1];

			let isValid = this.isBlockValid(prevBlock, currentBlock);
			if (!isValid) {
				return false;
			}
		}

		return isValid;
	}

	isBlockValid(prevBlock, currentBlock) {
		if (currentBlock.hash !== currentBlock.calculateHash()) {
			return false;
		}

		if (currentBlock.previousHash !== prevBlock.hash) {
			return false;
		}

		return true;
	}
}

let testCoin = new Blockchain();
testCoin.addBlock(new Block(1, '10/07/2019', { money: 10 }));
testCoin.addBlock(new Block(2, '11/07/2019', { money: 11 }));
testCoin.addBlock(new Block(3, '12/07/2019', { money: 12 }));
testCoin.addBlock(new Block(4, '13/07/2019', { money: 13 }));
testCoin.addBlock(new Block(5, '14/07/2019', { money: 14 }));


console.log(JSON.stringify(testCoin, null, 4)); // display our test blockchain
console.log('is valid ? : ' + testCoin.isBlockchainValid()); // display if the block chain is valid

// let's temper the blockchain by changing the amount of money for a block

testCoin.chain[4].data.money = 15;
console.log(JSON.stringify(testCoin, null, 4));
console.log('is valid ? : ' + testCoin.isBlockchainValid()); // check again if the blockchain is valid