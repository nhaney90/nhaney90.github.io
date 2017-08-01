define (["js/components/tile.js","js/tokens/player.js","js/tokens/lb.js","js/tokens/dt.js","js/tokens/rde.js","js/tokens/lde.js","js/tokens/cb.js","js/tokens/fs.js","js/tokens/wr.js","js/utils/enums.js","js/components/stats.js", "js/components/kickoffs.js", "js/components/database.js"], function(Tile, Player, LB, DT, RDE, LDE, CB, FS, WR, Enums, Stats, Kickoffs, Database) {
	return class Game {
		constructor(playerName) {
			this.database = new Database();
			this.tiles = [];
			this.fieldElementId = "field";
			this.fieldElement = $("<table id='field'><tr id='row1'></tr><tr id='row2'><tr id='row3'></table>");
			this.field = null;
			this.rows = null;
			this.ballSnapped = false;
			this.defenders = {RDE:null,LDE:null,DT:null,LB:null,CB:null,FS:null}
			this.player = null;
			this.ballInAir = false;
			this.stats = new Stats(playerName);
			this.playPaused = true;
			this.gameLoopCounter = 0;
			this.gameLoopDefenderMove = 0;
			this.currentKeyCode = null;
			this.gameLoop();
			this.curentDefender = null;
			this.gameLoopSeconds = 0;
			this.validKeys = [13,32,37,38,39,40,75];
			this.interval;
			this.kickoffs = new Kickoffs(this);
		}
		
		addDefenders() {
			this.defenders.LDE = new LDE(this.tiles[0][6]);
			this.defenders.RDE = new RDE(this.tiles[2][6]);
			this.defenders.DT = new DT(this.tiles[1][6]);
			this.defenders.LB = new LB(this.tiles[1][4], "", "LB");
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
				if(this.defenders.hasOwnProperty(defender) && this.defenders[defender] != null) {
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
				if(this.kickoffs.kickReturn == false) {
					if(this.player.canPass && this.gameLoopSeconds == this.defenders.LB.moveInterval && this.defenders.LB.moved == false) {
						this.defenders.LB.enterThrowingLane(this);
						if(this.defenders.LB.throwingLaneTile != this.wr.currentTile) {
							this.defenders.LB.move(this.defenders.LB.throwingLaneTile);
							this.defenders.LB.moved=true;
						}
						else this.defenders.LB.moveInterval++;
					}
					if(this.gameLoopCounter == 1) {
						this.gameLoopDefenderMove = Math.floor(Math.random() * 2) + 6;
						console.log(this.gameLoopDefenderMove);
					}
					if(this.gameLoopCounter == this.gameLoopDefenderMove) {
						this.moveDefender();
					}
					if(this.gameLoopCounter == 9) {
						if(!this.wr.halt) this.runRoute();
					}
				}
				else {
					if(this.gameLoopCounter == 7) {
						if(this.gameLoopSeconds < 6) {
							this.kickoffs.addRandomDefender(this.gameLoopSeconds);
						}
						this.moveDefender();
					}
				}
				if(this.gameLoopCounter == 9){
					this.gameLoopCounter = 0;
					this.gameLoopSeconds++;
					this.stats.clock.decrementTime();
				}
				this.gameLoopCounter++;
			}
			else if(this.currentKeyCode == 13 && this.kickoffs.kickReturn == false){
				console.log("clicked");
				this.currentKeyCode = null;
				if(this.playPaused == true) {
					this.playPaused = false;
					if(this.stats.readyForKickoff == true) {
						this.stats.readyForKickoff = false;
						this.kickoffs.kickoffBall();
					}
					else this.startPlay();
				}
				else {
					this.resetTokens();
					this.playPaused = true;
					this.gameLoopCounter = 0;
					this.gameLoopSeconds = 0;
					if(this.stats.readyForKickoff == false)this.setFieldTokens();
					else this.kickoffs.addKickoffTokens();
				}
			}
			else if(this.currentKeyCode == 75 && this.playPaused) {
				this.currentKeyCode = null;
				this.resetTokens();
				this.player = new Player(this.tiles[0][7]);
				this.kickoffs.addFieldGoalTokens();
				this.kickoffs.kickFieldGoal();
				this.stats.currentDrive.startPlay();
				var fieldGoalResult = this.player.kick(this.stats.currentDrive.currentYardLine);
				if(fieldGoalResult) this.stopPlay(Enums.playEndedBy.madeFieldGoal);
				else this.stopPlay(Enums.playEndedBy.missedFieldGoal);
				this.playPaused = false;
			}
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
			if(status == Enums.tileEnum.player && this.ballInAir == false) {
				this.tackled();
				this.currentDefender.addBlink();
			}
			else if(status == Enums.tileEnum.open) {
				this.currentDefender.move(tile);
			}
			else this.moveDefender();
		}
		
		determineOutcomePlayer(status, tile, direction) {
			if(status == Enums.tileEnum.defender && this.ballInAir == false) this.tackled();
			else if(status == Enums.tileEnum.open) {
				this.player.move(tile);
				if(direction == Enums.playerMovement.left) this.stats.currentDrive.currentPlay.yards += 1;
				else if(direction == Enums.playerMovement.right) this.stats.currentDrive.currentPlay.yards -=1;
				if(tile.x < 7 && this.wr) {
					this.player.canPass = false;
					if(this.wr.element)this.wr.stopRoute();
				}
				if(this.stats.currentDrive.currentPlay.yards + this.stats.currentDrive.currentYardLine >= 100) this.stopPlay(Enums.playEndedBy.touchdown);
				else this.calculateFScores();
			}
		}
		
		findSmallestFScore(currentValue, newValue) {
			if(currentValue == null || currentValue.fScore > newValue.fScore) return newValue;
			else return currentValue;
		}
		
		gameLoop() {
			(function(game){
				game.interval = setInterval(function(){
					if(game.stats.clock.gameOver == true && game.ballSnapped == false) {
						alert("Game Over");
						clearInterval(game.interval);
						game.stats.finalizeStats();
						game.database.checkHighScores(game.stats.highScores, game.stats.playerName);
					}
					else {
						game.coreGameLogic();
					}
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
				if(this.kickoffs.kickReturn == true && this.kickoffs.kickReturnDefense.length < 6) {
					success = true;
				}
			}
			this.determineOutcomeDefender(this.checkOccupiedTiles(smallest.id, Enums.tokenEnum.defender), smallest);
		}
		
		//Move the player to the new position
		movePlayer(direction) {
			//Prevent the player from moving if the ball has already been thrown
			if(this.ballInAir == false) {
				if(direction == Enums.playerMovement.left) {
					//wrap the player around the screen to the right
					if(this.player.currentTile.x == 0) {
						this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][9].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][9], direction);
					}
					//move the player one space to the left
					else {
						this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][this.player.currentTile.x - 1], direction);
					}
				}
				else if(direction == Enums.playerMovement.up) {
					if((this.player.currentTile.y - 1) > -1 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y - 1][this.player.currentTile.x], direction);
				}
				else if(direction == Enums.playerMovement.right) {
					//Check to see the player can move backwards
					if(this.player.currentTile.x + 1 < 10 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][this.player.currentTile.x + 1],direction);
					else if(this.player.currentTile.x + 1 > 9 && this.ballSnapped && this.player.canPass == false) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y][0].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y][0],direction);
				}
				else if(direction == Enums.playerMovement.down) {
					if((this.player.currentTile.y + 1) < 3 && this.ballSnapped) this.determineOutcomePlayer(this.checkOccupiedTiles(this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x].id, Enums.tokenEnum.player), this.tiles[this.player.currentTile.y + 1][this.player.currentTile.x],direction);
				}
			}
		}
		
		//Read the user input.
		readUserInput() {
			(function(game){
				$(window).on("keydown", function(evt) {
					$(".helpBtns.btn.btn-default").blur();
					//Hold the last valid key that was pressed in the currentKeyCode variable
					if(game.validKeys.indexOf(evt.keyCode) > -1) game.currentKeyCode = evt.keyCode;
				});
			}(this));
		}
		
		//Resets tokens to their initial location
		resetTokens() {
			this.player.removeElement(this.player.element);
			this.player = null;
			this.ball = null;
			if(this.wr)this.wr.stopRoute();
			this.wr = null;
			this.ballInAir = false;
			for(var defender in this.defenders) {
				if(this.defenders.hasOwnProperty(defender) && this.defenders[defender]) {
					this.defenders[defender].removeElement(this.defenders[defender].element);
				}
			}
			this.defenders = {RDE:null,LDE:null,DT:null,LB:null,CB:null,FS:null}
		}
		
		//Reads from the WRs predetermined route and moves the WR
		runRoute() {
			//If the WR has not yet finished his route
			if(this.wr.currentRoute.nodes.length > 0) {
				//Get the next route position
				var node = this.wr.currentRoute.nodes[0];
				//If next route position is unoccupied
				if(this.checkOccupiedTiles(this.tiles[node.y][node.x].id, Enums.tokenEnum.wr) == Enums.tileEnum.open) {
					this.wr.currentRoute.nodes.shift();
					this.wr.move(this.tiles[node.y][node.x]);
				}
			}
		}
		
		//Select a random defender to move
		selectRandomDefender() {
			//If the player is in the pocket only move the defensive line
			if(this.player.canPass == true) {
				var random = Math.floor(Math.random() * 5)
				if(random < 2) return "RDE";
				else if(random == 2 || random == 3) return "LDE";
				else return "DT";
			}
			else if(this.kickoffs.kickReturn == true) {
				var randomDefender = null;
				while(randomDefender == null) {
					var randomNumber = Math.floor(Math.random() * this.kickoffs.kickReturnDefense.length);
					randomDefender = this.kickoffs.kickReturnDefense[randomNumber];
				}
				return randomDefender;
			}
			//If the player has moved beyond the LOS all defenders can chase the player
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
		
		//Add tokens to the field
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
		
		//End the play
		stopPlay(endedBy) {
			this.kickoffs.kickReturn = false;
			this.ballSnapped = false;
			//Immediately stop the WR from running his route
			if(this.wr) this.wr.halt = true;
			this.stats.checkDriveStatus(endedBy);
		}
		
		//After the player competes a pass the QB and the WR are swapped.
		swapWRAndPlayer() {
			this.player.canPass = false;
			this.stats.currentDrive.currentPlay.yards += (this.player.currentTile.x - this.wr.currentTile.x);
			this.player.move(this.wr.currentTile);
			this.wr.stopRoute();
			if(this.stats.currentDrive.currentPlay.yards + this.stats.currentDrive.currentYardLine >= 100) this.stopPlay(Enums.playEndedBy.touchdown);
		}
		
		//Call when the player is tackled
		tackled() {
			this.player.addBlink();
			console.log(this.currentDefender);
			console.log(this.defenders);
			//Determine if the player was sacked
			if(this.player.canPass) this.stopPlay(Enums.playEndedBy.sack);
			else this.stopPlay(Enums.playEndedBy.tackle);
		}
	}
});
