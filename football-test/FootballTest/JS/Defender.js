define (["JS/Token.js"],function(Token) {
	return class Defender extends Token {
		constructor() {super();}
		
		/*delayMovement(tile) {
			var defender = this;
			return new Promise(function(resolve, reject) {
				(function(defender, tile){
					setTimeout(function() {defender.move(tile); resolve("success");}, defender.interval);
				}(defender, tile));
			});
		}*/
	}
});