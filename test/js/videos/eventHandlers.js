$(document).ready(setEventHandlers);

function setEventHandlers() {
	$(".post-container").hover(function(){
		$(this).toggleClass("active");
	});
	$(".post-container").mousedown(function(evt) {
		$(this).addClass('down');
	});
	$(".post-container").click(function() {
		$(this).removeClass('down');
		window.open("https://i.makeagif.com/media/12-01-2015/gscz6z.gif");
	});
}		