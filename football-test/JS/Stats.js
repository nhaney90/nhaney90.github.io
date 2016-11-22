define (["JS/Drive.js","JS/Play.js", "JS/Clock.js", "JS/Utils/Enums.js"],function(Drive, Play, Clock, Enums) {
	return class Stats {
		constructor(playerName) {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
			this.score = {playerScore:0, computerScore:0};
			this.setScore();
			this.boxScore = {passing:0, compAtt:{comp:0, atts:0}, passTds:0, interceptions:0, sacks:0, rushing:0, rushAtts:0, rushTds:0, firstDowns:0, byRushing:0, byPassing:0,thirdDowns:{atts:0, convert:0}, fourthDowns:{atts:0, convert:0}};
			this.highScores = {completionPercentage: 0, completions: 0, firstDowns: 0, fourthDowns: 0, fieldGoals: 0, interceptions: 0,
				longestFieldGoal: 0, longestKickReturn: 0, longestPass: 0, longestRun: 0, margin: 0, passingTDs: 0, passingYards:0, points: 0, pointsAllowed: 0, rushingTDs: 0, rushingYards: 0, sacks: 0, yards: 0, yardsPerPass: 0, yardsPerRush: 0}
			this.setBoxScore();
			this.playerName = playerName;
			$("#playerNameScoreboardLabel").text(this.playerName);
		}
		
		checkDriveStatus(endedBy) {
			var result = this.currentDrive.addPlay(endedBy, this.boxScore, this.playerName);
			this.boxScore = result.boxScore;
			this.setBoxScore();
			$("#playResult").text(result.playSummary);
			$("#playByPlayTable").append('<tr><td class="playByPlayItem">' + (this.createLabelFriendlyDownNumber(this.currentDrive.currentPlay.down)) + ' down: ' + result.playSummary + '</td></tr>');
			if(endedBy == Enums.playEndedBy.sack) {
				this.score.computerScore += 2;
				this.setScore();
			}
			if(result.playResult == Enums.playResult.turnover) {
				this.score.computerScore += 4;
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
			else if(result.playResult == Enums.playResult.fieldGoal) {
				this.score.playerScore += 3;
				this.setScore();
				this.endDrive();
				this.createDrive(25);
			}
			else {
				this.setScoreboardLabels(this.currentDrive.currentDown, this.currentDrive.currentDistance, this.currentDrive.getNormalizedYardLine(this.currentDrive.currentYardLine));
			}
		}
		
		createDrive(start) {
			$("#playByPlayTable").append('<tr><td class="playByPlayHeading">Drive ' + (this.drives.length + 1) + '</td></tr>');
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
			this.highScores.yards = this.boxScore.passing + this.boxScore.rushing;
			$("#totalYardsCell").text(this.highScores.yards);
			this.highScores.passingYards = this.boxScore.passing;
			$("#passingYardsCell").text(this.highScores.passingYards);
			this.highScores.completionPercentage = this.boxScore.compAtt.comp + " / " + this.boxScore.compAtt.atts;
			$("#compAttsCell").text(this.highScores.completionPercentage);
			this.highScores.yardsPerPass = Math.round((this.boxScore.passing / this.boxScore.compAtt.atts) * 10) / 10;
			$("#yppCell").text(this.highScores.yardsPerPass);
			this.highScores.passingTDs = this.boxScore.passTds;
			$("#passingTdsCell").text(this.highScores.passingTDs);
			this.highScores.interceptions = this.boxScore.interceptions;
			$("#interceptionsCell").text(this.highScores.interceptions);
			this.highScores.sacks = this.boxScore.sacks;
			$("#sacksCell").text(this.highScores.sacks);
			this.highScores.rushingYards;
			$("#rushingYardsCell").text(this.highScores.rushingYards);
			this.highScores.rushAttempts = this.boxScore.rushAtts;
			$("#rushingAttsCell").text(this.highScores.rushAttempts);
			this.highScores.yardsPerRush = Math.round((this.boxScore.rushing / this.boxScore.rushAtts) * 10) / 10;
			$("#yprCell").text(this.highScores.yardsPerRush);
			this.highScores.rushingTDs = this.boxScore.rushTds
			$("#rushingTdsCell").text(this.highScores.rushingTDs);
			this.highScores.firstDowns = this.boxScore.firstDowns;
			$("#firstDownsCell").text(this.highScores.firstDowns);
			$("#byRushingCell").text(this.boxScore.byRushing);
			$("#byPassingCell").text(this.boxScore.byPassing);
			$("#thirdDownsCell").text(this.boxScore.thirdDowns.convert + " / " + this.boxScore.thirdDowns.atts);
			this.highScores.fourthDowns = this.boxScore.fourthDowns.convert;
			$("#fourthDownsCell").text(this.boxScore.fourthDowns.convert + " / " + this.boxScore.fourthDowns.atts);
		}
	}
});