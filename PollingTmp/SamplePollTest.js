/*
 * This js File provides the Following Functionality.
 *		- Zero Knowledge Proof(ZKProof) Generation. 
 *			: This includes Generating Parameters for ZKProof. 
 *  		: Putting the ZKProof Parameters on Blockchain.
 *			: Validation of ZKProof by getting the ZKProof Parameters from the Blockchain.
 * Any user/voter can validate any other users/voters ZKProof by getting the ZKProof Parameters from the Blockchain.
*/

Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8650"));

/*
 * This is the Application Binary Interface(ABI), which is used for accessing and insertion values onto Blockchain.
*/
var ZKFContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"p","type":"uint256"},{"name":"q","type":"uint256"},{"name":"g","type":"uint256"},{"name":"zkf","type":"uint256[4]"}],"name":"addZKFToValidate","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"zkproof","outputs":[{"name":"P","type":"uint256"},{"name":"Q","type":"uint256"},{"name":"G","type":"uint256"},{"name":"ZKF0","type":"uint256"},{"name":"ZKF1","type":"uint256"},{"name":"ZKF2","type":"uint256"},{"name":"ZKF3","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"callZKFToValidate","outputs":[{"name":"","type":"uint256[7]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getProofCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Tree","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_input","type":"uint256[]"},{"name":"_user","type":"address"},{"name":"merkelTreeContractAddress","type":"address"}],"name":"checkMerkelTree","outputs":[{"name":"ck","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_data","type":"uint256"},{"name":"_user","type":"address"},{"name":"merkelTreeContractAddress","type":"address"}],"name":"addIntoMerkelTree","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"p","type":"uint256"},{"name":"q","type":"uint256"},{"name":"g","type":"uint256"},{"name":"zkf","type":"uint256[]"}],"name":"validateZKF","outputs":[{"name":"res","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}])

var deployedZKFAddress= '0x7101a7e1ce294ed843597940dad51fe4dec0e5f6';
var ZKFInstance = ZKFContract.at(deployedZKFAddress);

var merkleTreeContractAddress='0xfe3f6e0eb8d34c01844fb3b304179080da651342';

var Chance= require('chance')
var hash = require('hash.js')
var bigInt = require("big-integer");

var Hashes = require('/home/digen/Desktop/Polling/jshashes-master/hashes.js')
var another= require('/home/digen/Desktop/Polling/ZKF.js')
var checkZ= require('~/Desktop/Polling/checkZKF.js')

chance= new Chance(Math.random);

		
		/********************************************************************************************************************************
						The following Provides the Functions for Generating necessary parameters to be used for ZKProof.
		*******************************************************************************************************************************/


/*
 * This function performs the necessary prime and generator number generation which is to be used for ZKF proof generation.
 *	
*/

function makeZKF(comm){

	var primeQ= bigInt(14)
	var primeP= bigInt(primeQ).multiply(bigInt(2).add(1))
	//alert("PrimeP: "+primeP.toString())

	var g= bigInt(8)
	var cm= bigInt(comm)
	var x= bigInt(10)

	var makeZKF= callMakeZKF(primeP,primeQ,g,cm,x) 
	alert("ZKFParams:"+makeZKF)
	
	var arr= [7]
	arr[0]= makeZKF[0]
	arr[1]= makeZKF[1]
	arr[2]= makeZKF[2]
	arr[3]= makeZKF[3]

	arr[4]= primeP
	arr[5]= primeQ
	arr[6]= g
	
	var q= bigInt(arr[1]).abs().toString()

	alert("RESULT AFTER CHECKING ZKF: "+checkZKF(primeP,primeQ,g,arr))
	//var validZKF= ZKFInstance.validateZKF.call(primeP.toString(),primeQ.toString(),g.toString(),[arr[0],q,arr[2],arr[3]])
	//alert("ValidZKFOnBC: "+validZKF.toString())

	return arr
}

/*
 * This function performs the ZKF generation of Proof.
 *	
*/

function callMakeZKF(p,
					   q, 
					   g,
					   cm,
					   x){

	//alert("Inside callMakeZKF")
	var zeroKnowledgeProof= [4];

	var vMin= bigInt.zero
	var vMax= bigInt(q).subtract(bigInt.one)
	//alert("vMax: "+vMax)

	var v= chance.integer({min:vMin, max: vMax})
	var z= chance.integer({min:vMin, max: vMax})
	//alert("V: "+v)

	// y= (g^cm * g^x) mod p
	var y= bigInt(g).modPow(cm,p).multiply(bigInt(g).modPow(x,p)).mod(p)
	//alert("Y: "+y)

	// t= (g^v * g^z) mod p
	var t= bigInt(g).modPow(v,p).multiply(bigInt(g).modPow(z,p)).mod(p)
	//alert("t: "+t)

	///console.log("y:",y.toString())	
	///console.log("t:",t.toString())
	
	// hash= SHA256(g,y,t)
	var SHA256Hash = new Hashes.SHA256().hex(g,y,t)
	Hash= '0x'.concat(SHA256Hash)
	//alert("Hash: "+Hash)

	// Converting Hex Format number to Decimal Int Format
	var parsedIntHash= parseInt(Hash);

	// Using bigInt reresentation Format for the Decimal Int Format
	var tempHash= bigInt(parsedIntHash).toString()
	//alert("tempHash: "+tempHash)

	//Removing Trailing and leading Zeros from a Decimal Format Number
	var replHash = tempHash.replace(/^0+(\d)|(\d)0+$/gm, '$1$2');
	//alert("replHash: "+replHash)

	// Dividing the large int number to small Int
	var orgHash= replHash % replHash.length-1
	///console.log("Org Hash:",orgHash)

	var hx= bigInt(x).multiply(orgHash) // hx= x * hash
	var hcm= bigInt(cm).multiply(orgHash) // hcm= cm * hash
	
	// r= [ v + z - (x * hash) - (cm * hash) ] mod q
	var r= bigInt(v).add(bigInt(z).subtract(bigInt(hx).subtract(hcm))).mod(q)

	var absoluteValueOfR= bigInt(r).abs().toString()
	//alert("absoluteValueOfR: "+absoluteValueOfR)

	zeroKnowledgeProof[0]= t.toString()
	zeroKnowledgeProof[1]= absoluteValueOfR
	zeroKnowledgeProof[2]= y.toString()
	zeroKnowledgeProof[3]= orgHash

	return zeroKnowledgeProof
}

