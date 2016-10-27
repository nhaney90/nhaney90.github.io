define (["JS/Token.js"],function(Token) {
	return class Player extends Token {
		constructor(tile) {
			super();
			this.elementId = "player";
			this.element = $("<div id='player' class='tile player'>QB</div>");
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.element);
			this.setInitialTiles();
			this.canPass = true;
			this.ballSnapped = false;
		}
				
		setInitialTiles() {
			//this.adjacentTiles = {left:19,right:null,bottom:30,top:10};
		}
				
		/*move(position) {
			if($("#tile" + position).children().length != 0) {
				var id = $("#tile" + position).children()[0].id;
				if(id == "wr") {
					this.moveToken(position);
				}
				else {
					alert("tackled!");
				}
			}
			else {
				this.moveToken(position);
			}
			if(position == 27 || position == 17 || position == 7) this.canPass = false;
		}*/
				
		pass() {
			/*if(this.ball == null) {
				this.ball = new Ball(this.currentTile, {left:this.adjacentTiles.left, right:this.adjacentTiles.right, bottom:this.adjacentTiles.bottom, top:this.adjacentTiles.top}, this);
				this.ball.fly().then(this.checkStatus, this.turnOver);
			}*/
		}
				
	}
});