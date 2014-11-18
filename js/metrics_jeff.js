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

    function capitalize(s)
    {
            return s && s[0].toUpperCase() + s.slice(1);
    }
    assignEventListeners();


    function plot_diff(){
        $("#fake_users2").empty()

            var verbose=true;
var eventdate = $("#diffdate").val();
var comparison = $("#id_comparison").val();
var target = $("#id_target").val();
var uselogs = $('#logged').is(':checked');
if (verbose){
console.log(eventdate)
console.log(comparison)
console.log(target)
console.log('Checkbox value: ' + uselogs)
}
var postdata = 'start_date="2010-3-3"&end_date="2014-6-25"';
var query_url='http://ec2-54-235-4-161.compute-1.amazonaws.com/ocpu/library/rlines/R/diffindiff/json/';
var postdata = 'target.region="nova"&comparison.region.set=c("dc","baltimore")&event.date="2014-01-01"';
var postdata = "target.region=\'" + target + "\'&comparison.region.set=c(\'" + comparison.join('\',\'') + "\')&event.date=\'" + eventdate +"\'"
if (uselogs){
    postdata = postdata + "&logged=TRUE"
}
if (verbose){
    console.log('OpenCPU Service URL:' + query_url)
    console.log('POST data: ' + postdata)
}
    var comparisons = comparison
    comparisons.forEach(function(d){ capitalize(d)})
    //Note: this currently isn't working to capitalize comparison locations
    var target_legend = capitalize(target)
    var comparison_legend = 'Comparison (' + comparisons.join(', ')  + ')'
    d3.json(query_url)
    .header("Content-Type", "application/x-www-form-urlencoded")
    .post(postdata, function(error, result) {
        if (verbose){
            console.log('Result object from server:')
            console.log(result)
        }

        var data = [result.target, result.comparison]
    //, function(data) {
        for(var i=0;i<data.length;i++) {
            data[i] = convert_dates(data[i], 'date');
        }

        var alldata = result.data
        alldata = convert_dates(alldata, 'date')
        if (verbose){
            console.log('Converted data to plot:')
            console.log(alldata)
        }

        ////add a multi-line chart
        //data_graphic({
            //title:"Multi-Line Chart",
            //description: "This line chart contains multiple lines.",
            //data: data,
            //width: torso.width,
            //height: torso.height,
            //right: torso.right,
            //interpolate: 'linear',
            //target: '#fake_users2',
            //x_accessor: 'date',
            //y_accessor: 'counts'
        //});
        var markers = [{
            'date': new Date(eventdate),
            'label': 'Event Date'
        }];
        if (verbose){
            console.log('Markers to print on graph:')
            console.log(markers)
        }

        data_graphic({
            title:"Difference in Differences Plot",
            description: "How do you handle data with multiple implied time series lengths?",
            data: alldata,
            legend: [comparison_legend, target_legend],
            legend_target: '#jeff_legend',
            width: torso.width*2,
            height: torso.height,
            interpolate: 'linear',
            right: torso.right,
            target: '#fake_users2',
            //linked: true,
            markers: markers,
            y_extended_ticks: true,
            x_accessor: 'date',
            y_accessor: ['Comparison', 'Target'],
        });

        // Begin printing dd results
        //
        var dd_table = $('<table/>', {id:'dd_table', class:'table table-striped'});
        console.log(dd_table)
        $('<tr/>', {id:'header_row'})
        .append('<td><b>Estimate</b></td>')
        .append('<td><b>Value</b></td>')
        .append('<td><b>Standard Error</b></td>')
        .appendTo(dd_table);
        // Add a header row

        $('<tr/>')
        .append('<td>Diff-in-Diff Effect</td>')
        .append('<td>' + result.diff_in_diff.b[0]+ '</td>')
        .append('<td>' + result.diff_in_diff.se[0]+ '</td>').appendTo(dd_table);

        $('<tr/>')
        .append('<td>Target Difference</td>')
        .append('<td>' + result.target_diff.b[0]+ '</td>')
        .append('<td>' + result.target_diff.se[0]+ '</td>').appendTo(dd_table);

        $('<tr/>')
        .append('<td>Comparison Difference</td>')
        .append('<td>' + result.comparison_diff.b[0]+ '</td>')
        .append('<td>' + result.comparison_diff.se[0]+ '</td>').appendTo(dd_table);
        var dd_results = $('#dd_results')
        dd_results.empty()
        $('#dd_results').append(dd_table)
        //dd_table.appendTo($('#dd_results'))


    });
    };


    function assignEventListeners() {

        $('#clicker').click(function () {
            plot_diff()


            return false;
        })
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
plot_diff()
})
