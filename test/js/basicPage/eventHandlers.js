$(document).ready(populatePage);

function populatePage() {
	var headerText = findPageName(get('page'));
	$(".jumboHeader").text(headerText.title);
	$(".jumboTagLine").text(headerText.sub);
	setEventHandlers();
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function findPageName(page) {
	header = {};
	switch(page) {
		case "applications": header.title = "Applications"; header.sub = "... Want to see what I made?"; break;
		case "articles": header.title = "Articles"; header.sub = "... Look at this thing I found!"; break;
		case "discussion": header.title = "Discussion"; header.sub = "... Let's talk this out"; break;
		case "gifs": header.title = "Gifs"; header.sub = "... It's Pronounced Gif; <a href='http://howtoreallypronouncegif.com/'>Not Jif</a>"; break;
		case "ideas": header.title = "Application Ideas"; header.sub = "... We should make this!"; break;
		case "memes": header.title = "Memes"; header.sub = "... You Thought This Was Cool?"; break;
		case "question": header.title = "I Have a Question"; header.sub = "... Can You Answer It?"; break;
		case "snippets": header.title = "Code Snippets"; header.sub = "... Exactly what you are looking for"; break;
		case "stories": header.title = "Tech Support Stories"; header.sub = "... So yeah, that happened"; break;
		case "videos": header.title = "Videos"; header.sub = "... You Thought This Was Cool?"; break;
	}
	return header;
}

function setEventHandlers() {
	$(".post-container").hover(function(){
		$(this).toggleClass("active");
	});
	$(".post-container").mousedown(function(evt) {
		$(this).addClass('down');
	});
	$(".post-container").click(function(evt) {
		console.log(evt);
		window.location = getPostURL($(this).attr('post-id'));
	});
}

function getPostURL(postId) {
	var page = get("page");
	return "detailPages/basicResponse.html?post=" + postId + "&page=" + page;	
}