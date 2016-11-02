define (["JS/Drive.js","JS/Play.js", "JS/Clock.js"],function(Drive, Play, Clock) {
	return class Stats {
		constructor() {
			this.drives = [];
			this.currentDrive = null;
			this.clock = new Clock();
		}
		
		createDrive(start) {
			this.currentDrive = new Drive(start, this.clock);
		}
		
		endDrive(result) {
			this.currentDrive.driveResult = result;
			this.currentDrive.clock = null;
		}
	}
});