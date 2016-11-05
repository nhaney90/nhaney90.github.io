define ([],function() {
	return class Clock {
		constructor() {
			this.totalQuarters = 4;
			this.currentQuarter = 1;
			this.quarterLength = 60;
			this.currentTime = this.quarterLength;
			this.remainingTime = this.currentTime;
			this.started = false;
		}
		
		runTimer(startTime) {
			this.currentTime = this.remainingTime - (((Date.now() - startTime)/1000) | 0);
			var seconds = (this.currentTime % 60) | 0;
			
			seconds = seconds < 10 ? "0" + seconds : seconds;
			if(this.currentTime <= 0) startTime = Date.now() + 1000;
			console.log(this.currentTime);
		}
		
		startTime() {
			var start = Date.now();
			this.remainingTime = this.currentTime;
			(function(drive) {
				drive.interval = setInterval(function() {
					drive.runTimer(start);
				}, 1000);
			})(this);
			this.started = true;
		}
		
		stopTime() {
			clearInterval(this.interval);
			this.started = false;
		}
		
		getCurrentTime() {
			return this.currentTime;
		}
	}
});