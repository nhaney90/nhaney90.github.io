define (["JS/Tile.js","JS/Player.js","JS/LB.js","JS/DT.js","JS/RDE.js","JS/LDE.js","JS/CB.js","JS/FS.js","JS/WR.js"], function(Tile, Player, LB, DT, RDE, LDE, CB, FS, WR) {
	return class Game {
		constructor() {
			this.tiles = [];
			this.fieldElementId = "field";
			this.fieldElement = $("<table id='field'><tr id='row1'></tr><tr id='row2'><tr id='row3'></table>");
			this.field = null;
			this.rows = null;
			this.ballSnapped = false;
			this.defenders = {RDE:null,LDE:null,DT:null,LB:null,CB:null,FS:null}
			this.player = null;
			this.ball = null;
		}
		
		resetTokens() {
			$(window).off();
			this.player.removeElement(this.player.element);
			this.player = null;
			this.ball = null;
			if(!this.wr.halt)this.wr.stopRoute();
			this.wr = null;
			for(var defender in this.defenders) {
				if(this.defenders.hasOwnProperty(defender)) {
					this.defenders[defender].removeElement(this.defenders[defender].element);
				}
			}
			this.defenders = {RDE:null,LDE:null,DT:null,LB:null,CB:null,FS:null}
		}
		
		setFieldTokens() {
			this.player = new Player(this.tiles[1][9]);
			this.calculateFScores();
			this.addDefenders();
			this.wr = new WR(this.tiles[2][6]);
		}
		
		addDefenders() {
			this.defenders.LDE = new LDE(this.tiles[0][6]);
			this.defenders.RDE = new RDE(this.tiles[2][6]);
			this.defenders.DT = new DT(this.tiles[1][6]);
			this.defenders.LB = new LB(this.tiles[1][4]);
			this.defenders.CB = new CB(this.tiles[0][2]);
			this.defenders.FS = new FS(this.tiles[2][0]);
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
			this.ballSnapped = false;
			this.resetTokens();
			this.setFieldTokens();
			this.readUserInput();
		}
		
		determineOutcomePlayer(status, tile, remove) {
			if(status == 0) this.tackeled();
			else if(status == 1) {
				this.player.move(tile);
				if(tile.x < 7) {
					this.player.canPass = false;
					if(!this.wr.halt)this.wr.stopRoute();
				}
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
		
		selectRandomDefender() {
			if(this.player.canPass == true) {
				var random = Math.floor(Math.random() * 6)
				if(random < 2) return "RDE";
				else if(random == 2 || random == 3) return "LDE"
				else if(random == 4) return "DT";
				else return "LB";
			}
			else {
				var random = Math.floor(Math.random() * 12)
				if(random < 3) return "LB";
				else if(random > 2 && random < 6) return "CB";
				else if(random > 5 && random < 9) return "FS";
				else if(random == 9) return "RDE";
				else if(random == 10) return "LDE";
				else return "DT";
			}
		}
		
		moveDefender() {
			var success = false;
			while(success == false) {
				var defender = this.selectRandomDefender();
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

				if(smallest.fScore <= this.defenders[defender].reactZone) {
					success = true;
				}
			}
			this.determineOutcomeDefender(this.checkOccupiedTiles(smallest.id, 1), smallest, defender);
		}
		
		findSmallestFScore(currentValue, newValue) {
			if(currentValue == null || currentValue.fScore > newValue.fScore) return newValue;
			else return currentValue;
		}
		
		runRoute() {
			var path = this.wr.selectRandomRoute();
			(function(game, routePath){
				var interval = setInterval(function(){
					console.log(game.player.canPass);
					if(routePath.length > 0 && game.player.canPass == true) {
						var node = routePath.shift();
						game.wr.move(game.tiles[node.y][node.x])
					}
					else {
						clearInterval(interval);
					}
				}, 1000);
			}(this, path));
		}
		
		checkCode(code) {
			switch(code) {
				case 13: {
					if(!this.ballSnapped) {
						this.player.canPass = true;
						this.ballSnapped = true;
						this.runRoute();
						(function(game){
							var interval = setInterval(function(){
								console.log(game.player.canPass);
								if(game.ballSnapped == false) clearInterval(interval);
								else if(game.player.canPass == false) game.moveDefender();
								else game.moveDefender();
							}, 1000);
						}(this));
					}
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
				$(window).on("keydown", function(evt) {
					game.checkCode(evt.keyCode)
				});
			}(this));
		}
	}
});