pragma solidity ^0.4.11;

library Math{

	function mul(uint a, uint b) internal constant returns (uint) {
    	uint c = a * b;
    	return c;
  	}

  	function div(uint a, uint b) internal constant returns (uint) {
    	uint c = a / b;
    	return c;
  	}

  	function sub(uint a, uint b) internal constant returns (uint) {
    	return a - b;
  	}

	function mod(uint a, uint b) internal constant returns(uint){
		uint c= a % b;
		return c;
	}

  	function add(uint a, uint b) internal constant returns (uint) {
    	uint c = a + b;
    	return c;
	}

	function power(uint A, uint B) internal constant returns (uint){ 
        return A**B;
    }

}

contract MerkelTree{
	function addData(uint256 _input,
					address _user) returns(bool success);
	function checkDataIntegrity(uint256[] _data,
								address _user) constant returns(bool complete);
}

contract testZKF{

	bool t;
	MerkelTree public Tree;

	struct valZKF{

		uint P; 
		uint Q; 
		uint G;
		uint ZKF0;
		uint ZKF1;
		uint ZKF2;
		uint ZKF3;
	}

	valZKF[] public zkproof;	
	
	function validateZKF(uint256 p, uint256 q, uint256 g,uint256[] zkf)
						constant returns(uint res){

		uint t= zkf[0];
		uint r= zkf[1];
		uint y= zkf[2];
		uint Hash= zkf[3];

		res= Math.mod(
				Math.mul(
					Math.mod(Math.power(g,r),p),
					Math.mod(Math.power(y,Hash),p)
				),p);

		return res;
	}

	function callZKFToValidate(uint index) public constant returns(uint[7]){
		
		uint[7] ValProof;
		
		ValProof[0]= zkproof[index].P;
		ValProof[1]= zkproof[index].Q;
		ValProof[2]= zkproof[index].G;
		ValProof[3]= zkproof[index].ZKF0;
		ValProof[4]= zkproof[index].ZKF1;
		ValProof[5]= zkproof[index].ZKF2;
		ValProof[6]= zkproof[index].ZKF3;

		return ValProof;
	}

	function addZKFToValidate(uint256 p, uint256 q, uint256 g,uint256[4] zkf)
						payable public returns(uint){


		zkproof.length++;
		zkproof[zkproof.length-1].P= p;
		zkproof[zkproof.length-1].Q= q;
		zkproof[zkproof.length-1].G= g;
		zkproof[zkproof.length-1].ZKF0= zkf[0];
		zkproof[zkproof.length-1].ZKF1= zkf[1];
		zkproof[zkproof.length-1].ZKF2= zkf[2];
		zkproof[zkproof.length-1].ZKF3= zkf[3];	
		
		return zkproof.length;	
	}	

	function getProofCount() public constant returns(uint) {
        return zkproof.length;
    }

	function addIntoMerkelTree(uint256 _data,
							   address _user,address merkelTreeContractAddress)
							   returns(bool success){

		//if(msg.sender != address(cont)) throw;
		Tree= MerkelTree(merkelTreeContractAddress);
		success= Tree.addData(_data, _user);
	}

	function checkMerkelTree(uint256[] _input,
							 address _user,address merkelTreeContractAddress) 
							 returns(bool ck){

		//if(msg.sender != address(_user)) throw;
		Tree= MerkelTree(merkelTreeContractAddress);
		ck= Tree.checkDataIntegrity(_input,_user);
					
	}
}
