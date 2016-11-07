define (["JS/Drive.js","JS/Play.js", "JS/Clock.js", "JS/Utils/Enums.js"],function(Drive, Play, Clock, Enums) {
	return class Stats {
		constructor() {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
			this.setScoreboardLabels(1, 10, 25);
		}
		
		checkDriveStatus(endedBy) {
			var result = this.currentDrive.addPlay(endedBy);
			$("#playResult").text(result);
			$("#playByPlayContainer").append('<h6 class="playByPlayItem">' + (this.createLabelFriendlyDownNumber(this.currentDrive.currentPlay.down)) + ' down: ' + result + '</h6>');
			this.setScoreboardLabels(this.currentDrive.currentDown, this.currentDrive.currentDistance, this.currentDrive.getNormalizedYardLine(this.currentDrive.currentYardLine));
		}
		
		createDrive(start) {
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
	}
});