$(document).ready(setEventHandlers);

function setEventHandlers() {
	$("#guestBtn").click(continueAsGuest);
}

function continueAsGuest() {
	var url = window.location.href + "home.html";
	window.location = url;
}