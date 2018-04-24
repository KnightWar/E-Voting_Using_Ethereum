pragma solidity ^0.4.11;

contract Polling{

	/*
	 * This is For the Voting Process. VoteForCandidate, Count Total Votes For Candidate.
	*/

	struct Voter{
		address voterAddress;
		bool voted;
	}
	
	mapping(address=>Voter) public voterInfo;

	mapping(bytes32=>uint) public votesReceived;

	mapping(bytes32=>bytes32[]) public votersEncryptedVotes;

	bytes32[] public candidateList;	

	
	function Polling(bytes32[] candidateNames) {
    	candidateList = candidateNames;
  	}
	
	function totalVotesFor(bytes32 candidate) constant public returns(bytes32[]){
		return votersEncryptedVotes[candidate];
	}

	function voteForCandidate(bytes32 candidate, bytes32 encryptedVotes) payable public{
		uint index= indexOfCandidate(candidate);
		if(index == uint(-1)) revert();

		//require(!voterInfo[msg.sender].voted);
		voterInfo[msg.sender].voted= true;		

		//encrypt and keep all the votes in Mapping(ie. HashMap)
		votersEncryptedVotes[candidate].push(encryptedVotes);

	}

	function  indexOfCandidate(bytes32 candidate) constant
           private returns (uint )
    {
		for(uint i= 0; i < candidateList.length; i++){
			if(candidateList[i] == candidate){
				return i;
			}
		}
        return uint(-1);
    }

	
	function winningCandidate() constant public returns(bytes32 winner){
		uint winnerCandidate= 0;
		for(uint p= 0; p < candidateList.length; p++){
			if(votesReceived[candidateList[p]] > winnerCandidate){	
				winnerCandidate= votesReceived[candidateList[p]];
				winner= candidateList[p];				
			}
		}
		return winner;
	}


	/* 
	 * This is for Checking, whether if the votes casted by the Voters is recorded on the Blockchain or not.
	*/
	struct checkIfVoteOnBCTree{
		bytes32 root;
		mapping(bytes32=>bool) dataExist;
	}

	mapping(bytes32=>checkIfVoteOnBCTree) users;

	function addVotesData(bytes32 encryptedVotes_input) public returns(uint success){

		var data= keccak256(encryptedVotes_input);
		var oldRoot= users[encryptedVotes_input].root;
		var Root= hashTwo(data,oldRoot);

		users[encryptedVotes_input].dataExist[data]= true;
		users[encryptedVotes_input].root= Root;

		return 1;
	}
	
	function hashTwo(bytes32 _a, bytes32 _b) constant public returns(bytes32 hashed){
		
		return keccak256(_a,_b);
	}

	function checkVotesData(bytes32 encryptedVotes_data) constant public returns(bool complete){

		bytes32 oldRoot;

		var data= keccak256(encryptedVotes_data);
		if(users[encryptedVotes_data].dataExist[data]){
			var root= hashTwo(data,oldRoot);
			oldRoot= root;			
		}
		else
			return false;
		
		if(oldRoot == users[encryptedVotes_data].root)
			return true;
		else
			return false;
	}
}	
