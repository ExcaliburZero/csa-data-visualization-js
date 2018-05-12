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

        var dateDimension = meetings.dimension(function (d) {
            return d.dd;
        });

        var yearDimension = meetings.dimension(function (d) {
            return d.Year;
        });

        console.log(dateDimension);

        meetingsTable
            .dimension(yearDimension)
            .group(function (d) {
                return d.Year;
            })
            .size(1000)
            .columns([
                "Meeting",
                "Date",
                "Year",
                "Attendees",
                "Type"
            ])
            .sortBy(function (d) {
                return d.dd;
            })
            .on("renderlet", function (table) {
                table.selectAll(".dc-table-group").classed("info", true);
            });

        console.log(data);

        dc.renderAll();

        console.log("Updated Table");
    });
}

main();
