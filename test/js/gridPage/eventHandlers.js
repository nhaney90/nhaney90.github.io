$(document).ready(setEventHandlers);

function setEventHandlers() {
	$(".categoryBtn").hover(function(){
		$(this).toggleClass("active");
	});
	$(".categoryBtn").mousedown(function(evt) {
		console.log(evt);
		$(this).addClass('down');
	});
}