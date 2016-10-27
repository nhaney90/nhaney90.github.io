define (["JS/Token.js"],function(Token) {
	return class Player extends Token {
		constructor(tile) {
			super();
			this.elementId = "player";
			this.elementHTML = "<div id='player' class='tile player'>QB</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.canPass = true;
		}
				
		pass() {
			/*if(this.ball == null) {
				this.ball = new Ball(this.currentTile, {left:this.adjacentTiles.left, right:this.adjacentTiles.right, bottom:this.adjacentTiles.bottom, top:this.adjacentTiles.top}, this);
				this.ball.fly().then(this.checkStatus, this.turnOver);
			}*/
		}
				
	}
});