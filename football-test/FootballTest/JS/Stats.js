define (["JS/Drive.js","JS/Play.js", "JS/Clock.js", "JS/Utils/Enums.js"],function(Drive, Play, Clock, Enums) {
	return class Stats {
		constructor() {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
			this.score = {playerScore:0, computerScore:0};
			this.setScore();
		}
		
		checkDriveStatus(endedBy) {
			var result = this.currentDrive.addPlay(endedBy);
			$("#playResult").text(result.playSummary);
			$("#playByPlayContainer").append('<h6 class="playByPlayItem">' + (this.createLabelFriendlyDownNumber(this.currentDrive.currentPlay.down)) + ' down: ' + result.playSummary + '</h6>');
			if(result.playResult == Enums.playResult.turnover) {
				this.score.computerScore += 7;
				this.setScore();
				this.endDrive();
				this.createDrive(25);
			}
			else if(result.playResult == Enums.playResult.touchdown) {
				this.score.playerScore += 7;
				this.setScore();
				this.endDrive();
				this.createDrive(25);
			}
			else {
				this.setScoreboardLabels(this.currentDrive.currentDown, this.currentDrive.currentDistance, this.currentDrive.getNormalizedYardLine(this.currentDrive.currentYardLine));
			}
		}
		
		createDrive(start) {
			this.setScoreboardLabels(1, 10, start);
			$("#playByPlayContainer").append('<h5 class="playByPlayHeading">Drive ' + (this.drives.length + 1) + '</h5>');
			this.currentDrive = new Drive(start, this.clock);
		}
		
		endDrive(result) {
			this.currentDrive.driveResult = result;
			this.currentDrive.clock = null;
			this.drives.push(this.currentDrive);
		}
		
		createLabelFriendlyDownNumber(down) {
			if(down == 1) return "1st";
			else if(down == 2) return "2nd";
			else if(down == 3) return "3rd";
			else if(down == 4) return "4th";
			return "error";
		}
		
		setScoreboardLabels(down, distance, yardLine) {
			$("#yardLineLabel").text(yardLine);
			$("#downLabel").text(down);
			$("#distanceLabel").text(distance);
		}
		
		setScore() {
			$("#playerScoreLabels").text(this.score.playerScore);
			$("#computerScoreLabel").text(this.score.computerScore);
		}
	}
});