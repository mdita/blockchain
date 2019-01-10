const SHA256 = require("crypto-js/sha256");
const moment = require("moment");

class Transaction {
	constructor(addressFrom, addressTo, amount) {
		this.addressFrom = addressFrom;
		this.addressTo = addressTo;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, previousHash = '') {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nounce = 0;
	}

	calculateHash() {
		const message = this.index + this.previousHash + this.timestamp + this.nounce + JSON.stringify(this.transactions);

		return SHA256(message).toString();
	}

	mineNewBlock(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.hash = this.calculateHash();
			this.nounce++;
		}

		console.log('Block with hash: ' + this.hash + ' was mined.');
	}
}

class Blockchain {
	constructor() {
		this.chain  = [ this.createGenesisBlock() ]
		this.difficulty = process.env.MINE_DIFFICUlTY || 2;
		this.pendingTransactions = [];
		this.reward = 100;
	}

	createGenesisBlock() {
		const date = moment().format('L');

		return new Block(0, date, 'genesis block', 0)
	}

	getTheLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(rewardAddress) {
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineNewBlock(this.difficulty);

		console.log('Block succesfully mined!!!');
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, rewardAddress, this.reward)
		];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getAddressBalance(address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const transaction of block.transactions) {
				if (transaction.addressTo === address) {
					balance += transaction.amount;
				}

				if (transaction.addressFrom === address) {
					balance -= transaction.amount;
				}
			}
		}

		return balance;
	}

	// addBlock(newBlock) {
	// 	newBlock.previousHash = this.getTheLatestBlock().hash;
	// 	newBlock.mineNewBlock(this.difficulty);
	// 	this.chain.push(newBlock);
	// }

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

// let testCoin = new Blockchain();
// testCoin.addBlock(new Block(1, '10/07/2019', { money: 10 }));
// testCoin.addBlock(new Block(2, '11/07/2019', { money: 11 }));
// testCoin.addBlock(new Block(3, '12/07/2019', { money: 12 }));
// testCoin.addBlock(new Block(4, '13/07/2019', { money: 13 }));
// testCoin.addBlock(new Block(5, '14/07/2019', { money: 14 }));


// console.log(JSON.stringify(testCoin, null, 4)); // display our test blockchain
// console.log('is valid ? : ' + testCoin.isBlockchainValid()); // display if the block chain is valid

// // let's temper the blockchain by changing the amount of money for a block

// testCoin.chain[4].data.money = 15;
// console.log(JSON.stringify(testCoin, null, 4));
// console.log('is valid ? : ' + testCoin.isBlockchainValid()); // check again if the blockchain is valid



// let testCoin = new Blockchain();
// testCoin.addBlock(new Block(1, '10/07/2019', { money: 10 }));
// testCoin.addBlock(new Block(2, '11/07/2019', { money: 11 }));
// console.log(JSON.stringify(testCoin, null, 4));

let testCoin = new Blockchain();
testCoin.createTransaction(new Transaction('address1', 'address2', 100));
testCoin.createTransaction(new Transaction('address2', 'address1', 50));

testCoin.minePendingTransactions('miner-address');
console.log(JSON.stringify(testCoin, null, 4));


console.log(testCoin.getAddressBalance('miner-address'));

testCoin.minePendingTransactions('miner-address');
console.log(testCoin.getAddressBalance('miner-address'));
console.log(JSON.stringify(testCoin, null, 4));