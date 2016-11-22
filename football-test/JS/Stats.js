define (["JS/Drive.js","JS/Play.js", "JS/Clock.js", "JS/Utils/Enums.js"],function(Drive, Play, Clock, Enums) {
	return class Stats {
		constructor(playerName) {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
			this.score = {playerScore:0, computerScore:0};
			this.setScore();
			this.boxScore = {passing:0, compAtt:{comp:0, atts:0}, passTds:0, interceptions:0, sacks:0, rushing:0, rushAtts:0, rushTds:0, firstDowns:0, byRushing:0, byPassing:0,thirdDowns:{atts:0, convert:0}, fourthDowns:{atts:0, convert:0}, longestRun:0, longestPass:0, longestFieldGoal:0, fieldGoals:0};
			this.highScores = {completionPercentage: 0, completions: 0, fieldGoals:0, firstDowns: 0, fourthDowns: 0, fieldGoals: 0, interceptions: 0,
				longestFieldGoal: 0, longestKickReturn: 0, longestPass: 0, longestRun: 0, margin: 0, passAttempts:0, passingTDs: 0, passingYards:0, points: 0, pointsAllowed: 0, rushingTDs: 0, rushingYards: 0, rushAttempts:0, sacks: 0, yards: 0, yardsPerPass: 0, yardsPerRush: 0}
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
		
		finalizeStats() {
			this.highScores.yards = this.boxScore.passing + this.boxScore.rushing;
			this.highScores.passingYards = this.boxScore.passing;
			this.highScores.passAttempts = this.boxScore.compAtt.atts;
			this.highScores.completionPercentage = (Math.round((this.boxScore.compAtt.comp / this.boxScore.compAtt.atts) * 10) / 10) * 100;
			this.highScores.yardsPerPass = this.highScores.passAttempts > 7 ? Math.round((this.boxScore.passing / this.boxScore.compAtt.atts) * 10) / 10 : 0;
			this.highScores.passingTDs = this.boxScore.passTds;
			this.highScores.rushingTDs = this.boxScore.rushTds;
			this.highScores.interceptions = this.boxScore.interceptions;
			this.highScores.sacks = this.boxScore.sacks;
			this.highScores.rushingYards = this.boxScore.rushing;
			this.highScores.rushAttempts = this.boxScore.rushAtts;
			this.highScores.yardsPerRush = this.highScores.rushAttempts > 4 ? Math.round((this.boxScore.rushing / this.boxScore.rushAtts) * 10) / 10 : 0;
			this.highScores.firstDowns = this.boxScore.firstDowns;
			this.highScores.fourthDowns = this.boxScore.fourthDowns.convert;
			this.highScores.longestRun = this.boxScore.longestRun;
			this.highScores.longestPass = this.boxScore.longestPass;
			this.highScores.completions = this.boxScore.compAtt.comp;
			this.highScores.pointsAllowed =  this.score.computerScore;
			this.highScores.points = this.score.playerScore;
			this.highScores.margin = this.highScores.points - this.highScores.pointsAllowed;
			this.highScores.fieldGoals = this.boxScore.fieldGoals;
			this.highScores.longestFieldGoal = this.boxScore.longestFieldGoal;
		}

		setBoxScore() {
			$("#totalYardsCell").text(this.boxScore.passing + this.boxScore.rushing);
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
			$("#thirdDownsCell").text(this.boxScore.thirdDowns.convert + " / " + this.boxScore.thirdDowns.atts);
			$("#fourthDownsCell").text(this.boxScore.fourthDowns.convert);
		}
	}
});