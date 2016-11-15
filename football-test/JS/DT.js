define (["JS/Defender.js"],function(Defender) {
	return class DT extends Defender {
		constructor(tile) {
			super();
			this.elementId = "dt";
			this.elementHTML = "<div id='dt' class='token defender'>DT</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
			this.reactZone=4;
			this.interval=1000;
		}
	}
});