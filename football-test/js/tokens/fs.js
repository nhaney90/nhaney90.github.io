define (["js/tokens/defender.js"],function(Defender) {
	return class FS extends Defender {
		constructor(tile) {
			super();
			this.elementId = "fs";
			this.elementHTML = "<div id='fs' class='token defender'>FS</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.reactZone=4;
			this.interval=700;
		}
	}
});