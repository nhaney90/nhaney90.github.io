define ([],function() {
	return class Clock {
		constructor() {
			this.quarterLength = 300;
			this.timeRemaining = this.quarterLength;
			this.createTimeLabel();
			this.gameOver = false;
		}
		
		getCurrentTime() {
			return this.currentTime;
		}
		
		runOffClock() {
			for(var i = 0; i < 5; i++) {
				if(!this.gameOver) this.decrementTime();
			}
		}
		
		decrementTime() {
			if(this.timeRemaining - 1 >= 0) this.timeRemaining--;
			else this.gameOver = true;
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