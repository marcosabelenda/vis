/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

var arr = [
  { "id": 0,
    "characters": {}
  }
];



var count = 0;
var scene;
var postbody = document.getElementById('postbody');
for (let i = 0; i < postbody.children.length; i++) {
  
  var aux = postbody.children[i].textContent.split('[');
  if(aux[1] != null) {
    count++;
    arr[count] = {"id": count, "characters": {}};
  } else {
    aux = postbody.children[i].textContent.split(':');
    if(aux[1] != null) {
      var name = aux[0];
      if(aux[0] == 'Narrator' || aux[0] == 'Son' || aux[0] == 'Daughter') {
        
        if(arr[0].characters == null || !arr[0].characters.hasOwnProperty(name)) {
          arr[0].characters[name] = [];
        }      
        arr[0].characters[name].push(aux[1]);
      } else {
        if(arr[count].characters == null || !arr[count].characters.hasOwnProperty(name)) {
          arr[count].characters[name] = [];
        }      
        arr[count].characters[name].push(aux[1]);
      }
    }
  }
}

var arr1 = [];
var count1 = 0;
for(var s in arr) {
  for(var i  in arr[s].characters) {
      for(var j in arr[s].characters) {
        if(i != j) {
          arr1[count1] = {"pair": i + "-" + j,"from": i, "to": j, "value": arr[s].characters[i].length, "texts": arr[s].characters[i]};
          count1++;
        }
      }
  }
}


var dialogues = []
var count = 0;
for(var d in arr1) {
  var f = true;
  for(var i = 0 ; i < count ; i++) {
    if(dialogues[i].pair == arr1[d].pair) {
      f = false;
      dialogues[i].value += arr1[d].value;
	  dialogues[i].texts = dialogues[i].texts.concat(arr1[d].texts);
      break;
    }
  }
  if(f) {
    dialogues[count] = {"pair": arr1[d].pair, "from": arr1[d].from, "to": arr1[d].to, "value": arr1[d].value, "texts": arr1[d].texts};
    count++;
  }
}

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.ChordDiagram);

// colors of main characters
chart.colors.saturation = 0.45;
chart.colors.step = 3;
var colors = {
    //Julio:chart.colors.next(),
    //Ramon:chart.colors.next(),
    //Carlos:chart.colors.next(),
    //Juan:chart.colors.next(),
    //Jorge:chart.colors.next(),
    //Pepe:chart.colors.next()
}

// data was provided by: https://www.reddit.com/user/notrudedude

chart.data = dialogues;



chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.value = "value";


chart.nodePadding = 0.5;
chart.minNodeSize = 0.01;
chart.startAngle = 80;
chart.endAngle = chart.startAngle + 360;
chart.sortBy = "value";
chart.fontSize = 10;

var nodeTemplate = chart.nodes.template;
nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
nodeTemplate.showSystemTooltip = true;
nodeTemplate.propertyFields.fill = "color";
nodeTemplate.tooltipText = "{name}'s dialogs: {total}";

// when rolled over the node, make all the links rolled-over
nodeTemplate.events.on("over", function(event) {    
    var node = event.target;

    node.outgoingDataItems.each(function(dataItem) {
        if(dataItem.toNode){
            dataItem.link.isHover = true;
            dataItem.toNode.label.isHover = true;
        }
    })
    node.incomingDataItems.each(function(dataItem) {
        if(dataItem.fromNode){
            dataItem.link.isHover = true;
            dataItem.fromNode.label.isHover = true;
        }
    }) 

    node.label.isHover = true;   
})

// when rolled out from the node, make all the links rolled-out
nodeTemplate.events.on("out", function(event) {
    var node = event.target;

    node.outgoingDataItems.each(function(dataItem) {        
        if(dataItem.toNode){
            dataItem.link.isHover = false;                
            dataItem.toNode.label.isHover = false;
        }
    })
    node.incomingDataItems.each(function(dataItem) {
        if(dataItem.fromNode){
            dataItem.link.isHover = false;
           dataItem.fromNode.label.isHover = false;
        }
    })

    node.label.isHover = false;
})

var label = nodeTemplate.label;
label.relativeRotation = 90;

label.fillOpacity = 0.4;
let labelHS = label.states.create("hover");
labelHS.properties.fillOpacity = 1;

nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
// this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
nodeTemplate.adapter.add("fill", function(fill, target) {
    let node = target;
    let counters = {};
    let mainChar = false;
    node.incomingDataItems.each(function(dataItem) {
        if(colors[dataItem.toName]){
            mainChar = true;
        }

        if(isNaN(counters[dataItem.fromName])){
            counters[dataItem.fromName] = dataItem.value;
        }
        else{
            counters[dataItem.fromName] += dataItem.value;
        }
    })
    if(mainChar){
        return fill;
    }

    let count = 0;
    let color;
    let biggest = 0;
    let biggestName;

    for(var name in counters){
        if(counters[name] > biggest){
            biggestName = name;
            biggest = counters[name]; 
        }        
    }
    if(colors[biggestName]){
        fill = colors[biggestName];
    }
  
    return fill;
})

var links = chart.links;

console.log(links);




// link template
var linkTemplate = chart.links.template;
linkTemplate.strokeOpacity = 0;
linkTemplate.fillOpacity = 0.15;
linkTemplate.tooltipText = "{fromName} & {toName}:{value.value}";

linkTemplate.events.on("out", function(event) {
	var link = event.target;
	var pair = link.dataItem.fromName + "-" + link.dataItem.toName;
	for(var i in dialogues) {
		if(dialogues[i].pair == pair) {
			$("#from").attr("src", "barney.jpeg");
			$("#to").attr("src", "ted.jpeg");
			$("#dialogs").empty();
			for(var d in dialogues[i].texts) {
				var li  = document.createElement('li'),
  				txt = document.createTextNode(dialogues[i].texts[d]);
 
				li.appendChild(txt);
				$("#dialogs").append(li);
				$("#dialogs li").addClass('list-group-item');			
			}
		}
	}
});


var hoverState = linkTemplate.states.create("hover");
hoverState.properties.fillOpacity = 0.7;
hoverState.properties.strokeOpacity = 0.7;


var titleImage = chart.chartContainer.createChild(am4core.Image);
titleImage.href = "himym-dialogs.png";
titleImage.x = 30
titleImage.y = 30;
titleImage.width = 200;
titleImage.height = 200;

