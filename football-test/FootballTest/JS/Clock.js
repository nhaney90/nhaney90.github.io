define ([],function() {
	return class Clock {
		constructor() {
			this.totalQuarters = 4;
			this.currentQuarter = 1;
			this.quarterLength = 60;
			this.timeRemaining = this.quarterLength;
		}
		
		startTime() {
		}
		
		stopTime() {
		}
		
		getCurrentTime() {
			return this.currentTime;
		}
	}
});