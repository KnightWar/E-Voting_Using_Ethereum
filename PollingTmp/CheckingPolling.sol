pragma solidity ^0.4.11;

contract Polling{

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
	
	function totalVotesFor(bytes32 candidate) constant returns(bytes32[]){
		//return votesReceived[candidate];

		return votersEncryptedVotes[candidate];

	}

	function voteForCandidate(bytes32 candidate, bytes32 encryptedVotes) payable{
		uint index= indexOfCandidate(candidate);
		if(index == uint(-1)) revert();

		//require(!voterInfo[msg.sender].voted);
		voterInfo[msg.sender].voted= true;		

		//encrypt and keep all the votes in Mapping(ie. HashMap)
		votersEncryptedVotes[candidate].push(encryptedVotes);

		//votesReceived[candidate] += 1;
	}

	function indexOfCandidate(bytes32 candidate) constant
            returns (uint )
    {
		for(uint i= 0; i < candidateList.length; i++){
			if(candidateList[i] == candidate){
				return i;
			}
		}
        return uint(-1);
    }
}	
