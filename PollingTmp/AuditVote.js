Web3= require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var AuditVoteContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"_a","type":"bytes32"},{"name":"_b","type":"bytes32"}],"name":"hashTwo","outputs":[{"name":"hashed","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_data","type":"uint256"}],"name":"checkVotesData","outputs":[{"name":"complete","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_input","type":"uint256"}],"name":"addVotesData","outputs":[{"name":"success","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}])

/*var ballot= AuditVoteContract.new(
	{
			from: web3.eth.accounts[0],
			data: '0x6060604052341561000f57600080fd5b6102008061001e6000396000f3006060604052600436106100565763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631c8e8d7a811461005b578063221ec24214610086578063ceae4930146100b0575b600080fd5b341561006657600080fd5b6100746004356024356100c6565b60405190815260200160405180910390f35b341561009157600080fd5b61009c6004356100e9565b604051901515815260200160405180910390f35b34156100bb57600080fd5b610074600435610168565b600082826040519182526020820152604090810190518091039020905092915050565b6000806000808460405190815260200160405190819003902060008681526020818152604080832084845260010190915290205490925060ff161561013c5761013282846100c6565b9050809250610145565b60009350610160565b60008581526020819052604090205483141561013c57600193505b505050919050565b60008060008084604051908152602001604051908190039020600086815260208190526040902054909350915061019f83836100c6565b60008681526020818152604080832096835260018088018352908320805460ff191682179055978252529092555091929150505600a165627a7a723058204703c05011c7ffa557d554c8e69f9dec05704d8a672fedac6ce4d46d3b81d6dc0029',
			gas: '2700000'
		},
		function(e,contract){
			console.log(e,contract);
			if (typeof contract.address !== 'undefined') {
				console.log('contract mined at: ' +contract.address);
			}
		}
	)

*/

var AuditVoteAddress= "0x99f8f4ddcc851dea23936355efcfd368b514f3c7"
var AuditVoteInstance= AuditVoteContract.at(AuditVoteAddress)


//var makeTree= AuditVoteInstance.addVotesData(17,{from:web3.eth.accounts[0]})
//console.log("makeTree: ",makeTree)

var checkTree= AuditVoteInstance.checkVotesData.call(18).toString()
console.log("checkTree: ",checkTree)






