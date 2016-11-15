define (["JS/Defender.js"],function(Defender) {
	return class LB extends Defender {
		constructor(tile) {
			super();
			this.elementId = "lb";
			this.elementHTML = "<div id='lb' class='token defender'>LB</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.reactZone=5;
			this.moved = false;
			this.moveInterval = Math.floor(Math.random() * 3) + 2;
			this.throwingLaneTile = null;
		}
		
		enterThrowingLane(game) {
			var temp = Math.floor(Math.random() * 4);
			if(temp == 0) this.throwingLaneTile = game.tiles[this.currentTile.y - 1][this.currentTile.x];
			else if(temp == 1) this.throwingLaneTile = game.tiles[this.currentTile.y + 1][this.currentTile.x];
			else if(temp ==2) this.throwingLaneTile = game.tiles[this.currentTile.y][this.currentTile.x+1];
			else this.throwingLaneTile = game.tiles[this.currentTile.y][this.currentTile.x-1];
		}
	}
});