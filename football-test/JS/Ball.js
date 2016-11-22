define (["JS/Token.js"],function(Token) {
	return class Ball extends Token {
		constructor(tile, game) {
			super();
			this.elementId = "ball";
			this.elementHTML = "<div id='ball' class='tile ball'>Ball</div>";
			this.element = null;
			this.currentTile = tile
			this.game = game
			this.addElement(this.currentTile.element, this.elementHTML);
		}
		
		fly() {
			var ball = this;
			return new Promise(function(resolve, reject) {
				(function(ball){
					var intervalID = setInterval(function() {
						if(ball.currentTile.x - 1 < 0) {
							clearInterval(intervalID);
							ball.removeElement(ball.element);
							resolve("incomplete");
						}
						else {
							ball.move(ball.game.tiles[ball.currentTile.y][ball.currentTile.x - 1]);
							if(ball.game.wr.currentTile == ball.currentTile) {
								clearInterval(intervalID);
								ball.removeElement(ball.element);
								resolve("caught");
							}
							for(var defender in ball.game.defenders) {
								if(ball.game.defenders.hasOwnProperty(defender)) {
									if(ball.game.defenders[defender].currentTile == ball.currentTile){
										if(ball.currentTile.x <7) {
											clearInterval(intervalID);
											ball.removeElement(ball.element);
											ball.game.defenders[defender].addBlink();
											resolve("intercepted");
											break;
										}
									}
								}
							}
						}
					}, 200);
				}(ball));
			});
		}
		
		kickOff(remove) {
			var ball = this;
			return new Promise(function(resolve, reject) {
				(function(ball){
					var intervalID = setInterval(function() {
						if(ball.currentTile.x + 1 > 9) {
							clearInterval(intervalID);
							if(remove) ball.removeElement(ball.element);
							resolve("complete");
						}
						else ball.move(ball.game.tiles[ball.currentTile.y][ball.currentTile.x + 1]);
					}, 200);
				}(ball));
			});
		}
		
		fieldGoal() {
			var ball = this;
			return new Promise(function(resolve, reject) {
				(function(ball){
					var intervalID = setInterval(function() {
						if(ball.currentTile.x - 1 < 0) {
							clearInterval(intervalID);
							ball.removeElement(ball.element);
							resolve("complete");
						}
					}, 200);
				}(ball));
			});
		}
	}
});