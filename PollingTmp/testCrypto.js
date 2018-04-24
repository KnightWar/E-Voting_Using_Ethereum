Web3= require('web3');

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8650"));

var candidateNames= ["Rama","Nick","Jose"];
var candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

var PollingContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"votersEncryptedVotes","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"},{"name":"encryptedVotes","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voterInfo","outputs":[{"name":"voterAddress","type":"address"},{"name":"voted","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"indexOfCandidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}])


var pollingContractAddress= '0x1d3b190e4fbc8bca54d573414da366dcd28846a0'
var pollingInstance= PollingContract.at(pollingContractAddress)

var aesjs = require("aes-js");

function voteForCandidate() {

  	candidateName = $("#candidate").val();
	//alert("candidateName: "+candidateName)

	if (candidateName.length != 0){

		var vote1or0= ChooseVote();
		//alert("VOTES: "+vote1or0)

		if(vote1or0 != 7){
			
			var encryptedVote= aesEncryption(vote1or0)
			alert("EncryptedVote: "+encryptedVote)

			var ok= pollingInstance.voteForCandidate(candidateName, encryptedVote, {from: web3.eth.accounts[0]});
			alert("OK: "+ok)

			CountDown(5)
		}
		else
			alert("Yes or No Vote not clicked")
	
	}
	else
		alert("Candidate Name is NULL")
}

function ChooseVote() {
    //document.getElementById("").value = "Johnny Bravo";

	var voteRes;
	if(document.getElementById('zeroVote').checked){
		//alert(document.getElementById('zeroVote').value)
		voteRes= document.getElementById('zeroVote').value
	}
	else if(document.getElementById('oneVote').checked){
		//alert(document.getElementById('oneVote').value)
		voteRes= document.getElementById('oneVote').value
	}
	else{
		voteRes= 7
	}
	//alert("Vote0or1: "+voteRes)
	return voteRes
}

function totalVotesFor(){


	candidateNames = Object.keys(candidates);
  	for (var i = 0; i < candidateNames.length; i++) {
    	let name = candidateNames[i];

		var val= countVotesFor(name)
    	$("#" + candidates[name]).html(val);
  	}

}


function countVotesFor(name){

	var orgString= []
	var decryptedVote= []

	var val= pollingInstance.totalVotesFor.call(name).toString()
	//alert(val)
	
	var str_array = val.split(',');

	for(var i = 0; i < str_array.length; i++) {
		// Trim the excess whitespace.
		str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		//alert("Splitted String: "+str_array[i]);

		orgString.push(web3.toAscii(str_array[i]))	
	}
	
	for(var i = 0; i < str_array.length; i++){

		//alert("OrgString: "+orgString[i])
		decryptedVote[i]= aesDecryption(orgString[i]);
	}

	var countVotes= 0;
	for(var j= 0; j < decryptedVote.length; j++){
		
		if(decryptedVote[j] == 'one')
			countVotes += 1;
	}
	//alert("VotesCounted: "+countVotes)

	return countVotes
}

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}


function showToButtonForVotesSummary(){

	var votesCountButton= document.getElementById("votesSumm").disabled= false;
}

function aesEncryption(text){

		// An example 128-bit key
	var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

	// The initialization vector (must be 16 bytes)
	var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];

	// Convert text to bytes
	var textBytes = aesjs.utils.utf8.toBytes(text);

	var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
	var encryptedBytes = aesOfb.encrypt(textBytes);

	//alert("EncryptedBytes: "+encryptedBytes)

	// To print or store the binary data, you may convert it to hex
	var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	//alert("EncryptedHex: "+encryptedHex);

	return encryptedHex
}

function aesDecryption(encryptedHex){

	var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
	// The initialization vector (must be 16 bytes)
	var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];

	// When ready to decrypt the hex string, convert it back to bytes
	var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

	var cleanedEncryptedBytes= cleanArray(encryptedBytes);
	//alert("Cleaned Array: "+cleanedEncryptedBytes)

	// The output feedback mode of operation maintains internal state,
	// so to decrypt a new instance must be instantiated.
	var aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
	var decryptedBytes = aesOfb.decrypt(cleanedEncryptedBytes);
	//alert('hi: '+decryptedBytes)

	// Convert our bytes back into text
	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

	//alert("Decrypt: "+decryptedText);
	return decryptedText;
}



function CountDown(time){

	var interval= setInterval(function() {
		document.getElementById("demo").innerHTML= --time
		//document.getElementById("voteID").disabled= true

		if(time <= 0){

			document.getElementById("demo").innerHTML= "YOU Reaaady"
			//document.getElementById("voteID").disabled= false
			clearInterval(interval)
			
			x.style.display = "none";
		}
	
	},1000)
	
	//document.getElementById("voteID").disabled= true

	//setInterval(function(){Timer()},1000)
	//var myVar= setTimeout(alertButton,3000)
	
}
