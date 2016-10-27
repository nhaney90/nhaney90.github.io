define (["JS/Tile.js","JS/Player.js"], function(Tile, Player) {
	return class Game {
		constructor() {
			this.resetTokens();
			this.tiles = [];
			this.fieldElementId = "field";
			this.fieldElement = $("<table id='field'><tr id='row1'></tr><tr id='row2'><tr id='row3'></table>");
			this.field = null;
			this.rows = null;
		}
		
		resetTokens() {
			this.player = null;
			this.token = null;
			this.ball = null;
			this.defenders = {RDE:null,LDE:null,DT:null,LB:null,CB:null,FS:null}
		}
		
		setFieldTokens() {
			this.player = new Player(this.tiles[1][9]);
			//this.wr = new Receiver();
			//addDefenders();
		}
		
		/*addDefenders() {
			this.defenders.RDE = new RDE();
			this.defenders.LDE = new LDE();
			this.defenders.DT = new DT();
			this.defenders.LB = new LB();
			this.defenders.CB = new CB();
			this.defenders.FS = new FS():
		}
		
		checkCode(keycode) {}*/
		
		createFieldTiles() {
			for(var i = 0; i < 3; i++) {
				var row = [];
				var id = this.field.children(0).children()[i].id;
				for(var j = 0; j < 10; j++) {
					var tile = new Tile(id, j, i);
					row.push(tile);
				}
				this.tiles.push(row);
			}
		}
		
		createField(div) {
			$("#" + div).append(this.fieldElement);
			this.field = $("#" + this.fieldElementId);
		}
	}
});