pragma solidity ^0.4.11;

contract auditVote{

	struct auditVoteTree{
		bytes32 root;
		mapping(bytes32=>bool) dataExist;
	}

	mapping(uint256=>auditVoteTree) users;

	function addVotesData(uint256 _input) returns(uint success){

		var data= keccak256(_input);
		var oldRoot= users[_input].root;
		var Root= hashTwo(data,oldRoot);

		users[_input].dataExist[data]= true;
		users[_input].root= Root;

		return 1;
	}
	
	function hashTwo(bytes32 _a, bytes32 _b) constant returns(bytes32 hashed){
		
		return keccak256(_a,_b);
	}

	function checkVotesData(uint256 _data) constant returns(bool complete){

		bytes32 oldRoot;

		var data= keccak256(_data);
		if(users[_data].dataExist[data]){
			var root= hashTwo(data,oldRoot);
			oldRoot= root;			
		}
		else
			return false;
		
		if(oldRoot == users[_data].root)
			return true;
		else
			return false;
	}
}

