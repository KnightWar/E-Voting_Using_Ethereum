
Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var ZKFContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"Tree","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_input","type":"uint256[]"},{"name":"_user","type":"address"},{"name":"merkelTreeContractAddress","type":"address"}],"name":"checkMerkelTree","outputs":[{"name":"ck","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_data","type":"uint256"},{"name":"_user","type":"address"},{"name":"merkelTreeContractAddress","type":"address"}],"name":"addIntoMerkelTree","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"p","type":"uint256"},{"name":"q","type":"uint256"},{"name":"g","type":"uint256"},{"name":"zkf","type":"uint256[]"}],"name":"validateZKF","outputs":[{"name":"res","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}])

var deployedZKFAddress= '0xb0b9b5d037f98c16d42b3de96741e5dde0d39af4';
var ZKFInstance = ZKFContract.at(deployedZKFAddress);

var merkleTreeContractAddress='0xac187394927c071645f800ce549a9446c0756b80';

var Chance= require('chance')
var hash = require('hash.js')

chance= new Chance(Math.random);

var secretSN = chance.integer({min:0, max: 100})
var secretKey = chance.integer({min:0, max: 100})
console.log("secretSN:",secretSN)
console.log("Secret Key:",secretKey)

var commitment= '0x'.concat(hash.sha256().update(secretKey).digest('hex'))

console.log("Hash Secret SN:",commitment)

//var putCommitmentOnBC= ZKFInstance.addIntoMerkelTree(commitment,web3.eth.accounts[2],merkleTreeContractAddress,{from:web3.eth.accounts[2]})

//console.log("putCommitmentOnBC:", putCommitmentOnBC)

//var success= ZKFInstance.checkMerkelTree.call([1,commitment],web3.eth.accounts[2],merkleTreeContractAddress)


//console.log(success);


var acct= web3.eth.accounts[2]
var acctBal= web3.fromWei(web3.eth.getBalance(acct),"ether")
var balance= parseInt(acctBal)

console.log("Before Balance:",acct)

//web3.eth.sendTransaction({from:web3.eth.accounts[3], to:web3.eth.accounts[2], value: web3.toWei(1, "ether")})

//var acctBal= web3.fromWei(web3.eth.getBalance(acct),"ether")
//var balance= parseInt(acctBal)

//console.log("After Balance:",balance)


/***************************
	This is for Polling
*******************************/
	var test= true

	var poll= function() {
		return test
	}


/******
	This is for ZKF
	*******************************************************/

var bigInt = require("big-integer");

var primeQ= bigInt(14)
var primeP= bigInt(primeQ).multiply(bigInt(2).add(1))

console.log("PrimeP:",primeP.toString())

var g= bigInt(8)
var cm= bigInt(8)
var x= bigInt(10)


var another= require('./ZKF.js')
var makeZKF= another(primeP,primeQ,g,cm,x) 

console.log("MakeZKF:",makeZKF)

var arr= [4]
arr[0]= makeZKF[0]
arr[1]= makeZKF[1]
arr[2]= makeZKF[2]
arr[3]= makeZKF[3]

var q= bigInt(arr[1]).abs().toString()

var checkZ= require('./checkZKF.js')
console.log("RES",checkZ(primeP,primeQ,g,arr))

var validZKF= ZKFInstance.validateZKF.call(primeP.toString(),primeQ.toString(),g.toString(),[arr[0],q,arr[2],arr[3]])

console.log("ValidZKF:",validZKF.toString())

module.exports = {
	poll: poll
}


