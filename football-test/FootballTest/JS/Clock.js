define ([],function() {
	return class Clock {
		constructor() {
			this.totalQuarters = 4;
			this.currentQuarter = 1;
			this.quarterLength = 180;
			this.timeRemaining = this.quarterLength;
			this.createTimeLabel();
		}
		
		startTime() {
		}
		
		stopTime() {
		}
		
		getCurrentTime() {
			return this.currentTime;
		}
		
		decrementTime() {
			this.timeRemaining--;
			this.createTimeLabel();
		}
		
		createTimeLabel() {
			var minutes = 0;
			var seconds = 0;
			if(this.timeRemaining >= 60) {
				minutes = Math.floor(this.timeRemaining / 60);
				seconds = this.timeRemaining - (minutes * 60);
				if(seconds < 10) {
					seconds = "0" + seconds;
				}
			}
			else seconds = this.timeRemaining;
			$("#timeLabel").text(minutes + ":" + seconds);
		}
	}
});