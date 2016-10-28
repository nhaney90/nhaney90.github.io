define (["jquery"],function($) {
	return class Token {
		constructor() {}
					
		addElement(tile, elementHTML) {
			this.element = $(elementHTML)
			tile.append(this.element);
		}
					
		removeElement(element) {
			element.remove();
			this.element = null;
		}
		
		move(tile) {
			this.removeElement(this.element);
			this.addElement(tile.element, this.elementHTML);
			this.currentTile = tile
		}
	}
});