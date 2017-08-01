define ([],function() {
	return {
		playerMovement:{left:0, right:1, up:2, down:3},
		tokenEnum:{player:0, defender:1, wr:2, ball: 3},
		tileEnum:{open:0, player: 1, defender: 2, wr: 3, ball: 4},
		playType:{run:0, pass:1},
		playEndedBy:{tackle: 0, incomplete:1, interception:2, sack:3, touchdown:4, missedFieldGoal:5, madeFieldGoal:6},
		playResult:{none:0, firstDown:1, touchdown:2, turnover:3, fieldGoal:4, kickReturn:5}
	}
});