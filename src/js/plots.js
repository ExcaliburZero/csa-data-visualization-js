/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

function main() {
    'use strict';

    console.log("Hello, World!");

    var meetingsTable = dc.dataTable("#meetingsTable");

    d3.csv("meetings.csv").then(function (data) {
        var dateFormatSpecifier = '%m/%d/%Y';
        var dateFormat = d3.timeFormat(dateFormatSpecifier);
        var dateFormatParser = d3.timeParse(dateFormatSpecifier);
        var numberFormat = d3.format('.2f');

        data.forEach(function (d) {
            d.dd = dateFormatParser(d.Date);
            d.month = d3.timeMonth(d.dd); // pre-calculate month for better performance
            d.Attendees = +d.Attendees; // coerce to number
        });

        var meetings = crossfilter(data);
        var all = meetings.groupAll();

        var yearlyDimension = meetings.dimension(function (d) {
            return d3.timeYear(d.dd).getFullYear();
        });

        var dateDimension = meetings.dimension(function (d) {
            return d.dd;
        });

        console.log(dateDimension);

        meetingsTable
            .dimension(dateDimension)
            .group(function (d) {
                return d.Date;
            })
            .size(10)
            .columns([
                "Meeting",
                "Date",
                "Year",
                "Attendees",
                "Type"
            ]);

        console.log(data);

        dc.renderAll();

        console.log("Updated Table");
    });
}

main();
