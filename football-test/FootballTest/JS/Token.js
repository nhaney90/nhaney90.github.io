define (["jquery"],function($) {
	return class Token {
		constructor() {}
					
		addElement(tile, element) {
			console.log(tile);
			tile.append(element);
			this.element = element;
		}
					
		removeElement(element) {
			element.remove();
			this.element = null;
		}
					
		/*setAdjacentTiles(position) {
			this.adjacentTiles.left = position - 1;
			this.adjacentTiles.right = position + 1;
			this.adjacentTiles.top = position -10;
			this.adjacentTiles.bottom = position + 10;
			if(this.adjacentTiles.top < 1) this.adjacentTiles.top = null;
			if(this.adjacentTiles.bottom > 30) this.adjacentTiles.bottom = null;
		}
					
		moveToken(position) {
			this.removeElement(this.currentTile, this.elementId);
			this.currentTile = position;
			this.addElement(this.currentTile, this.elementText);
			this.setAdjacentTiles(this.currentTile);
		}*/
	}
});