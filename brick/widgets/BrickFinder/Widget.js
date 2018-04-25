define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/dom-construct',
    'jimu/dijit/GridLayout',

    "dojo/_base/lang",

    "esri/Color",
    "esri/graphic",
    "esri/geometry/geometryEngineAsync",
    "esri/geometry/Point",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/tasks/query",
    "esri/tasks/QueryTask",

    './names',
  ],
  function(declare, BaseWidget, domConstruct, GridLayout, lang, Color, Graphic, geometryEngineAsync, Point, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Query, QueryTask) {
    var clazz = declare([BaseWidget], {

      baseClass: 'jimu-widget-card',
      brickSearchTask: new QueryTask("https://maps.huntsvilleal.gov/arcgis/rest/services/BicentennialPark/MapServer/13"),
      brickGeometryTask: new QueryTask("https://maps.huntsvilleal.gov/arcgis/rest/services/BicentennialPark/MapServer/12"),
      brickMarkerSymbol:   new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_DIAMOND, 14 ,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,0,0]), 1),new Color([255,255,0,1])),
      fullNames: [],
      heightAdjustment: 0,
      highlightSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,255,0]), 3),new Color([255,255,0,1])),
      organizationNames: [],
      pointGraphicsLayer: new GraphicsLayer(),
      polygonGraphicsLayer: new GraphicsLayer(),
      widthAdjustment: 0,

      postCreate: function() {
        this.inherited(arguments);
      },

      adjustGeometry: function(mapPoint) {
        //setTimeout(() => {
          this.heightAdjustment = 0;
          this.widthAdjustment = 0;
          let screenPoint = this.map.toScreen(mapPoint);
          if(screen.height > screen.width && screen.width < 400) {
            this.heightAdjustment = screen.height / 4;
          }
          else if(screen.height <= screen.width || screen.width > 400) {
            this.widthAdjustment = 175
          }
          screenPoint.y += this.heightAdjustment
          screenPoint.x += this.widthAdjustment;
          let adjustedCentroid = this.map.toMap(screenPoint);
          this.map.centerAt(adjustedCentroid);
        //}, 500);
      },

      createTypeaheadEngines: function() {
        for(var name in nameArray) {
          if(nameArray[name].Org) this.organizationNames.push(nameArray[name].FullName);
          else this.fullNames.push(nameArray[name].FullName);
        }

        let nameEngine = new Bloodhound({
          local: this.fullNames,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          datumTokenizer: Bloodhound.tokenizers.whitespace
        });

        let orgEngine = new Bloodhound({
          local: this.organizationNames,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          datumTokenizer: Bloodhound.tokenizers.whitespace
        });

        $('#fullNameSearch').typeahead({
          hint: true,
          highlight: true,
          minLenght: 1
        },{
          name: 'fullNames',
          source: nameEngine
        });

        $('#orgNameSearch').typeahead({
          hint: true,
          highlight: true,
          minLenght: 1
        },{
          name: 'orgNames',
          source: orgEngine
        });
      },

      findBrick: function(evt) {
          let latLongArray = evt.currentTarget.attributes["value"].value.split(',');
          let point = new Point(latLongArray[0], latLongArray[1], this.map.spatialReference);
          let query = new Query();
          query.geometry = point;
          query.returnGeometry = true;
          this.brickGeometryTask.execute(query, lang.hitch(this, this.highlightBrick));
      },

      highlightBrick: function(results) {
        this.map.setScale(5);
        this.polygonGraphicsLayer.clear();
        let graphic = new Graphic(results.features[0].geometry, this.highlightSymbol);
        this.polygonGraphicsLayer.add(graphic);
        this.map.centerAt(graphic.geometry.getCentroid()).then(lang.hitch(this, () => {
          this.adjustGeometry(graphic.geometry.getCentroid());
        }));
      },

      highlightResults: function(evt) {
        if(evt.type == "mouseleave") this.pointGraphicsLayer.clear();
        else {
          let latLongArray = evt.currentTarget.attributes["value"].value.split(',');
          let point = new Point(latLongArray[0], latLongArray[1], this.map.spatialReference);
          let graphic = new Graphic(point, this.brickMarkerSymbol);
          this.pointGraphicsLayer.add(graphic);
        }
      },

      initialCaps: function(string) {
        return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
      },

      onClose: function() {
        esriConfig.defaults.map.panDuration = 350;
      },

      processSearchClick: function(evt) {
        switch(evt.target.id) {
          case "nameSearchBtn": this.sendNameSearchRequest(this.initialCaps($("#fullNameSearch").val().trim()), false); break;
          case "orgSearchBtn": this.sendNameSearchRequest(this.initialCaps($("#orgNameSearch").val().trim()), true); break;
          case "inscriptSearchBtn": this.sendInscriptSearchRequest(this.initialCaps($("#inscriptSearch").val().trim())); break;
        }
      },

      sendInscriptSearchRequest: function(text) {
        let query = new Query();
        query.where = "Inscriptio LIKE '%" + text + "%' OR Inscriptio LIKE '%" + text.toUpperCase() + "%' OR Inscriptio LIKE '%" + text.toLowerCase() + "%'";
        query.returnGeometry = true;
        query.outFields = ["*"];

        this.brickSearchTask.execute(query, lang.hitch(this, this.showResultsInTable));
      },

      sendNameSearchRequest: function(name, type) {
        name = name.replace(/'/g, "''");
        let query = new Query();
        let parts = name.split(' ');
        if(type) {
          if(parts.length==2) {
            query.where = "FirstName LIKE '"+parts[0]+"%' AND LastName LIKE '" +parts[1] +"%' OR FirstName LIKE '"+parts[0].toUpperCase()+"%' AND LastName LIKE '" +parts[1].toUpperCase +"%' OR LastName LIKE '" + name + "%' AND FirstName = '' OR LastName LIKE '" + name.toUpperCase() + "%' AND FirstName = ''";
          }
          else query.where = "LastName LIKE '%" + name + "%' AND FirstName = '' OR LastName LIKE '%" + name.toUpperCase() + "%' AND FirstName = ''";
        }
        else {
          if(parts.length==2) {
            query.where = "FirstName LIKE '"+parts[0] +"'AND LastName LIKE'" +parts[1] +"'";
            query.where += "OR FirstName LIKE '"+parts[0].toUpperCase()+"'AND LastName LIKE'" +parts[1].toUpperCase() +"'";
            if(parts[0].length == 2) {
              let initials = parts[0].charAt(0) + "." + parts[0].charAt(1) + ".";
              query.where += "OR FirstName LIKE '"+initials+"%' AND LastName LIKE '" +parts[1] +"%'";
              query.where += "OR FirstName LIKE '"+initials.toUpperCase()+"%' AND LastName LIKE '" +parts[1].toUpperCase() +"%'";
            }
          }
          else if(parts.length>2) query.where = "FirstName LIKE '" + parts[0] + "%' AND LastName LIKE '%" + parts[parts.length -1] + "%' OR FirstName LIKE '" + parts[0].toUpperCase() + "%' AND LastName LIKE '%" + parts[parts.length -1].toUpperCase() + "%'";
          else query.where = "LastName LIKE '" + parts[0] + "%' OR LastName LIKE '" + parts[0].toUpperCase() + "%' OR FirstName LIKE '" + parts[0] + "%' OR FirstName LIKE '" + parts[0].toUpperCase() + "%'";;
        }
        query.returnGeometry = true;
        query.outFields = ["*"];

        this.brickSearchTask.execute(query, lang.hitch(this, this.showResultsInTable));
      },

      setEventHandlers: function() {
        $(".search-btn").click(lang.hitch(this, this.processSearchClick));

        $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            $(".table").css("display","none");
        });
      },

      showResultsInTable: function(results) {
        $("#searchResultsTable").empty();
        let pointArray = [];
        for(var result in results.features) {
          let feature = results.features[result]
          let values = feature.attributes;
          pointArray.push(feature.geometry);
          $("#searchResultsTable").append("<tr class='search-result-row' value="+feature.geometry.x+","+feature.geometry.y+"><td>"+values.FirstName+" "+values.LastName+"</td><td>"+values.Inscriptio+"</td></tr>");
        }

        $(".table").css("display","block");
        $(".search-result-row").click(lang.hitch(this, this.findBrick));
        if(!$("html").hasClass("has-touch")) {
          if(pointArray.length > 1) {
            geometryEngineAsync.union(pointArray).then(lang.hitch(this, (results)=> {
              this.adjustGeometry(results.getExtent().getCenter());
              this.map.setScale(180);
            }));
          }
          else if(pointArray.length = 1) this.adjustGeometry(pointArray[0]);
          $("#searchResultsTable > tr").hover(lang.hitch(this, this.highlightResults));
        }
      },

      startup: function() {
        this.setEventHandlers();
        this.createTypeaheadEngines();
        this.polygonGraphicsLayer.minScale = 165;
        this.map.addLayers([this.pointGraphicsLayer, this.polygonGraphicsLayer]);
        esriConfig.defaults.map.panDuration = 0;
      }

    });
    return clazz;
  });
