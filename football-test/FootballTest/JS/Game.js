define (["JS/Tile.js","JS/Player.js","JS/LB.js"], function(Tile, Player, LB) {
	return class Game {
		constructor() {
			this.resetTokens();
			this.tiles = [];
			this.fieldElementId = "field";
			this.fieldElement = $("<table id='field'><tr id='row1'></tr><tr id='row2'><tr id='row3'></table>");
			this.field = null;
			this.rows = null;
			this.ballSnapped = false;
		}
		
		resetTokens() {
			this.player = null;
			this.token = null;
			this.ball = null;
			//this.defenders = {RDE:null,LDE:null,DT:null,LB:null,CB:null,FS:null}
			this.defenders = {LDE:null,DT:null,LB:null}
		}
		
		setFieldTokens() {
			this.player = new Player(this.tiles[1][9]);
			this.calculateFScores();
			this.addDefenders();
			//this.wr = new Receiver();
			//addDefenders();
		}
		
		addDefenders() {
			//this.defenders.RDE = new RDE();
			this.defenders.LDE = new LB(this.tiles[2][7]);
			this.defenders.DT = new LB(this.tiles[0][3])
			this.defenders.LB = new LB(this.tiles[1][5]);
			//this.defenders.CB = new CB();
			//this.defenders.FS = new FS():
		}
		
		checkOccupiedTiles(id, type) {
			var defenderOccupiedTileIds = [];
			for(var defender in this.defenders) {
				if(this.defenders.hasOwnProperty(defender)) {
					defenderOccupiedTileIds.push(this.defenders[defender].currentTile.id);
				}
			}
			if(type == 0) {
				if(defenderOccupiedTileIds.includes(id)) return 0;
				else return 1;
			}
			else if(type == 1) {
				if(id == this.player.currentTile.id) return 0;
				else if(defenderOccupiedTileIds.includes(id)) return 2;
				else return 1
			}
		}
		
		tackeled() {
			alert("Tackled!");
		}
		
		determineOutcomePlayer(status, tile, remove) {
			if(status == 0) this.tackeled();
			else if(status == 1) {
				this.player.move(tile);
				this.calculateFScores();
				//if(remove) this.removeReciever();
			}
		}
		
		determineOutcomeDefender(status, tile, defender) {
			if(status == 0) this.tackeled();
			else if(status == 1) {
				this.defenders[defender].move(tile);
			}
		}
		
		moveDefender() {
			for(var defender in this.defenders) {
				if(this.defenders.hasOwnProperty(defender)) {
					var smallest = null;
					if(this.defenders[defender].currentTile.x + 1 < 10) {
						smallest = this.findSmallestFScore(smallest, this.tiles[this.defenders[defender].currentTile.y][this.defenders[defender].currentTile.x+1]);
					}
					if(this.defenders[defender].currentTile.x - 1 > 0) {
						smallest = this.findSmallestFScore(smallest, this.tiles[this.defenders[defender].currentTile.y][this.defenders[defender].currentTile.x-1]);
					}
					if(this.defenders[defender].currentTile.y + 1 < 3) {
						smallest = this.findSmallestFScore(smallest, this.tiles[this.defenders[defender].currentTile.y + 1][this.defenders[defender].currentTile.x]);
					}
					if(this.defenders[defender].currentTile.y - 1 > -1) {
						smallest = this.findSmallestFScore(smallest, this.tiles[this.defenders[defender].currentTile.y - 1][this.defenders[defender].currentTile.x]);
					}
					//console.log(smallest);
					if(smallest.fScore < 5) {
						this.determineOutcomeDefender(this.checkOccupiedTiles(smallest.id, 1), smallest, defender);
					}
				}
			}
		}
		
		findSmallestFScore(currentValue, newValue) {
			if(currentValue == null || currentValue.fScore > newValue.fScore) return newValue;
			else return currentValue;
		}
		
		checkCode(code) {
			switch(code) {
				case 13: {
					this.ballSnapped = true;
					(function(game){
						setInterval(function(){game.moveDefender();}, 1000);
					}(this));
					/*this.wr.selectRoute();
					rde.runDefense(rde.dFour);
					lde.runDefense(lde.dFour);
					dt.runDefense(dt.dFour);
					lb.runDefense(lb.dFour);
					fs.runDefense(fs.dFour);
					cb.runDefense(cb.dFour);*/
					break;
				}
				case 32: {
					if(this.ballSnapped) {
						//if(this.canPass)this.pass();
					}
					break;
				}
				case 37: {
					if(this.ballSnapped) {
						if(this.player.currentTile.x == 0) {
							this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][9].id, 0), this.tiles[this.player.currentTile.y][9], true);
						}
						else {
							this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1].id, 0), this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1], false);
						}
					}
					break;
				}
				case 38: {
					if((this.player.currentTile.y - 1) > -1 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x].id, 0), this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x], false);
					break;
				}
				case 39: {
					if(this.player.currentTile.x + 1 < 10 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1].id, 0), this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1],false);
					break;
				}
				case 40: {
					if((this.player.currentTile.y + 1) < 3 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x].id, 0), this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x],false);
					break;
				}
			}
		}
		
		calculateFScores() {
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 10; j++) {
					this.tiles[i][j].calculateFScore(this.player.currentTile.x, this.player.currentTile.y);
				}
			}
		}
		
		createFieldTiles() {
			for(var i = 0; i < 3; i++) {
				var row = [];
				var rowId = this.field.children(0).children()[i].id;
				for(var j = 0; j < 10; j++) {
					var tile = new Tile(rowId,(i.toString()+j.toString()), j, i);
					row.push(tile);
				}
				this.tiles.push(row);
			}
		}
		
		createField(div) {
			$("#" + div).append(this.fieldElement);
			this.field = $("#" + this.fieldElementId);
		}
		
		readUserInput() {
			(function(game){
				window.onkeydown = function(evt) {
					game.checkCode(evt.keyCode)
				}}
			(this));
		}
	}
});