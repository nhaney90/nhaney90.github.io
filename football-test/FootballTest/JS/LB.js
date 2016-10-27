define (["JS/Defender.js"],function(Defender) {
	return class LB extends Defender {
		constructor(tile) {
			super();
			this.elementId = "lb";
			this.elementHTML = "<div id='lb' class='tile defender'>LB</div>";
			this.element = null;
			this.currentTile = tile 
			this.addElement(this.currentTile.element, this.elementHTML);
		}
	}
});