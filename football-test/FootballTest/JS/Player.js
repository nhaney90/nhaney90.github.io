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
		
		addBlink() {
			console.log("adsfasd");
			$("#" + this.elementId).addClass("blink");
		}
		
		removeBlink() {
			$("#" + this.elementId).removeClass("blink");
		}
				
	}
});