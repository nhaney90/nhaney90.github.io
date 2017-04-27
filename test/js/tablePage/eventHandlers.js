$(document).ready(populatePage);

function populatePage() {
	var cat = get('cat');
	$(".tableHeader").text(findPrettyCategoryName(cat));
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function findPrettyCategoryName(cat) {
	var prettyCat;
	if(window.location.href.indexOf("resource") > -1) {
		switch(cat) {
			case "server": prettyCat = "Servers"; break;
			case "database": prettyCat = "Databases"; break;
			case "testapp": prettyCat = "Testing Apps"; break;
			case "tool": prettyCat = "Tools"; break;
			case "webdev": prettyCat = "Web Development"; break;
			case "serveradmin": prettyCat = "Server Administration"; break;
			case "program": prettyCat = "General Programming"; break;
			case "mobdev": prettyCat = "Mobile Development"; break;
			case "dotnet": prettyCat = "DotNet Development"; break;
			case "java": prettyCat = "Java Development"; break;
			case "cpp": prettyCat = "C++ Development"; break;
			case "webframe": prettyCat = "Web Frameworks"; break;
		}
		return prettyCat;
	}
	else {
		switch(cat) {
			case "arcmap": prettyCat = "ArcMap"; break;
			case "raster": prettyCat = "Rasters"; break;
			case "opensource": prettyCat = "Open Source GIS"; break;
			case "server": prettyCat = "ArcGIS Server"; break;
			case "portal": prettyCat = "Portal"; break;
			case "agol": prettyCat = "ArcGIS Online"; break;
			case "rest": prettyCat = "REST"; break;
			case "soap": prettyCat = "SOAP"; break;
			case "iis": prettyCat = "IIS"; break;
			case "tomcat": prettyCat = "Tomcat"; break;
			case "node": prettyCat = "Node.js"; break;
			case "database": prettyCat = "Databases"; break;
			case "windows": prettyCat = "Windows"; break;
			case "linux": prettyCat = "Linux"; break;
			case "osx": prettyCat = "Mac OS"; break;
			case "android": prettyCat = "Android"; break;
			case "ios": prettyCat = "iOS Development"; break;
			case "js": prettyCat = "JavaScript"; break;
			case "asp": prettyCat = "ASP"; break;
			case "php": prettyCat = "PHP"; break;
			case "java": prettyCat = "Java"; break;
			case "dotnet": prettyCat = "DotNet"; break;
			case "cpp": prettyCat = "C++"; break;
			case "webframe": prettyCat = "Web Frameworks"; break;
		}
		return prettyCat;
	}
}