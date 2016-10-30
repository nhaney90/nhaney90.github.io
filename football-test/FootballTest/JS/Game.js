define (["JS/Tile.js","JS/Player.js","JS/LB.js","JS/DT.js","JS/RDE.js","JS/LDE.js","JS/CB.js","JS/FS.js","JS/WR.js","JS/Stats"], function(Tile, Player, LB, DT, RDE, LDE, CB, FS, WR) {
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
			this.ballInAir = false;
			this.tokenEnum = {player:0, defender:1, wr:2, ball: 3}
			this.tileEnum = {open:0, player: 1, defender: 2, wr: 3, ball: 4}
		}
		
		resetTokens() {
			$(window).off();
			this.player.removeElement(this.player.element);
			this.player = null;
			this.ball = null;
			if(this.wr.element)this.wr.stopRoute();
			this.wr = null;
			this.ballInAir = false;
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
			if(type == this.tokenEnum.player) {
				//player is tackled
				if(defenderOccupiedTileIds.includes(id)) return this.tileEnum.defender;
				//player moves forward
				else return this.tileEnum.open;
			}
			else if(type == this.tokenEnum.defender) {
				//player is tackled
				if(id == this.player.currentTile.id) return this.tileEnum.player;
				//space is occupied by defender
				else if(defenderOccupiedTileIds.includes(id)) return this.tileEnum.defender;
				//receiver or ball
				else return this.tileEnum.open;
			}
			else if(type == this.tokenEnum.wr) {
				if(defenderOccupiedTileIds.includes(id))return this.tileEnum.defender;
				else return this.tileEnum.open;
			}
		}
		
		tackled() {
			this.ballSnapped = false;
			this.wr.halt = true;
			if(this.player.canPass) alert("Sacked!");
			else alert("Tackled!");
			this.resetTokens();
			this.setFieldTokens();
			this.readUserInput();
		}
		
		determineOutcomePlayer(status, tile, remove) {
			if(status == this.tileEnum.defender && this.ballInAir == false) this.tackled();
			else if(status == this.tileEnum.open) {
				this.player.move(tile);
				if(tile.x < 7) {
					this.player.canPass = false;
					if(this.wr.element)this.wr.stopRoute();
				}
				this.calculateFScores();
			}
		}
		
		determineOutcomeDefender(status, tile, defender) {
			if(status == this.tileEnum.player && this.ballInAir == false) this.tackled();
			else if(status == this.tileEnum.open) {
				this.defenders[defender].move(tile);
				(function(game, defender){
					setTimeout(function(){game.moveDefender();}, game.defenders[defender].interval);
				}(this, defender));
			}
			else this.moveDefender();
		}
		
		selectRandomDefender() {
			if(this.player.canPass == true) {
				var random = Math.floor(Math.random() * 5)
				if(random < 2) return "RDE";
				else if(random == 2 || random == 3) return "LDE";
				else return "DT";
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
			if(this.ballSnapped == true) {
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
				this.determineOutcomeDefender(this.checkOccupiedTiles(smallest.id, this.tokenEnum.defender), smallest, defender);
			}
		}
		
		findSmallestFScore(currentValue, newValue) {
			if(currentValue == null || currentValue.fScore > newValue.fScore) return newValue;
			else return currentValue;
		}
		
		runRoute(route) {
			var path;
			if(route) path = route;
			else path = this.wr.selectRandomRoute();
			(function(game, routePath) {
				console.log(game.player.canPass);
				if(routePath.length > 0 && game.player.canPass == true) {
					var node;
					var occupied = game.checkOccupiedTiles(game.tiles[routePath[0].y][routePath[0].x].id, game.tokenEnum.wr);
					console.log(occupied);
					if(occupied == game.tileEnum.open) {
						node = routePath.shift();
						game.wr.move(game.tiles[node.y][node.x]);
					}
					setTimeout(function(){game.runRoute(routePath);}, game.wr.interval);
				}
			}(this, path));
		}
		
		ballIntercepted() {
			alert("Picked Off!");
			this.ballSnapped = false;
			this.resetTokens();
			this.setFieldTokens();
			this.readUserInput();
		}
		
		passIncomplete() {
			alert("Incomplete!");
			this.ballSnapped = false;
			this.resetTokens();
			this.setFieldTokens();
			this.readUserInput();
		}
		
		checkBallStatus(status) {
			this.ballInAir = false;
			if(status == "caught") {
				this.swapWRAndPlayer();
			}
			else if(status == "intercepted") {
				this.ballIntercepted();
			}
			else {
				this.passIncomplete();
			}
		}
		
		swapWRAndPlayer() {
			this.wr.stopRoute();
			this.player.canPass = false;
			this.player.move(this.wr.currentTile);
		}
		
		checkCode(code) {
			switch(code) {
				//enter - snap ball
				case 13: {
					if(!this.ballSnapped) {
						this.player.canPass = true;
						this.ballSnapped = true;
						(function(game){
							setTimeout(function(){game.runRoute(null);}, game.wr.interval);
						}(this));
						this.moveDefender();
						var tile = this.defenders.LB.enterThrowingLane(this);
						(function(game, tile){
							setTimeout(function(){
								if(game.ballSnapped == true)game.defenders.LB.move(tile);
							}, 3000);
						}(this, tile));
					}
					break;
				}
				//space - pass ball
				case 32: {
					if(this.ballSnapped) {
						if(this.player.canPass && this.ballInAir == false){
							this.ballInAir = true;
							(function(game){
								game.player.pass(game).then(function(response) {console.log(response);game.checkBallStatus(response);});
							}(this));
						}
					}
					break;
				}
				//move left
				case 37: {
					if(this.ballSnapped) {
						if(this.player.currentTile.x == 0) {
							this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][9].id, this.tokenEnum.player), this.tiles[this.player.currentTile.y][9], true);
						}
						else {
							this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1].id, this.tokenEnum.player), this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1], false);
						}
					}
					break;
				}
				//move up
				case 38: {
					if((this.player.currentTile.y - 1) > -1 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x].id, this.tokenEnum.player), this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x], false);
					break;
				}
				//move right
				case 39: {
					if(this.player.currentTile.x + 1 < 10 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1].id, this.tokenEnum.player), this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1],false);
					else if(this.player.currentTile.x + 1 > 9 && this.ballSnapped && this.player.canPass == false) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][0].id, this.tokenEnum.player), this.tiles[this.player.currentTile.y][0],false);
					break;
				}
				//move down
				case 40: {
					if((this.player.currentTile.y + 1) < 3 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x].id, this.tokenEnum.player), this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x],false);
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