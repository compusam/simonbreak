var generateNumbers = (function(){
var baseNumber = Math.floor((Math.random() * 10000) + 1);
var firstDivisor = Math.floor((Math.random() * baseNumber) + 1);
	return {
		getBase:function getBase() {
			return baseNumber;
		},
		getFirstDivisor: function getFirstDivisor() {
			return firstDivisor;
		}
	};
})();