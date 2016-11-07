define (["JS/Tile.js","JS/Player.js","JS/LB.js","JS/DT.js","JS/RDE.js","JS/LDE.js","JS/CB.js","JS/FS.js","JS/WR.js","JS/Utils/Enums.js","JS/Stats.js"], function(Tile, Player, LB, DT, RDE, LDE, CB, FS, WR, Enums, Stats) {
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
			this.stats = new Stats();
			this.stats.createDrive(25);
			this.playPaused = false;
			this.gameLoopCounter = 0;
			this.gameLoopDefenderMove = 0;
			this.currentKeyCode = null;
			this.gameLoop();
			this.curentDefender = null;
			this.gameLoopSeconds = 0;
			this.validKeys = [13,32,37,38,39,40];
		}
		
		addDefenders() {
			this.defenders.LDE = new LDE(this.tiles[0][6]);
			this.defenders.RDE = new RDE(this.tiles[2][6]);
			this.defenders.DT = new DT(this.tiles[1][6]);
			this.defenders.LB = new LB(this.tiles[1][4]);
			this.defenders.CB = new CB(this.tiles[0][2]);
			this.defenders.FS = new FS(this.tiles[2][0]);
		}
		
		calculateFScores() {
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 10; j++) {
					this.tiles[i][j].calculateFScore(this.player.currentTile.x, this.player.currentTile.y);
				}
			}
		}
		
		checkBallStatus(status) {
			this.ballInAir = false;
			if(status == "caught") {
				this.swapWRAndPlayer();
			}
			else if(status == "intercepted") {
				this.stopPlay(Enums.playEndedBy.interception);
			}
			else {
				this.stopPlay(Enums.playEndedBy.incomplete);
			}
		}
		
		checkOccupiedTiles(id, type) {
			var defenderOccupiedTileIds = [];
			for(var defender in this.defenders) {
				if(this.defenders.hasOwnProperty(defender)) {
					defenderOccupiedTileIds.push(this.defenders[defender].currentTile.id);
				}
			}
			if(type == Enums.tokenEnum.player) {
				//player is tackled
				if(defenderOccupiedTileIds.includes(id)) return Enums.tileEnum.defender;
				//player moves forward
				else return Enums.tileEnum.open;
			}
			else if(type == Enums.tokenEnum.defender) {
				//player is tackled
				if(id == this.player.currentTile.id) return Enums.tileEnum.player;
				//space is occupied by defender
				else if(defenderOccupiedTileIds.includes(id)) return Enums.tileEnum.defender;
				//receiver or ball
				else return Enums.tileEnum.open;
			}
			else if(type == Enums.tokenEnum.wr) {
				if(defenderOccupiedTileIds.includes(id))return Enums.tileEnum.defender;
				else return Enums.tileEnum.open;
			}
		}
		
		checkCode() {
			console.log(this.currentKeyCode);
			switch(this.currentKeyCode) {
				//space - pass ball
				case 32: {
					if(this.player.canPass && this.ballInAir == false){
						this.ballInAir = true;
						this.stats.currentDrive.currentPlay.type = Enums.playType.pass;
						(function(game){
							game.player.pass(game).then(function(response) {game.checkBallStatus(response);});
						}(this));
					}
					break;
				}
				//move left
				case 37: this.movePlayer(Enums.playerMovement.left); break;
				//move up
				case 38: this.movePlayer(Enums.playerMovement.up); break;
				//move right
				case 39: this.movePlayer(Enums.playerMovement.right); break;
				//move down
				case 40: this.movePlayer(Enums.playerMovement.down); break;
			}
			this.currentKeyCode = null;
		}
		
		coreGameLogic() {
			if(this.ballSnapped){
				this.calculateFScores();
				if(this.currentKeyCode) this.checkCode();
				if(this.gameLoopCounter == 0) {
					this.wr.selectRandomRoute();
				}
				else if(this.gameLoopSeconds == 3 && this.player.canPass && this.defenders.LB.moved == false) {
					var tile = this.defenders.LB.enterThrowingLane(this);
					this.defenders.LB.move(tile);
					this.defenders.LB.moved=true;
				}
				else if(this.gameLoopCounter == 7) {
					this.moveDefender();
				}
				else if(this.gameLoopCounter == 9) {
					if(!this.wr.halt) this.runRoute();
					this.stats.clock.decrementTime();
					this.gameLoopCounter = 0;
					this.gameLoopSeconds++;
				}
				this.gameLoopCounter++;
			}
			else if(this.currentKeyCode == 13){
				this.startPlay();
			}
			
			/*if(this.playPaused) {
						this.playPaused = false;
						this.resetTokens();
						this.setFieldTokens();
						this.readUserInput();
					}*/
		}
		
		createField(div) {
			$("#" + div).append(this.fieldElement);
			this.field = $("#" + this.fieldElementId);
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
		
		determineOutcomeDefender(status, tile) {
			if(status == Enums.tileEnum.player && this.ballInAir == false) this.tackled();
			else if(status == Enums.tileEnum.open) {
				this.currentDefender.move(tile);
				/*(function(game){
					setTimeout(function(){game.moveDefender();}, game.defenders[defender].interval);
				}(this));*/
			}
			else this.moveDefender();
		}
		
		determineOutcomePlayer(status, tile, direction) {
			if(status == Enums.tileEnum.defender && this.ballInAir == false) this.tackled();
			else if(status == Enums.tileEnum.open) {
				this.player.move(tile);
				if(direction == Enums.playerMovement.left) this.stats.currentDrive.currentPlay.yards += 1;
				else if(direction == Enums.playerMovement.left) this.stats.currentDrive.currentPlay.yards -=1;
				if(tile.x < 7) {
					this.player.canPass = false;
					if(this.wr.element)this.wr.stopRoute();
				}
				this.calculateFScores();
			}
		}
		
		findSmallestFScore(currentValue, newValue) {
			if(currentValue == null || currentValue.fScore > newValue.fScore) return newValue;
			else return currentValue;
		}
		
		gameLoop() {
			(function(game){
				setInterval(function(){
					game.coreGameLogic();
				}, 100);
			}(this));
		}
		
		moveDefender() {
			var success = false;
			while(success == false) {
				var smallest = null;
				this.currentDefender = this.defenders[this.selectRandomDefender()];
				if(this.currentDefender.currentTile.x + 1 < 10) {
					smallest = this.findSmallestFScore(smallest, this.tiles[this.currentDefender.currentTile.y][this.currentDefender.currentTile.x+1]);
				}
				if(this.currentDefender.currentTile.x - 1 > 0) {
					smallest = this.findSmallestFScore(smallest, this.tiles[this.currentDefender.currentTile.y][this.currentDefender.currentTile.x-1]);
				}
				if(this.currentDefender.currentTile.y + 1 < 3) {
					smallest = this.findSmallestFScore(smallest, this.tiles[this.currentDefender.currentTile.y + 1][this.currentDefender.currentTile.x]);
				}
				if(this.currentDefender.currentTile.y - 1 > -1) {
					smallest = this.findSmallestFScore(smallest, this.tiles[this.currentDefender.currentTile.y - 1][this.currentDefender.currentTile.x]);
				}
				if(smallest.fScore <= this.currentDefender.reactZone) {
					success = true;
				}
			}
			this.determineOutcomeDefender(this.checkOccupiedTiles(smallest.id, Enums.tokenEnum.defender), smallest);
		}
		
		movePlayer(direction) {
			if(direction == Enums.playerMovement.left) {
				if(this.player.currentTile.x == 0) {
					this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][9].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][9], direction);
				}
				else {
					this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1], direction);
				}
			}
			else if(direction == Enums.playerMovement.up) {
				if((this.player.currentTile.y - 1) > -1 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x], direction);
			}
			else if(direction == Enums.playerMovement.right) {
				if(this.player.currentTile.x + 1 < 10 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1],direction);
				else if(this.player.currentTile.x + 1 > 9 && this.ballSnapped && this.player.canPass == false) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][0].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][0],direction);
			}
			else if(direction == Enums.playerMovement.down) {
				if((this.player.currentTile.y + 1) < 3 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x],direction);
			}
		}
		
		readUserInput() {
			(function(game){
				$(window).on("keydown", function(evt) {
					if(game.validKeys.indexOf(evt.keyCode) > -1) game.currentKeyCode = evt.keyCode;
				});
			}(this));
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
		
		runRoute() {
			if(this.wr.currentRoute.nodes.length > 0) {
				var node = this.wr.currentRoute.nodes[0];
				var occupied = this.checkOccupiedTiles(this.tiles[node.y][node.x].id, Enums.tokenEnum.wr);
				if(occupied == Enums.tileEnum.open) {
					this.wr.currentRoute.nodes.shift();
					this.wr.move(this.tiles[node.y][node.x]);
				}
			}
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
		
		setFieldTokens() {
			this.player = new Player(this.tiles[1][9]);
			this.calculateFScores();
			this.addDefenders();
			this.wr = new WR(this.tiles[2][6]);
		}
		
		startPlay() {
			this.player.canPass = true;
			this.ballSnapped = true;
			this.stats.currentDrive.startPlay();
		}
		
		stopPlay(endedBy) {
			this.ballSnapped = false;
			this.wr.halt = true;
			this.stats.clock.stopTime();
			this.stats.checkDriveStatus(endedBy);
			this.playPaused = true;
		}
		
		swapWRAndPlayer() {
			this.player.canPass = false;
			this.stats.currentDrive.currentPlay.yards += (this.player.currentTile.x - this.wr.currentTile.x);
			this.player.move(this.wr.currentTile);
			this.halt = true;
		}
		
		tackled() {
			this.player.addBlink();
			if(this.player.canPass) this.stopPlay(Enums.playEndedBy.sack);
			else this.stopPlay(Enums.playEndedBy.tackle);
		}
	}
});