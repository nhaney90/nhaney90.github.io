/****************************************************************************
This class essentially defines an object used to represent an individual play
****************************************************************************/

define ([],function() {
	return class Play {
		constructor() {
			this.startTime = null;
			this.endTime = null;
			this.result = null;
			this.yards = null;
			this.down = null;
			this.distance = null;
			this.yardLine = null;
			this.type = null;
			this.playSummary = null;
		}
	}
});