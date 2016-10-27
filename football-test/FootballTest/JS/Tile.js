define (["jquery"],function($) {
	return class Tile {
		constructor(id,x,y) {
			this.fScore = null;
			this.gScore = 1;
			this.hScore = null;
			this.occupied = false;
			this.los = false
			this.firstDown = false;
			this.opponentEndzone = false;
			this.endZone = false;
			this.x = x
			this.y = y
			this.element = $("<th class='tile'></th>");
			this.addTile(id)
		}
		
		calculateHScore(targetX,targetY) {
			this.hScore =  Math.abs(this.x - targetX) + Math.abs(this.y - targetY);
		}
		
		calculateFScore() {
			this.fScore = this.gScore + this.hScore;
		}
		
		addTile(id) {
			$("#" + id).append(this.element);
		}
	}
});
	
	