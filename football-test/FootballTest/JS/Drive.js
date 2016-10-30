define (["JS/Play.js", "JS/Utils/Enums.js"],function(Play, Enums) {
	return class Drive {
		constructor(yardLine) {
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
		}
		
		startPlay() {
			this.currentPlay = new Play();
			//this.currentPlay.startTime = this.clock.currentTime();
			this.currentPlay.down = this.currentDown;
			this.currentPlay.distance = this.currentDistance;
			this.currentPlay.yardLine = this.currentYardLine;
		}
		
		stopPlay(yards) {
			//this.currentPlay.result = result;
			//this.currentPlay.type = type
			this.addPlay();
		}
		
		addPlay() {
			this.totalPlays++;
			this.yards += this.currentPlay.yards;
			if(this.currentPlay.type) this.passPlays++;
			else {
				this.currentPlay.type = Enums.playType.run;
				this.runPlays++;
			}
			this.setCurrentYardLine(this.currentPlay.yards);
			if(this.currentDistance - this.currentPlay.yards <= 0) {
				this.currentDown = 1;
				this.currentDistance = 10;
			}
			else{
				if(this.currentDown == 4) this.currentDown = 1;
				else {
					this.currentDistance -= this.currentPlay.yards;
					this.currentDown++;
				}
			}
			this.plays.push(this.currentPlay);
		}
		
		setCurrentYardLine(yards) {
			this.currentYardLine += yards;
		}
	}
});