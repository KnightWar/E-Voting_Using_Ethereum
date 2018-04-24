
var bigInt = require("big-integer");
module.exports = function (p,
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

	console.log("GV:",t)
	console.log("res:",res.toString())
	
	if(t == res.toString())	
		return true
	else
		return false
}
