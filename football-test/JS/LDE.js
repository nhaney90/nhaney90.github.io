define (["JS/Defender.js"],function(Defender) {
	return class LDE extends Defender {
		constructor(tile) {
			super();
			this.elementId = "lde";
			this.elementHTML = "<div id='lde' class='token defender'>LDE</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.reactZone=4;
			this.interval=1000;
		}
	}
});