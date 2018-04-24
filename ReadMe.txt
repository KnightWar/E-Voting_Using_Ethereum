/*
 * This readme explains how to run the voting protocol on Ethereum.
 * by Digendra Rai.
 *
*/


Running the source code requires the following installations on Ubuntu.
	- geth 1.7.3-stable
	- nodejs v8.9.1
	- setting the geth environment variables in ubuntu

Step 1: After the installations gets completed, in the terminal the following command line should be typed for starting the geth instance at specific port.
	--> geth --datadir . --networkid 71 --port 30304 --rpcport 8650 --rpc --rpccorsdomain "*" console

		Note: For each of the nodes the --rpcport and --port should be different. If many nodes are to be connected and run.
	
Step 2: The nodejs instance should be run next using the terminal. This can be done by simply typring nodejs in the console.

Step 3: The following steps are to be followed in the nodejs command promt for deploying the smart contract files in the geth instance. All the smart contract files are solidity supported files.

		step a: Web3 = require('web3'). // If web3 id not installed install it.

		step b: web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")). // The port number should be different for different geth instance nodes.

		step c: code = fs.readFileSync('Polling.sol').toString()

		step d: solc = require('solc'). //Install solidity compiler which is called "solc", if not installed.

		step e:  compiledCode = solc.compile(code)

		abiDefinition = JSON.parse(compiledCode.contracts[':Polling'].interface)

		step f: VotingContract = web3.eth.contract(abiDefinition)

		stpe g: byteCode = compiledCode.contracts[':Voting'].bytecode

		step h: deployedContract = VotingContract.new(['Rama','Nick','Jose'],{data: '0x'.concat( byteCode), from: web3.eth.accounts[0], gas: 4700000}). // This will deploy the smart contract on the geth instance blockchain.

The following steps explains the steps to talk to the smart contract function which is on the geth instance blockchain. It's optional and is used to check whether parameters passed to the smart function works or not by calling the function.

		step i: contractInstance = VotingContract.at(deployedContract.address)

		step j: contractInstance.totalVotesFor.call('Rama').

		step k: contractInstance.voteForCandidate('Rama', {from: web3.eth.accounts[0]})


After the above three steps are followed, for connecting mutiple geth nodes requires the following steps:

	At each of the geth instance command promt check the instance address and port by typing the following command on the promt;
			
			admin.nodeInfo.encode().

	Then, copy paste the nodes instance address and port in the other nodes geth intance command promt using the following command.

		admin.addPeer("node Instance and port");

	use the: "miner.start(); admin.sleepBlocks(7); admin.stop()" in any one of the node's geth instance commmand promt. This will take some time for syncing the multiple nodes.

	For addition of the geth nodes requires the above two commands to be followed.


Now, open "Register.html" from the PollingTmp folder in your browser and you are ready to vote.

NOTE: After the publishing of commitments by clicking the button, it's necessary that command "miner.start(); admin.sleepBlocks(7); admin.stop()" should be run on any node's geth instance.

NOTE: After the voting is done againg the command "miner.start(); admin.sleepBlocks(7); admin.stop()" should be run on any of the node's geth instance.

