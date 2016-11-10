define (["JS/Drive.js","JS/Play.js", "JS/Clock.js", "JS/Utils/Enums.js"],function(Drive, Play, Clock, Enums) {
	return class Stats {
		constructor() {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
			this.score = {playerScore:0, computerScore:0};
			this.setScore();
			this.boxScore = {totalYards:0, passing:0, compAtt:{comp:0, atts:0}, passTds:0, interceptions:0, sacks:0, rushing:0, rushAtts:0, rushTds:0, firstDowns:0, byRushing:0, byPassing:0,thirdDowns:{atts:0, convert:0}, fourthDowns:{atts:0, convert:0}};
			this.setBoxScore();
		}
		
		checkDriveStatus(endedBy) {
			var result = this.currentDrive.addPlay(endedBy, this.boxScore);
			this.boxScore = result.boxScore;
			console.log(this.boxScore);
			this.setBoxScore();
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
			$("#playByPlayContainer").append('<h5 class="playByPlayHeading">Drive ' + (this.drives.length + 1) + '</h5>');
			this.currentDrive = new Drive(start, this.clock);
			this.setScoreboardLabels(1, 10, this.currentDrive.getNormalizedYardLine(start));
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

		setBoxScore() {
			$("#totalYardsCell").text(this.boxScore.totalYards);
			$("#passingYardsCell").text(this.boxScore.passing);
			$("#compAttsCell").text(this.boxScore.compAtt.comp + " / " + this.boxScore.compAtt.atts);
			$("#yppCell").text(Math.round((this.boxScore.passing / this.boxScore.compAtt.atts) * 10) / 10);
			$("#passingTdsCell").text(this.boxScore.passTds);
			$("#interceptionsCell").text(this.boxScore.interceptions);
			$("#sacksCell").text(this.boxScore.sacks);
			$("#rushingYardsCell").text(this.boxScore.rushing);
			$("#rushingAttsCell").text(this.boxScore.rushAtts);
			$("#yprCell").text(Math.round((this.boxScore.rushing / this.boxScore.rushAtts) * 10) / 10);
			$("#rushingTdsCell").text(this.boxScore.rushTds);
			$("#firstDownsCell").text(this.boxScore.firstDowns);
			$("#byRushingCell").text(this.boxScore.byRushing);
			$("#byPassingCell").text(this.boxScore.byPassing);
			$("#thirdDownsCell").text(this.boxScore.thirdDowns.atts + " / " + this.boxScore.thirdDowns.convert);
			$("#fourthDownsCell").text(this.boxScore.fourthDowns.atts + " / " + this.boxScore.fourthDowns.convert);
		}
	}
});