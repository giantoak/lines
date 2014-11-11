var input = d3.select('#inputs')
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

var output_div = d3.select('#outputs')
    .append('div')
    .attr('class', 'output');

//var parseDate = d3.time.format("%Y-%m-%d").parse;
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

var svg = output_div
    .append('svg:svg')
    .attr('width', 400)
    .attr('height', 400)
    .attr('fill-opacity', 1);

var rebias = function (x, y, ctrl, beta) {
    var denom = 1 + beta*ctrl;
    var adj_y = y / denom;
    return adj_y;
};

var plot = AdjustablePlot()
            .input(input)
            .input_text(input_text)
            .adjust(rebias)
            //.x('countspercapita')
            //.y('lprice')
            //.ctrl('completeness');
            .x('MonthDate')
            .y('counts')
            .ctrl('counts');

//d3.json('http://ec2-54-234-196-121.compute-1.amazonaws.com/ocpu/library/rlines/data/cross_section/json/', function(d) {
//function(d) {
//    svg.datum(d)
//       .call(plot);
//});
d3.json('http://ec2-54-234-196-121.compute-1.amazonaws.com/ocpu/library/rlines/R/counts.for.region/json/') 
.header("Content-Type", "application/x-www-form-urlencoded")
// need to set content type as form encoded
.post("region=\'nova\'", function(error, data) {
	data.forEach(function(d) {
	  d.MonthDate = parseDate(d.MonthDate);
	  d.counts = +d.counts;
	});
// Parse the input JSON data as months
        svg.datum(data)
           .call(plot);
});

