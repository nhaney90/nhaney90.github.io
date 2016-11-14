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
			yardline -= 17;
			var randomValue = Math.floor(Math.random() * 100) + 1;
			console.log(randomValue);
			var equation = 100 - ((-0.0188 * (yardline * yardline)) + (4.3453 * yardline) - 130.26);
			console.log(equation);
			
			if(randomValue > equation) return true;
			else return false;
		}
	}
});