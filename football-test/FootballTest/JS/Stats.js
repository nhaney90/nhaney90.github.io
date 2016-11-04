define (["JS/Drive.js","JS/Play.js", "JS/Clock.js", "JS/Utils/Enums.js"],function(Drive, Play, Clock, Enums) {
	return class Stats {
		constructor() {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
		}
		
		checkDriveStatus() {
			var result = this.currentDrive.addPlay();
			console.log(result);
			if(result == Enums.playResult.touchdown) {
				alert("Touchdown!");
			}
			else if(result == Enums.playResult.turnover) {
				alert("Turnover On Downs!");
			}
			else if(result == Enums.playResult.firstDown) {
				alert("First Down!");
			}
			
		}
		
		createDrive(start) {
			this.currentDrive = new Drive(start, this.clock);
		}
		
		endDrive(result) {
			this.currentDrive.driveResult = result;
			this.currentDrive.clock = null;
			this.drives.push(this.currentDrive);
		}
	}
});