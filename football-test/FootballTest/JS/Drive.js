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
		
		addPlay(endedBy, boxScore) {
			this.totalPlays++;
			if(endedBy == Enums.playEndedBy.madeFieldGoal) {
				this.currentPlay.down++;
				this.currentPlay.playSummary = "" + ((100 - this.currentYardLine) + 17) + " yard field goal attempt is good!";
				this.currentPlay.result = Enums.playResult.fieldGoal;
			}
			else if(endedBy == Enums.playEndedBy.missedFieldGoal) {
				this.currentPlay.down++;
				this.currentPlay.playSummary = "" + ((100 - this.currentYardLine) + 17) + " yard field goal attempt is no good!";
				this.currentPlay.result = Enums.playResult.turnover;
			}
			else {
				this.yards += this.currentPlay.yards;
				if(this.currentPlay.down == 3) boxScore.thirdDowns.atts++;
				else if(this.currentPlay.down == 4) boxScore.fourthDowns.atts++;
				if(this.currentPlay.type) {
					this.passPlays++;
					boxScore.compAtt.atts++;
					boxScore.compAtt.comp++;
				}
				else {
					this.currentPlay.type = Enums.playType.run;
					this.runPlays++;
					boxScore.rushAtts++;
					boxScore.rushing += this.currentPlay.yards;
				}
				this.setCurrentYardLine(this.currentPlay.yards);
				if(endedBy == Enums.playEndedBy.sack) {
					this.currentPlay.playSummary = "Player sacked for a loss of " + this.currentPlay.yards + " yards!";
					this.currentDown++;
					this.currentPlay.result = Enums.playResult.none;
					this.currentDistance -= this.currentPlay.yards;
					boxScore.sacks++;
				}
				else if(endedBy == Enums.playEndedBy.incomplete) {
					this.currentPlay.playSummary = "Incomplete pass";
					this.currentPlay.result = Enums.playResult.none;
					this.currentDown++;
					boxScore.compAtt.comp--;
				}
				else if(endedBy == Enums.playEndedBy.interception) {
					this.currentPlay.playSummary = "Player pass intercepted!";
					this.currentPlay.result = Enums.playResult.turnover
					boxScore.compAtt.comp--;
					boxScore.interceptions++;
				}
				else {
					this.currentPlay.playSummary = "Player " + (this.currentPlay.type == 0 ? "runs" : "passes") + " for " +  this.currentPlay.yards + " yards";
					if(this.currentPlay.type == Enums.playType.pass) boxScore.passing += this.currentPlay.yards;
					boxScore.totalYards += this.currentPlay.yards;
					if(endedBy == Enums.playEndedBy.touchdown) {
						this.currentPlay.playSummary += " for a touchdown!";
						this.currentPlay.result = Enums.playResult.touchdown;
						this.currentPlay.type == Enums.playType.run ? boxScore.rushTds++ : boxScore.passTds++;
						if(this.currentPlay.down == 3) boxScore.thirdDowns.convert++;
						else if(this.currentPlay.down == 4) boxScore.fourthDowns.convert++;
					}
					else if(this.currentDistance - this.currentPlay.yards <= 0) {
						this.currentDown = 1;
						this.currentDistance = 10;
						this.currentPlay.result = Enums.playResult.firstDown;
						this.currentPlay.playSummary += " for a first down!";
						boxScore.firstDowns++;
						this.currentPlay.type == Enums.playType.run ? boxScore.byRushing++ : boxScore.byPassing++;
						if(this.currentPlay.down == 3) boxScore.thirdDowns.convert++;
						else if(this.currentPlay.down == 4) boxScore.fourthDowns.convert++;
					}
					else {
						this.currentDistance -= this.currentPlay.yards;
						this.currentDown++;
						this.currentPlay.result = Enums.playResult.none;
						this.currentPlay.playSummary += " to the " + (this.getNormalizedYardLine());;
					}
				}	
				if(this.currentDown > 4) {
					if(this.currentPlay.result == Enums.playResult.none || this.currentPlay.result == Enums.playResult.incomplete) {
						this.currentPlay.result = Enums.playResult.turnover;
						this.currentPlay.playSummary += "Turnover on downs!";
					}
				}
			}
			this.currentPlay.endTime = this.clock.getCurrentTime();
			this.plays.push(this.currentPlay);
			return {playSummary:this.currentPlay.playSummary, playResult: this.currentPlay.result, boxScore:boxScore};
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