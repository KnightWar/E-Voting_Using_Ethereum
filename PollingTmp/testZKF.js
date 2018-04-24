Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var ZKFContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"Tree","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_input","type":"uint256[]"},{"name":"_user","type":"address"},{"name":"merkelTreeContractAddress","type":"address"}],"name":"checkMerkelTree","outputs":[{"name":"ck","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_data","type":"uint256"},{"name":"_user","type":"address"},{"name":"merkelTreeContractAddress","type":"address"}],"name":"addIntoMerkelTree","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"p","type":"uint256"},{"name":"q","type":"uint256"},{"name":"g","type":"uint256"},{"name":"zkf","type":"uint256[4]"}],"name":"validateZKF","outputs":[{"name":"res","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}])

var ballot= ZKFContract.new(
	{
		from: web3.eth.accounts[0],
		data: '0x6060604052341561000f57600080fd5b6103a88061001e6000396000f3006060604052600436106100485763ffffffff60e060020a60003504166368d82fb7811461004d578063730711da1461007c5780639ce5812b146100f1578063a76b29d814610119575b600080fd5b341561005857600080fd5b61006061016f565b604051600160a060020a03909116815260200160405180910390f35b341561008757600080fd5b6100dd600460248135818101908301358060208181020160405190810160405280939291908181526020018383602002808284375094965050600160a060020a0385358116956020013516935061018392505050565b604051901515815260200160405180910390f35b34156100fc57600080fd5b6100dd600435600160a060020a0360243581169060443516610271565b341561012457600080fd5b61015d6004803590602435906044359060e4606482608060405190810160405291908282608080828437509395506102f9945050505050565b60405190815260200160405180910390f35b6000546101009004600160a060020a031681565b6000805474ffffffffffffffffffffffffffffffffffffffff001916610100600160a060020a03848116820292909217808455041663276ac4e28585846040516020015260405160e060020a63ffffffff8516028152600160a060020a038216602482015260406004820190815290819060440184818151815260200191508051906020019060200280838360005b8381101561022a578082015183820152602001610212565b505050509050019350505050602060405180830381600087803b151561024f57600080fd5b6102c65a03f1151561026057600080fd5b505050604051805195945050505050565b6000805474ffffffffffffffffffffffffffffffffffffffff001916610100600160a060020a03848116820292909217808455041663ee35f1638585846040516020015260405160e060020a63ffffffff85160281526004810192909252600160a060020a03166024820152604401602060405180830381600087803b151561024f57600080fd5b6000808080808551935060208601519250604086015191506060860151905061034f61034961033161032b8a8761035c565b8c610361565b61034461033e868661035c565b8d610361565b610378565b8a610361565b9998505050505050505050565b900a90565b600080828481151561036f57fe5b06949350505050565b02905600a165627a7a7230582091a900b1a01e1aa324314350ca934cd83d4aed5b60a524a0b6c74033bfa27ef10029',
		gas: '2700000'
	},
	function(e,contract){
		console.log(e,contract);
		if (typeof contract.address !== 'undefined') {
			console.log('contract mined at: ' +contract.address);
		}
	}
)
//var deployedZKFAddress= '0x73694ebfd9ee9816be02873268708abf1e94d48a';
//var ZKFInstance = ZKFContract.at(deployedZKFAddress);

//var merkleTreeContractAddress='0x5f155fbe1a0124eff716592af46d7a09ffd25fad';


