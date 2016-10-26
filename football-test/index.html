<!DOCTYPE html>
<html>
<head>
	<style>
		#tileContainer {
			height: 100%;
			width: 100%;
			padding: 0px;
			margin: 0px;
		}
		.tile{
			height: 60px;
			width: 60px;
			background-color: green;
			color: white;
		}
		.player {
			background-color: black !important;
		}
		.wr {
			background-color: red !important;
		}
		.ball {
			background-color: brown !important;
			z-index: 100;
		}
	</style>
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script>
		$(document).ready(function() {
		
			class Token {
				constructor() {}
				
				addElement(position, element) {
					$("#tile" + position).append(element);
					this.domElement = $("#" + this.elementId);
				}
				
				removeElement(position, id) {
					$("#" + this.elementId).remove();
					this.domElement = null;
				}
				
				setAdjacentTiles(position) {
					this.adjacentTiles.left = position - 1;
					this.adjacentTiles.right = position + 1;
					this.adjacentTiles.top = position -10;
					this.adjacentTiles.bottom = position + 10;
					if(this.adjacentTiles.top < 1) this.adjacentTiles.top = null;
					if(this.adjacentTiles.bottom > 30) this.adjacentTiles.bottom = null;
				}
				
				move(position) {
					if($("#tile" + position).children().length == 0) {
						this.removeElement(this.currentTile, this.elementId);
						this.currentTile = position;
						this.addElement(this.currentTile, this.elementText);
						this.setAdjacentTiles(this.currentTile);
						return true;
					}
				}
			}
			
			class Ball extends Token {
				constructor(position, adjacent, player) {
					super();
					this.elementId = "ball";
					this.elementText = "<div id='ball' class='tile ball'>Ball</div>";
					this.addElement(this.currentTile, this.elementText);
					this.currentTile = position;
					this.adjacentTiles = adjacent;
					this.state = null;
					this.player = player;
				}
				
				fly() {
					var a = this;
					return new Promise(function(resolve, reject) {
						var i = 0;
						(function(i, a){
							var intervalID = setInterval(function() {
								var success = a.move(a.currentTile - 1);
								if(success == 2) {
									i++;
									if(i == 2) {
										clearInterval(intervalID);
										reject(Error("intercepted"));
									}
								}
								else if(success == 1 || success == 3) {
									clearInterval(intervalID);
									if(success == 1) resolve({status:"caught",ball:a});
									else resolve({status:"incomplete",ball:a});
								}
							}, 300);
						}(i, a));
					});
				}
				
				move(position) {
					var success;
					if($("#tile" + position).children().length == 0) success = 0;
					else success = this.checkToken(position);
					this.removeElement(this.currentTile, this.elementId);
					this.currentTile = position;
					if(this.checkPosition(position)) {
						this.addElement(this.currentTile, this.elementText);
						this.setAdjacentTiles(this.currentTile);
					}
					else success = 3;
					return success;
				}
				
				checkPosition(position) {
					var check = (this.currentTile + 9) / 10;
					if(check == 1 || check == 2 || check == 3) return false;
					else return true;
				}
				
				checkToken(position) {
					if($("#tile" + position).children()[0].id == "wr") return 1;
					else return 2;
				}
			}
			
			class Reciever extends Token {
				constructor() {
					super();
					this.elementId = "wr";
					this.elementText = "<div id='wr' class='tile wr'>WR</div>";
					this.currentTile = 28;
					this.addElement(this.currentTile, this.elementText);
					this.setInitialTiles();
					this.curlRoute = [27,26,25];
					this.goRoute = [27,26,25,24,23,22,21];
					this.postRoute = [27,26,25,14,3];
					this.dragRoute = [27,26,25,24,14,4];
					this.routes=[this.curlRoute, this.goRoute, this.postRoute, this.dragRoute];
					this.halt = false;
				}
				
				setInitialTiles() {
					this.adjacentTiles = {left:27,right:29,bottom:null,top:18};
				}
				
				runRoute(routes) {
					var i = 0;
					var a = this;
					(function(i, a, routes){
						var intervalID = setInterval(function() {
							if(routes[i] && a.halt == false) {
								var success = a.move(routes[i]);
								if(success) i++;
							}
							else {
								clearInterval(intervalID);
							}
						}, 800);
					}(i, a, routes));
				}
				
				selectRoute() {
					var randomNumber = Math.floor((Math.random() * 4));
					this.runRoute(this.routes[randomNumber]);
				}
			}
			
			class Player extends Token {
				constructor() {
					super();
					this.elementId = "player";
					this.elementText = "<div id='player' class='tile player'>QB</div>";
					this.currentTile = 20;
					this.addElement(this.currentTile, this.elementText);
					this.setInitialTiles();
					this.ball = null;
					this.wr = new Reciever();
				}
				
				setInitialTiles() {
					this.adjacentTiles = {left:19,right:null,bottom:30,top:10};
				}
				
				removeReceiver() {
					this.wr.removeElement();
					this.wr.halt = true;
				}
				
				checkKeyCode(code) {
					var newTile
					switch(code) {
						case 13: this.wr.selectRoute(); break;
						case 32: this.pass(); break;
						case 37: {
							var check = (this.currentTile + 9) / 10;
							if(check == 1){ newTile = 10; this.removeReceiver();}
							else if(check == 2){ newTile = 20; this.removeReceiver();}
							else if(check == 3){newTile = 30; this.removeReceiver();}
							else newTile = this.adjacentTiles.left;
							break;
						}
						case 38: newTile = this.adjacentTiles.top; break;
						case 39: {
							if(this.currentTile % 10 == 0) newTile = null;
							else newTile = this.adjacentTiles.right;
							break;
						}
						case 40: newTile = this.adjacentTiles.bottom; break;
					}
					if(newTile) {
						this.move(newTile);
					}
				}
				
				pass() {
					if(this.ball == null) {
						this.ball = new Ball(this.currentTile, {left:this.adjacentTiles.left, right:this.adjacentTiles.right, bottom:this.adjacentTiles.bottom, top:this.adjacentTiles.top}, this);
						this.ball.fly().then(this.checkStatus, this.turnOver);
					}
				}
				
				checkStatus(response) {
					if(response.status == "caught") {
						response.ball.player.removeReceiver();
						response.ball.player.wr.removeElement();
						response.ball.removeElement();
						response.ball.player.move(response.ball.currentTile);
					}
				}
				
				turnOver(error) {console.log(error)}
			}

			var player = new Player();
			
			window.onkeydown = function(evt) {
				player.checkKeyCode(evt.keyCode)
			}
		});
	</script>
