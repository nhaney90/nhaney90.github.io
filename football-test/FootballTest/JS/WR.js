define (["JS/Token.js"],function(Token) {
	return class WR extends Token {
		constructor(tile) {
			super();
			this.elementId = "wr";
			this.elementHTML = "<div id='wr' class='token wr'>WR</div>";
			this.element = null;
			this.currentTile = tile
			this.addElement(this.currentTile.element, this.elementHTML);
			this.canPass = true;
			this.curlRoute = [{x:6,y:2},{x:5,y:2},{x:4,y:2},{x:3,y:2}];
			this.goRoute = [{x:6,y:2},{x:5,y:2},{x:4,y:2},{x:3,y:2},{x:2,y:2},{x:1,y:2}];
			this.crossingRoute = [{x:6,y:2},{x:5,y:2},{x:4,y:2},{x:3,y:2},{x:2,y:1},{x:1,y:0}];
			this.dragRoute = [{x:6,y:2},{x:5,y:2},{x:5,y:1},{x:5,y:0}];
			this.routes=[this.curlRoute, this.goRoute, this.crossingRoute, this.dragRoute];
			this.halt = false;
		}
		
		stopRoute() {
			this.removeElement(this.element);
			this.halt = true;
		}

		selectRandomRoute() {
			var tempInt = Math.floor(Math.random() * 3)
			var temp = this.routes[tempInt];
			return temp;
		}
	}
});