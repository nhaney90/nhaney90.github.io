define (["js/tokens/defender.js"],function(Defender) {
	return class RDE extends Defender {
		constructor(tile) {
			super();
			this.elementId = "rde";
			this.elementHTML = "<div id='rde' class='token defender'>RDE</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.reactZone=4;
			this.interval=1000;
		}
	}
});