/*
 * This function is for testing whether ZKF put on the Blockchain is valid or not.
 *	
*/

function checkZKF(p,
					   q, 
					   g,
					   zkf){
	
	var t= zkf[0]
	var r= zkf[1]
	var y= zkf[2]
	var Hash= zkf[3]
	

	var gr= bigInt(g).modPow(r,p) // g^r 
	var yh= bigInt(y).modPow(Hash,p) // y^h

	var res= bigInt(gr).multiply(yh).mod(p) // res= g^r * y^h

	alert("IN checkZKF T: "+t)	
	alert("IN checkZKF res: "+res)

	if(t == res.toString())	
		return true
	else
		return false
}

		/********************************************************************************************************************************
					The following Provides the Functions for Putting and getting necessary parameters to and fro Blockchian. 
		*******************************************************************************************************************************/
var commitment= 0

/*
 * This randomly generates a Commitment and Puts the Commitment on the Blockchain.
*/
function putCommitmentOnBC(idText){
	
	alert("In Put Commitment On BC: "+idText)
		
	var secretSN = chance.integer({min:0, max: 100})
	var secretKey = chance.integer({min:0, max: 100})

	//alert("SecretKey: "+secretKey)

	var SHA256 = new Hashes.SHA256().hex(secretKey)
	commitment= '0x'.concat(SHA256)
	alert("Commmitment: "+commitment)

	//var putCommitmentOnBC= ZKFInstance.addIntoMerkelTree(commitment,web3.eth.accounts[0],merkleTreeContractAddress,{from:web3.eth.accounts[0]})
}

/*
 * This puts the ZKProof Parameters On the Blockchain
*/

function putZKFParamtersOnBC(){

	var secretSN = chance.integer({min:0, max: 100})
	var secretKey = chance.integer({min:0, max: 100})

	//alert("SecretKey: "+secretKey)

	var SHA256 = new Hashes.SHA256().hex(secretKey)
	commitment= '0x'.concat(SHA256)
	alert("Commmitment: "+commitment)

	var parsedIntCommitment= parseInt(commitment);

	// Using bigInt reresentation Format for the Decimal Int Format
	var tempIntCommitment= bigInt(parsedIntCommitment).toString()
	//alert("tempHash: "+tempHash)

	//Removing Trailing and leading Zeros from a Decimal Format Number
	var replIntCommitment = tempIntCommitment.replace(/^0+(\d)|(\d)0+$/gm, '$1$2');
	//alert("replHash: "+replHash)

	// Dividing the large int number to small Int
	var orgIntCommitment= replIntCommitment % replIntCommitment.length-1
	//alert("Commitment Inside checkCommitment: "+ orgIntCommitment)


	var getZKFParams= makeZKF(orgIntCommitment);

	alert("Params on BC: "+getZKFParams)
	var putZKProofOnBC= ZKFInstance.addZKFToValidate(getZKFParams[4].toString(),getZKFParams[5].toString(),
								getZKFParams[6].toString(),[getZKFParams[0].toString(),getZKFParams[1].toString(),getZKFParams[2].toString(),
								getZKFParams[3].toString()],{from:web3.eth.accounts[0],gas:200000})

	//ZKFInstance.addZKFToValidate(13,15,17,[19,21,23,25],{from:web3.eth.accounts[0],gas:500000})
}

/*
 * This gets the ZKProof Parameters from the Blockchain and using these parameters Validates the Proof on the Blockchain again. Checks if the Proof is Correct or Not.
*/
function checkToValidateCommitmentOnBC(){

	var chkProof= 0;
	var ZKProofLength= ZKFInstance.getProofCount.call().toString()
	alert("ProofLength: "+ZKProofLength.toString())
	
	var getZKFProofFromBC= ZKFInstance.callZKFToValidate.call(ZKProofLength.toString()-1);
	alert("Proof From BC: "+getZKFProofFromBC.toString())

	var validZKF= ZKFInstance.validateZKF.call(getZKFProofFromBC[0].toString(),getZKFProofFromBC[1].toString(),getZKFProofFromBC[2].toString(),		  
												[getZKFProofFromBC[3].toString(),getZKFProofFromBC[4].toString(),
												getZKFProofFromBC[5].toString(),getZKFProofFromBC[6].toString()]).toString()
	//alert("ValidZKFOnBC: "+validZKF.toString())

	if((getZKFProofFromBC[3].toString() == validZKF.toString()) && (getZKFProofFromBC[3].toString() != 0))
		 chkProof= 1
	
	return chkProof
}



