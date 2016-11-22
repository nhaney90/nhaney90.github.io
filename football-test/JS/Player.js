define (["JS/Token.js", "JS/Ball.js"],function(Token, Ball) {
	return class Player extends Token {
		constructor(tile) {
			super();
			this.elementId = "player";
			this.elementHTML = "<div id='player' class='token player'>QB</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.canPass = false;
		}
				
		pass(game) {
			var ball = new Ball(this.currentTile, game);
			return new Promise(function(resolve, reject) {
				resolve(ball.fly());
			});
		}

		kick(yardline) {
			var randomValue = Math.floor(Math.random() * 100) + 1;
			//y = 0.0013x**3 - 0.3229x**2 + 28.122x - 757.77
			var equation = 100 - ((0.0013 * (yardline * yardline * yardline)) - (0.3229 * (yardline * yardline)) + (28.122 * yardline) - 757.77);
			console.log("Random Value: ", randomValue);
			console.log("Equation: ", equation);
			
			if(randomValue > equation) return true;
			else return false;
		}
	}
});