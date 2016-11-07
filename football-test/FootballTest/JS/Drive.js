define (["JS/Play.js", "JS/Utils/Enums.js"],function(Play, Enums) {
	return class Drive {
		constructor(yardLine, clock) {
			this.plays = [];
			this.startingYardLine = yardLine;
			this.driveResult = null;
			this.yards = 0;
			this.totalPlays = 0;
			this.passPlays = 0;
			this.runPlays = 0;
			this.timeElapsed = null;
			this.startTime = null;
			this.endTime = null;
			this.currentDown = 1;
			this.currentDistance = 10;
			this.currentYardLine = this.startingYardLine;
			this.currentPlay = null;
			this.clock = clock;
		}
		
		startPlay() {
			this.currentPlay = new Play();
			this.currentPlay.startTime = this.clock.getCurrentTime();
			this.currentPlay.down = this.currentDown;
			this.currentPlay.distance = this.currentDistance;
			this.currentPlay.yardLine = this.currentYardLine;
		}
		
		stopPlay(yards) {
			this.addPlay();
		}
		
		addPlay(endedBy) {
			this.totalPlays++;
			this.yards += this.currentPlay.yards;
			if(this.currentPlay.type) this.passPlays++;
			else {
				this.currentPlay.type = Enums.playType.run;
				this.runPlays++;
			}
			this.setCurrentYardLine(this.currentPlay.yards);
			if(endedBy == Enums.playEndedBy.sack) {
				this.currentPlay.playSummary = "Player sacked for a loss of " + this.currentPlay.yards + " yards!";
			}
			else if(endedBy == Enums.playEndedBy.incomplete) {
				this.currentPlay.playSummary = "Incomplete pass";
			}
			else if(endedBy == Enums.playEndedBy.interception) {
				this.currentPlay.playSummary = "Player pass intercepted!";
			}
			else {
				this.currentPlay.playSummary = "Player " + (this.currentPlay.type == 0 ? "runs" : "passes") + " for " +  this.currentPlay.yards + " yards";
				if(this.currentPlay.result == Enums.playResult.touchdown) {
					this.currentPlay.playSummary += " for a touchdown!";
				}
				else if(this.currentDistance - this.currentPlay.yards <= 0) {
					this.currentDown = 1;
					this.currentDistance = 10;
					this.currentPlay.result = Enums.playResult.firstDown;
					this.currentPlay.playSummary += " for a first down!";
				}
				else {
					this.currentDistance -= this.currentPlay.yards;
					this.currentDown++;
					this.currentPlay.result = Enums.playResult.none;
					this.currentPlay.playSummary += " to the " + (this.getNormalizedYardLine());;
				}
			}	
			if(this.currentDown == 4) {
				if(this.currentPlay.result == Enums.playResult.none || this.currentPlay.result == Enums.playResult.incomplete) {
					this.currentPlay.result = Enums.playResult.turnover;
					this.currentPlay.playSummary += ". Turnover on downs!";
				}
			}
			this.currentPlay.endTime = this.clock.getCurrentTime();
			this.plays.push(this.currentPlay);
			return this.currentPlay.playSummary;
		}
		
		setCurrentYardLine(yards) {
			this.currentYardLine += yards;
		}
		
		getNormalizedYardLine() {
			if(this.currentYardLine > 50) {
				return "Opp " + (50-(this.currentYardLine - 50));
			}
			else return this.currentYardLine;
		}
	}
});