r input = d3.select('#inputs')
    .append('div')
    .append('input')
    .attr('class', 'input-ctrl')
    .attr({'type': 'range',
            'min': 0.00,
            'max': 20,
            'step': 0.5,
            'value': 0.5 }); //We only want to bias in a positive sense: negative is weird, so min
    //is possitive
var input_text = d3.select('#inputs')
    .append('div')
    .attr('class', 'input-text')
    .text(0);

//var output_div = d3.select('#outputs')
    //.append('div')
    //.attr('class', 'output');

//var parseDate = d3.time.format("%Y-%m-%d").parse;

//var svg = output_div
    //.append('svg:svg')
    //.attr('width', 400)
    //.attr('height', 400)
    //.attr('fill-opacity', 1);

var rebias = function (x, y, ctrl, beta) {
    var denom = 1 + beta*ctrl;
    var adj_y = y / denom;
    return adj_y;
};

//var plot = AdjustablePlot()
            //.input(input)
            //.input_text(input_text)
            //.adjust(rebias)
            ////.x('countspercapita')
            ////.y('lprice')
            ////.ctrl('completeness');
            //.x('MonthDate')
            //.y('counts')
            //.ctrl('counts');

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
var parseDateInput = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
var maxY, maxX

var line = d3.svg.line()
    .x(function(d) { return x(d.MonthDate); })
    .y(function(d) { return y(d.target); });

var line2 = d3.svg.line()
    .x(function(d) { return x(d.MonthDate); })
    .y(function(d) { return y(d.comparison); });

var vline = d3.svg.line()
	.x(function(d) { return x(d.MonthDate); })
	.y(function(d) { return y(d.counts); });

function plot_event(event_date){
// This function takes an event date and plots a line on the graph at that date
	var vline_data = [{ "MonthDate ":parseDateInput(event_date), "counts":y.range()[1]}, { "MonthDate ":parseDateInput(event_date), "counts":y.range()[0]}];
	console.log(vline_data)
		// Check how the data for the vertical line is looking
		svg.append("path")
		.datum(vline_data)
		.attr("class", "eventline")
		.attr("d", vline);
	// Add the vertical line to graph

}

$('#diffdate').bind('input', function() {
		// This function executes when the date is changed
		var event_date = $('#diffdate').val()
		plot_event(event_date)
		});
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json('http://ec2-54-234-196-121.compute-1.amazonaws.com/ocpu/library/rlines/R/twolines/json/') 
.header("Content-Type", "application/x-www-form-urlencoded")
// need to set content type as form encoded
.post("target.region=\'nova\'&comparison.region.set=c(\'dc\',\'baltimore\')", function(error, data) {
	data.forEach(function(d) {
	  d.MonthDate = parseDate(d.MonthDate);
	  d.target = +d.target;
	  d.comparison = +d.comparison;
	});
// Parse the input JSON data as months
console.log(data)
console.log("About to do svg")
x = x.domain(d3.extent(data, function(d){ return d.MonthDate;}));
console.log(x)
var maxY = d3.max(data, function(d) { return Math.max(d.target, d.comparison); });  
var minY = d3.min(data, function(d) { return Math.min(d.target, d.comparison); });  
y = y.domain([minY, maxY]);
//y = y.domain(d3.extent(data, function(d){ return d.target;}));
//yt = y.domain(d3.extent(data, function(d){ return d.target;}));


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Ad Count");

console.log(data)
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

console.log(data)
  svg.append("path")
      .datum(data)
      .attr("class", "line2")
      .attr("d", line2);
});




//        svg.datum(data)
//           .call(plot);
//});

