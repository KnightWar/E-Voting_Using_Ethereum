pragma solidity ^0.4.11;

contract MerkelTree{

	struct tree{
		bytes32 root;
		mapping(bytes32=>bool) dataExist;
	}

	bytes32 public empty;

	mapping(address=>tree) public users;

	function newUser(){
		users[msg.sender];
	}

	function addData(uint256 _input,
					address _user) returns(uint success){

		var data= keccak256(_input);
		var oldRoot= getUserRoot(_user);
		var newRoot= hashTwo(data,oldRoot);

		users[_user].dataExist[data]= true;
		users[_user].root= newRoot;

		return 1;
	}
	
	function hashTwo(bytes32 _a, bytes32 _b) constant returns(bytes32 hashed){
		
		return keccak256(_a,_b);
	}

	function getUserRoot(address _user) constant returns(bytes32 root){
		
		return users[_user].root;
	}

	function checkDataIntegrity(uint256[] _data,
								address _user) constant returns(bool complete){

		var oldRoot= empty;
		for(uint i= 0; i < _data.length; i++){

			var data= keccak256(_data[i]);
			if(users[_user].dataExist[data]){
				var root= hashTwo(data,oldRoot);
				oldRoot= root;
				continue;
			}
			else
				return false;
		}
		
		if(root == getUserRoot(_user))
			return true;
		else
			return false;
	}
}
