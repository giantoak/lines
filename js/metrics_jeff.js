'use strict';

$(document).ready(function() {
    //json data that we intend to update later on via on-screen controls
    var split_by_data;
    
    var torso = {};
    torso.width = 375;
    torso.height = 200;
    torso.right = 20;

    var trunk = {};
    trunk.width = 320;
    trunk.height = 150;
    trunk.left = 35;
    trunk.right = 10;
    trunk.xax_count = 5;

    var small = {};
    small.width = 240;
    small.height = 140;
    small.left = 20;
    small.right = 20;
    small.top = 20;
    small.xax_count = 5;

    assignEventListeners();


    //few observations
    //d3.json('../metrics-graphics-1.0.0/data/missing-y.json', function(data) {
        //data = convert_dates(data, 'date');

        ////add a line chart that has a few observations
        //data_graphic({
            //title: "Few Observations",
            //description: "We sometimes have only a few observations. By setting <i>missing_is_zero: true</i>, missing values for a time-series will be interpreted as zeros. In this example, we've overridden the rollover callback to show 'no date' for missing observations and have set the <i>min_x</i> and <i>max_x</i> options in order to expand the date range.",
            //data: data,
            //interpolate: 'basic',
            //missing_is_zero: true,
            //width: torso.width,
            //height: torso.height,
            //right: torso.right,
            //min_x: new Date('2014-01-01'),
            //max_x: new Date('2014-06-01'),
            //target: '#missing-y',
            //x_accessor: 'date',
            //y_accessor: 'value',
            //rollover_callback: function(d, i) {
                //var df = d3.time.format('%b %d, %Y');
                //var date = df(d['date']);
                //var y_val = (d.value == 0) ? 'no data' : d.value;

                //$('#missing-y svg .active_datapoint')
                    //.html(date +  '   ' + y_val);
            //}
        //})
    //});

    //d3.json('data/small-range.json', function(data) {
        //data = convert_dates(data, 'date');

        ////small range
        //data_graphic({
            //title: "Small Range of Integers",
            //description: "When we have a data object of integers and a small range of values, the auto-generated set of y-axis ticks are filtered so that we don't include fractional values.",
            //data: data,
            //interpolate: 'basic',
            //width: torso.width,
            //height: torso.height,
            //right: torso.right,
            //target: '#small-range',
            //x_accessor: 'date',
            //y_accessor: 'value'
        //})
    //});

    //d3.json('data/fake_users1.json', function(data) {
        //data = convert_dates(data, 'date');

        //var fake_baselines = [{value:160000000, label:'a baseline'}]

        ////add a line chart
        //data_graphic({
            //title: "Line Chart",
            //description: "This is a simple line chart. You can remove the area portion by adding <i>area: false</i> to the arguments list.",
            //data: data,
            //width: torso.width,
            //height: torso.height,
            //right: torso.right,
            //baselines: fake_baselines,
            //target: '#fake_users1',
            //x_accessor: 'date',
            //y_accessor: 'value'
        //})

        //data_graphic({
            //title: "No X Axis",
            //description: "Here is an example hiding the x axis.",
            //data: data,
            //decimals: 0,
            //width: trunk.width,
            //height: trunk.height,
            //right: trunk.right,
            //xax_count: 4,
            //target: '#hidden1',
            //x_accessor: 'date',
            //y_accessor: 'value',
            //area: false,
            //x_axis: false,
            //small_text: true
        //})

        //var markers = [{
            //'date': new Date('2014-03-17T00:00:00.000Z'),
            //'label': 'Look, a spike!'
        //}];

        ////add a chart with annotations
        //data_graphic({
            //title: "Annotations",
            //description: "By setting the graphic's target a class name of main-area-solid, markers don't extend down to the bottom of the graphic, which better draws attention to, say, spikes.",
            //data: data,
            //width: torso.width,
            //height: torso.height,
            //right: torso.right,
            //markers: markers,
            //target: '#spike',
            //x_accessor: 'date',
            //y_accessor: 'value'
        //});

        //data_graphic({
            //title: "Another Least Squares Example",
            //description: "Least squares effortlessly works with dates or times on axes.",
            //data: data,
            //chart_type: 'point',
            //width: trunk.width,
            //height: trunk.height*1.5,
            //left: 60,
            //right: trunk.right,
            //least_squares: true,
            //target: '#sls-time-series',
            //x_accessor: 'date',
            //y_accessor: 'value'
        //});
    //})

var postdata = 'start_date="2010-3-3"&end_date="2014-6-25"';
var query_url='http://ec2-54-235-4-161.compute-1.amazonaws.com/ocpu/library/rlines/R/diffindiff/json/';
var postdata = 'target.region="nova"&comparison.region.set=c("dc","baltimore")&event.date="2014-01-01"';
//var postdata = "target.region=\'" + target + "\'&comparison.region.set=c(\'" + comparison.join('\',\'') + "\')&event.date=\'" + date +"\'"
    d3.json(query_url)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post(postdata, function(error, result) {
        console.log(result)
        var data = [result.target, result.comparison]
    //, function(data) {
        for(var i=0;i<data.length;i++) {
            data[i] = convert_dates(data[i], 'date');
        }
    console.log(data)

        var alldata = result.data
        alldata = convert_dates(alldata, 'date')
        console.log(alldata)

        //add a multi-line chart
        data_graphic({
            title:"Multi-Line Chart",
            description: "This line chart contains multiple lines.",
            data: data,
            width: torso.width,
            height: torso.height,
            right: torso.right,
            interpolate: 'linear',
            target: '#fake_users2',
            x_accessor: 'date',
            y_accessor: 'counts'
        });

        data_graphic({
            title:"Handling Different Sized Lines in a Single Array",
            description: "How do you handle data with multiple implied time series lengths?",
            data: alldata,
            width: torso.width*2,
            height: torso.height,
            interpolate: 'linear',
            right: torso.right,
            target: '#missing1',
            linked: true,
            y_extended_ticks: true,
            x_accessor: 'date',
            y_accessor: ['Comparison', 'Target']
        });

        //add a wide multi-line chart
        data_graphic({
            title:"Multi-Line Chart Wide",
            description: "This line chart contains multiple lines and has extended ticks enabled.",
            area: false,
            legend: ['Line 3','Line 2','Line 1'],
            legend_target: '.legend',
            data: data,
            width: torso.width*2,
            height: torso.height,
            right: trunk.right,
            show_years: false,
            xax_tick: 0,
            y_extended_ticks: true,
            target: '#fake_users3',
            x_accessor: 'date',
            y_accessor: 'value'
        })

        //linked multi-line charts
        data_graphic({
            title:"Multi-Line Linked",
            description: "Demoing linked multi-line charts.",
            data: data,
            width: torso.width,
            height: torso.height,
            right: torso.right,
            target: '#linked_multi1',
            linked: true,
            x_accessor: 'date',
            y_accessor: 'counts'
        });

        // missing data in one of a multi-line chart.
        var all_the_data = clone(data[0]);
        for (var i = 1; i < data.length; i ++){
            for (var j=0; j < data[i].length; j++){
                if (i==2 && all_the_data[j]['date'] < new Date('2014-02-01')){
                    // pass
                } else if (i==1 && all_the_data[j]['date'] > new Date('2014-03-22')) {
                    // pass
                } else {
                    all_the_data[j]['value'+(i+1)] = data[i][j].value;    

                }
            }
        }
        //data_graphic({
            //title:"Handling Different Sized Lines in a Single Array",
            //description: "How do you handle data with multiple implied time series lengths?",
            //data: all_the_data,
            //width: torso.width*2,
            //height: torso.height,
            //right: torso.right,
            //target: '#missing1',
            //linked: true,
            //y_extended_ticks: true,
            //x_accessor: 'date',
            //y_accessor: ['counts', 'counts']
        //});



    })


    function assignEventListeners() {
        $('#dark-css').click(function () {
            $('.missing')
                .css('background-image', 'url(images/missing-data-dark.png)');

            $('.wip')
                .css('background-color', '#3b3b3b');

            $('.trunk-section')
                .css('border-top-color', '#5e5e5e');

            $('.pill').removeClass('active');
            $(this).toggleClass('active');
            $('#dark').attr({href : 'css/metricsgraphics-dark.css'});

            //add this scatterplot and color the groups based on the theme
            addScatterplotSizeAndColor('dark');

            return false;
        })

        $('#light-css').click(function () {
            $('.missing')
                .css('background-image', 'url(images/missing-data.png)');

            $('.wip')
                .css('background-color', '#f1f1f1');

            $('.trunk-section')
                .css('border-top-color', '#ccc');

            $('.pill').removeClass('active');
            $(this).toggleClass('active');
            $('#dark').attr({href : ''});

            //add this scatterplot and color the groups based on the theme
            addScatterplotSizeAndColor('light');

            return false;
        })

        $('.split-by-controls button').click(function() {
            var new_y_accessor = $(this).data('y_accessor');

            //change button state
            $(this).addClass('active')
                .siblings()
                .removeClass('active');

            //update data    
            data_graphic({
                data: split_by_data,
                width: torso.width*2,
                height: trunk.height,
                right: trunk.right,
                xax_count: 4,
                target: '#split_by',
                x_accessor: 'date',
                y_accessor: new_y_accessor
            })
        })

        $('.modify-time-period-controls button').click(function() {
            var past_n_days = $(this).data('time_period');            
            var data = modify_time_period(split_by_data, past_n_days);

            //change button state
            $(this).addClass('active')
                .siblings()
                .removeClass('active');

            //update data    
            data_graphic({
                data: data,
                width: torso.width*2,
                height: trunk.height,
                right: trunk.right,
                show_years: false,
                transition_on_update: false,
                xax_count: 4,
                target: '#modify_time_period',
                x_accessor: 'date',
                y_accessor: 'beta'
            })
        })
    }
    
    document.body.addEventListener('mouseover', function(e) {
  var target = e.target, item;
  
  var upfrontRemover = function() {
    item.classList.remove('item--upfront');
    item.removeEventListener('transitionend', upfrontRemover, false);
  };
  
  if(target.classList.contains('hexagon__content')) {
    item = target.parentNode.parentNode.parentNode;
        item.addEventListener('transitionend', upfrontRemover, false);
    
    if(!item.classList.contains('item--upfront')) {
      item.classList.add('item--upfront');
    }
  }
}, false);


    //replace all SVG images with inline SVG
    //http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg
    //-image-using-css-jquery-svg-image-replacement
    $('img.svg').each(function() {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    })
})