</head>
<body>
	<div id="tileContainer">
		<table>
			<tr>
				<th>
					<div class="tile" id="tile1">1</div>
				</th>
				<th>
					<div class="tile" id="tile2">2</div>
				</th>
				<th>
					<div class="tile" id="tile3">3</div>
				</th>
				<th>
					<div class="tile" id="tile4">4</div>
				</th>
				<th>
					<div class="tile" id="tile5">5</div>
				</th>
				<th>
					<div class="tile" id="tile6">6</div>
				</th>
				<th>
					<div class="tile" id="tile7">7</div>
				</th>
				<th>
					<div class="tile" id="tile8">8</div>
				</th>
				<th>
					<div class="tile" id="tile9">9</div>
				</th>
				<th>
					<div class="tile" id="tile10">10</div>
				</th>
			</tr>
			 <tr>
				<th>
					<div class="tile" id="tile11"></div>
				</th>
				<th>
					<div class="tile" id="tile12"></div>
				</th>
				<th>
					<div class="tile" id="tile13"></div>
				</th>
				<th>
					<div class="tile" id="tile14"></div>
				</th>
				<th>
					<div class="tile" id="tile15"></div>
				</th>
				<th>
					<div class="tile" id="tile16"></div>
				</th>
				<th>
					<div class="tile" id="tile17"></div>
				</th>
				<th>
					<div class="tile" id="tile18"></div>
				</th>
				<th>
					<div class="tile" id="tile19"></div>
				</th>
				<th>
					<div class="tile" id="tile20"></div>
				</th>
			 </tr>
			 <tr>
				<th>
					<div class="tile" id="tile21"></div>
				</th>
				<th>
					<div class="tile" id="tile22"></div>
				</th>
				<th>
					<div class="tile" id="tile23"></div>
				</th>
				<th>
					<div class="tile" id="tile24"></div>
				</th>
				<th>
					<div class="tile" id="tile25"></div>
				</th>
				<th>
					<div class="tile" id="tile26"></div>
				</th>
				<th>
					<div class="tile" id="tile27"></div>
				</th>
				<th>
					<div class="tile" id="tile28"></div>
				</th>
				<th>
					<div class="tile" id="tile29"></div>
				</th>
				<th>
					<div class="tile" id="tile30"></div>
				</th>			 
			 </tr>
		 </table>
	</div>
</body>
</html>