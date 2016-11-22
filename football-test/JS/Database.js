define ([],function() {
	return class Database {
		constructor() {
			this.database = null;
			this.highScores = null;
			this.currentGameHighScores = var currentGameHighScores = {
				completionPercentage: 0,
				completions: 0,
				firstDowns: 0,
				fourthDowns: 0,
				fieldGoals: 0,
				interceptions: 0,
				longestFieldGoal: 0,
				longestKickReturn: 0,
				longestPass: 0,
				longestRun: 0,
				margin: 0,
				passingTDs: 0,
				passingYards:0,
				points: 0,
				pointsAllowed: 0,
				rushingTDs: 0,
				rushingYards: 0,
				sacks: 0,
				yards: 0,
				yardsPerPass: 0,
				yardsPerRush: 0,
			}
			this.messages = [];
		}
		
		initializeDatabase() {
			var db = this;
			return new Promise(function(resolve, reject) {
				(function(db){
					var config = {
						apiKey: "AIzaSyAIq8FXHK189MW0nUsmRGeoW5UmVtsCY80",
						authDomain: "profootball2-6adc1.firebaseapp.com",
						databaseURL: "https://profootball2-6adc1.firebaseio.com",
						storageBucket: "profootball2-6adc1.appspot.com",
						messagingSenderId: "117346926353"
					};
					firebase.initializeApp(config);
					
					firebase.auth().signInAnonymously().catch(function(error) {
						var errorCode = error.code;
						var errorMessage = error.message;
					});
					
					firebase.auth().onAuthStateChanged(function(user) {
						if (user) {
							var isAnonymous = user.isAnonymous;
							var uid = user.uid;
							db.database = firebase.database();
							resolve("authentication succeeded");
						}
						else {
							reject("authentication failed");
						}
					});
				}(db));
			});
		}
		
		getHighScores() {
			var ref = this.database.ref("allTimeRecords");
			var db = this;
			return new Promise(function(resolve, reject) {
				(function(db){
					ref.on("value", function(snapshot) {
						db.highScores = snapshot.val();
						db.setHighScoreInformation();
						resolve (snapshot.val());
					}, function (errorObject) {
						console.log("The read failed: " + errorObject.code);
						reject (-1);
					});
				}(db));
			});
		}
		
		checkHighScores(currentGameHighScores, currentPlayer) {
			for(var record in currentGameHighScores) {
				if(currentGameHighScores.hasOwnProperty(record)) {
					if(record == "interceptions" || record == "sacks" || record == "pointsAllowed") {
						if(currentGameHighScores[record] < this.highScores[record].score) this.setNewHighScore(currentGameHighScores[record], this.highScores[record], record, currentPlayer);
					}
					else {
						if(currentGameHighScores[record] > this.highScores[record].score) this.setNewHighScore(currentGameHighScores[record], this.highScores[record], record, currentPlayer);
					}
				}
			}		
		}
		
		setNewHighScore(newRecord, oldRecord, record, currentPlayer) {
			var dt = new Date();
			var message = currentPlayer + " has set a new record for " + oldRecord.message + " at " + newRecord + ". This replaces the old record of " + oldRecord.score + " set by " + oldRecord.player + ".";
			this.messages.push(message);
			this.database.ref("allTimeRecords/" + record).set({
				player: currentPlayer,
				score: newRecord,
				message: oldRecord.message,
				date: (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + "/" + date.getUTCFullYear();
			});
		}
		
		setHighScoreInformation() {
			$("#r1score").text(this.highScores.points.score);
			$("#r1player").text(this.highScores.points.player);
			$("#r1date").text(this.highScores.points.date);
			
			$("#r2score").text(this.highScores.pointsAllowed.score);
			$("#r2player").text(this.highScores.pointsAllowed.player);
			$("#r2date").text(this.highScores.pointsAllowed.date);
			
			$("#r3score").text(this.highScores.margin.score);
			$("#r3player").text(this.highScores.margin.player);
			$("#r3date").text(this.highScores.margin.date);
			
			$("#r4score").text(this.highScores.rushingTDs.score);
			$("#r4player").text(this.highScores.rushingTDs.player);
			$("#r4date").text(this.highScores.rushingTDs.date);
			
			$("#r5score").text(this.highScores.passingTDs.score);
			$("#r5player").text(this.highScores.passingTDs.player);
			$("#r5date").text(this.highScores.passingTDs.date);
			
			$("#r6score").text(this.highScores.yards.score);
			$("#r6player").text(this.highScores.yards.player);
			$("#r6date").text(this.highScores.yards.date);
			
			$("#r7score").text(this.highScores.rushingYards.score);
			$("#r7player").text(this.highScores.rushingYards.player);
			$("#r7date").text(this.highScores.rushingYards.date);
			
			$("#r8score").text(this.highScores.passingYards.score);
			$("#r8player").text(this.highScores.passingYards.player);
			$("#r8date").text(this.highScores.passingYards.date);
			
			$("#r9score").text(this.highScores.yardsPerRush.score);
			$("#r9player").text(this.highScores.yardsPerRush.player);
			$("#r9date").text(this.highScores.yardsPerRush.date);
			
			$("#r10score").text(this.highScores.yardsPerPass.score);
			$("#r10player").text(this.highScores.yardsPerPass.player);
			$("#r10date").text(this.highScores.yardsPerPass.date);
			
			$("#r11score").text(this.highScores.completionPercentage.score);
			$("#r11player").text(this.highScores.completionPercentage.player);
			$("#r11date").text(this.highScores.completionPercentage.date);

			$("#r12score").text(this.highScores.longestRun.score);
			$("#r12player").text(this.highScores.longestRun.player);
			$("#r12date").text(this.highScores.longestRun.date);			

			$("#r13score").text(this.highScores.longestPass.score);
			$("#r13player").text(this.highScores.longestPass.player);
			$("#r13date").text(this.highScores.longestPass.date);

			$("#r14score").text(this.highScores.interceptions.score);
			$("#r14player").text(this.highScores.interceptions.player);
			$("#r14date").text(this.highScores.interceptions.date);

			$("#r15score").text(this.highScores.sacks.score);
			$("#r15player").text(this.highScores.sacks.player);
			$("#r15date").text(this.highScores.sacks.date);

			$("#r16score").text(this.highScores.fieldGoals.score);
			$("#r16player").text(this.highScores.fieldGoals.player);
			$("#r16date").text(this.highScores.fieldGoals.date);		

			$("#r17score").text(this.highScores.longestFieldGoal.score);
			$("#r17player").text(this.highScores.longestFieldGoal.player);
			$("#r17date").text(this.highScores.longestFieldGoal.date);	

			$("#r18score").text(this.highScores.firstDowns.score);
			$("#r18player").text(this.highScores.firstDowns.player);
			$("#r18date").text(this.highScores.firstDowns.date);

			$("#r19score").text(this.highScores.fourthDowns.score);
			$("#r19player").text(this.highScores.fourthDowns.player);
			$("#r19date").text(this.highScores.fourthDowns.date);			
		}
	}
});