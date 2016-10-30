define (["JS/Token.js"],function(Token) {
	return class WR extends Token {
		constructor(tile) {
			super();
			this.elementId = "wr";
			this.elementHTML = "<div id='wr' class='token wr'>WR</div>";
			this.element = null;
			this.currentTile = tile
			//this.addElement(this.currentTile.element, this.elementHTML);
			this.canPass = true;
			this.lCurlRoute = [{x:5,y:2},{x:4,y:2},{x:3,y:2}];
			this.lGoRoute = [{x:5,y:2},{x:4,y:2},{x:3,y:2},{x:2,y:2},{x:1,y:2}];
			this.lCrossingRoute = [{x:5,y:2},{x:4,y:2},{x:3,y:2},{x:3,y:1},{x:3,y:0}];
			this.lDragRoute = [{x:5,y:2},{x:5,y:1},{x:5,y:0}];
			this.rCurlRoute = [{x:5,y:0},{x:4,y:0},{x:3,y:0}];
			this.rGoRoute = [{x:5,y:0},{x:4,y:0},{x:3,y:0},{x:2,y:0},{x:1,y:0}];
			this.rCrossingRoute = [{x:5,y:0},{x:4,y:0},{x:3,y:0},{x:3,y:1},{x:3,y:2}];
			this.rDragRoute = [{x:5,y:0},{x:5,y:1},{x:5,y:2}];
			this.routes=[this.lCurlRoute, this.lGoRoute, this.lCrossingRoute, this.lDragRoute, this.rCurlRoute, this.rGoRoute, this.rCrossingRoute, this.rDragRoute];
			this.halt = false;
			this.interval = 1000;
		}
		
		stopRoute() {
			this.removeElement(this.element);
			this.halt = true;
		}

		selectRandomRoute() {
			var tempInt = Math.floor(Math.random() * 8)
			var temp = this.routes[tempInt];
			return temp;
		}
	}
});