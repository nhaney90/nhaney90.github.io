define (["js/tokens/Defender.js"],function(Defender) {
	return class CB extends Defender {
		constructor(tile) {
			super();
			this.elementId = "cb";
			this.elementHTML = "<div id='cb' class='token defender'>CB</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.reactZone=4;
			this.interval=600;
		}
	}
});