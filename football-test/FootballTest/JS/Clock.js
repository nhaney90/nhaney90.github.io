define ([],function() {
	return class Clock {
		constructor() {
			this.totalQuarters = 4;
			this.currentQuarter = 1;
			this.quarterLength = 60;
			this.remainingTime = this.quarterLength;
		}
		
		runTimer(startTime) {
			this.remainingTime = this.remainingTime - (((Date.now() - startTime/1000) | 0));
			var seconds = (this.remainingTime % 60) | 0;
			
			seconds = seconds < 10 ? "0" + seconds : seconds;
			if(this.remainingTime <= 0) start = Date.now() + 1000;
			console.log(seconds);
		}
		
		startTime() {
			var start= new Date();
			(function(drive) {
				drive.interval = setInterval(function() {
					drive.runTimer(start);
				}, 1000);
			})(this);
		}
		
		stopTime() {
			clearInverval(this.interval);
		}
		
		getCurrentTime() {
			return this.remainingTime;
		}
	}
});