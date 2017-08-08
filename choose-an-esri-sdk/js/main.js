require([
	"esri/Graphic",
	"esri/Map",
	"esri/layers/FeatureLayer",
	"esri/layers/GraphicsLayer",
	"esri/layers/MapImageLayer",
	"esri/layers/TileLayer",
	"esri/symbols/SimpleMarkerSymbol",
	"esri/views/MapView",
	"dojo/domReady!"
], function(Graphic, Map, FeatureLayer, GraphicsLayer, MapImageLayer, TileLayer,SimpleMarkerSymbol, MapView) {

	let map = new Map({
		ground: "world-elevation"
	});

	let view = new MapView({
		container: "viewDiv",
		map: map,
		scale: 1000,
		center: [-80.82, 35.189]
	});
				
	view.on("click", (evt) => {
		view.hitTest(evt).then((features) => {
			moveToNextPoint(features.results[0].graphic.attributes.OBJECTID);
		});
	});
			
	let basemap = new TileLayer({
		url: "http://maps.ci.charlotte.nc.us/arcgis/rest/services/WEB/Aerial11/MapServer"
	});
		  
	let flowchartLayer = new FeatureLayer({
		url: "https://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/SDKFlowChart/FeatureServer/2"
	});
			
	let connectorsLayer = new FeatureLayer({
		url: "https://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/SDKFlowChart/FeatureServer/3"
	});
	
	let labelLayer = new MapImageLayer({
		url: "http://csc-nhaney7d.esri.com/arcgis/rest/services/FlowchartLabels/MapServer"
	});
			
	let graphicsLayer = new GraphicsLayer();

	map.addMany([basemap, labelLayer, connectorsLayer, flowchartLayer, graphicsLayer]);
	
	let query = flowchartLayer.createQuery();
			
	let navigationNodes = {
		current:null,
		previous:null,
		yes:null,
		no:null
	};
			
	let marker = new SimpleMarkerSymbol({
		style: "path",
		path: "M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z",
		size: 50,
		yoffset: 10,
		color: [255, 255, 0, 1]
	});
			
	function queryFlowchartLayer(id) {
		return new Promise(async (resolve, reject) => {
			query.where = "OBJECTID = " + id;
			query.outFields = ["*"];
			let response = await flowchartLayer.queryFeatures(query);
			resolve(response.features[0]);
		});
	}
			
	function displayCurrentPosition(feature) {
		graphicsLayer.removeAll();
		let graphic = new Graphic({
			geometry: feature.geometry,
			symbol: marker
		});
		graphicsLayer.graphics.add(graphic);
		if(navigationNodes.current) navigationNodes.previous = navigationNodes.current;
		navigationNodes.current = feature.attributes.OBJECTID;
		navigationNodes.yes = feature.attributes.YesNode + 1;
		navigationNodes.no = feature.attributes.NoNode + 1;
		setUI(feature.attributes);				
	}
			
	function setUI(attributes) {
		$("#yesBtn").prop("disabled",false);
		$("#noBtn").prop("disabled",false);
		$("#backBtn").prop("disabled", false);
		$("#questionDiv").text(attributes.Name);
		$("#productInfo").empty();
		if(navigationNodes.yes < 2) $("#yesBtn").prop("disabled",true);
		if(navigationNodes.no < 2) $("#noBtn").prop("disabled",true);
		if(!navigationNodes.previous) $("#backBtn").prop("disabled", true);
		if(attributes.Type == 1) addProductInfo(attributes);
	}
			
	function addProductInfo(attributes) {
		if(attributes.Features.trim().length > 0) {
			$("#productInfo").append("<div id='keyFeatures' class='key-features'>Key Features:</div>");
			$("#productInfo").append("<div id='features' class='features'></div>");
			let features = attributes.Features.split(';');
			for(let feature in features) {
				$("#features").append("<p>" + features[feature] + "</p>");
			}
		}
		$("#productInfo").append("<a target='_blank' href='" + attributes.Link + "' class='link-to-docs'>Link to documentation</a>");
	}
			
	async function moveToNextPoint(id) {
		view.scale = 1000;
		let node = await queryFlowchartLayer(id);
		displayCurrentPosition(node);
		view.goTo(node.geometry, {easing: "ease-in", duration:1000});
	}
			
	$("#yesBtn").click((evt) => {
		moveToNextPoint(navigationNodes.yes);
	});
			
	$("#noBtn").click((evt) => {
		moveToNextPoint(navigationNodes.no);
	});
			
	$("#backBtn").click((evt) => {
		moveToNextPoint(navigationNodes.previous);
	});
		
	$("#resetBtn").click((evt) => {
		navigationNodes.previous = null;
		moveToNextPoint(1);
	});
			
	$("#splashScreen").fadeIn('slow');
	
	$(".btn-primary").click(function() {
		$(".background-mask").fadeOut('slow');
		$("#splashScreen").fadeOut('slow');
	});
			
	view.then(async (thisView) => {
		let node = await queryFlowchartLayer(1);
		displayCurrentPosition(node);
		thisView.goTo(node.geometry);
	});
			
});