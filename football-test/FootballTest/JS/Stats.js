define (["JS/Drive.js","JS/Play.js"],function(Drive, Play) {
	return class Stats {
		constructor() {
			this.drives = [];
			this.currentDrive = null;
			this.clock = null;
		}
		
		createDrive(start) {
			this.currentDrive = new Drive(start);
			//this.currentDrive.startTime = this.clock.currentTime();
		}
		
		endDrive(result) {
			this.currentDrive.driveResult = result;
			//this.currentDrive.
		}
	}
});