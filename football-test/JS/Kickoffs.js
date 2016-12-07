define (["JS/Ball.js", "JS/LB.js", "JS/Player.js", "JS/Utils/Enums.js"],function(Ball, LB, Player, Enums) {
	return class Kickoffs {
		constructor(game) {
			this.game = game;
			this.ball = null;
			this.kickingTeam = null;
			this.kickReturn = false;
			this.kickReturnDefense = [];
		}
		
		getKickoffDistance() {
			return Math.floor(Math.random() * 35) - 9;
		}
		
		addRandomDefender(index) {
			var success = false;
			while(success == false) { 
				var y = Math.floor(Math.random() * 3);
				var x = Math.floor(Math.random() * 10);
				if(this.game.checkOccupiedTiles(this.game.tiles[y][x].id, Enums.tokenEnum.defender) == Enums.tileEnum.open){
					this.game.defenders[Object.keys(this.game.defenders)[index]] = new LB(this.game.tiles[y][x], index, "LB");
					this.kickReturnDefense.push(Object.keys(this.game.defenders)[index]);
					success = true;
				}
			}
		}
		
		kickoffBall() {
			this.game.stats.setScoreboardLabels("--", "--", "Opp 35");
			this.kickReturn = true;
			this.kickReturnDefense = [];
			this.ball = new Ball(this.game.tiles[1][3], this.game);
			this.kickingTeam = [new LB(this.game.tiles[0][0], "", "LB"), new LB(this.game.tiles[1][0], "", "K"), new LB(this.game.tiles[2][0], "", "LB")];
			this.kickoffAnimation();
		}
		
		removeKickingTeam() {
			for(var i = 0; i < this.kickingTeam.length; i++) {
				this.kickingTeam[i].removeElement(this.kickingTeam[i].element);
			}
		}
		
		kickoffAnimation() {
			(function(kickoff){
				var intervalID = setInterval(function() {
					if(kickoff.kickingTeam[0].currentTile.x == 3) {
						clearInterval(intervalID);
						kickoff.kickBall(false);
					}
					else {
						kickoff.kickingTeam[0].move(kickoff.game.tiles[kickoff.kickingTeam[0].currentTile.y][kickoff.kickingTeam[0].currentTile.x + 1]);
						kickoff.kickingTeam[1].move(kickoff.game.tiles[kickoff.kickingTeam[1].currentTile.y][kickoff.kickingTeam[1].currentTile.x + 1]);
						kickoff.kickingTeam[2].move(kickoff.game.tiles[kickoff.kickingTeam[2].currentTile.y][kickoff.kickingTeam[2].currentTile.x + 1]);
					}
				}, 1000);
			}(this));
		}
		
		kickBall(second) {
			(function(kickoff){
				console.log(second);
				if(second) {
					kickoff.ball.kickOff(true).then(function() {
						kickoff.game.ballSnapped = true;
						var kickoffDistance = kickoff.getKickoffDistance();
						kickoff.game.stats.createDrive(kickoffDistance);
						kickoff.game.stats.currentDrive.startPlay();
						if(kickoffDistance > -1) {
							
						}
						else {
							kickoff.game.stopPlay(0);
						}
					});
				}
				else {
					kickoff.ball.kickOff(false).then(function() {
						kickoff.removeKickingTeam();
						kickoff.ball.move(kickoff.game.tiles[1][0]);
						kickoff.game.player = new Player(kickoff.game.tiles[1][9]);
						kickoff.game.player.canPass = false;
						kickoff.kickBall(true);
					});
				}
			}(this));
		}
	}
});