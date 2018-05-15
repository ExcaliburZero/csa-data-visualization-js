/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

function main() {
    'use strict';

    console.log("Hello, World!");

    const meetingsTable = dc.dataTable("#meetingsTable");
    const attendanceChart = dc.scatterPlot("#attendanceChart");

    d3.csv("meetings.csv").then(function (data) {
        const dateFormatSpecifier = '%m/%d/%Y';
        const dateFormat = d3.timeFormat(dateFormatSpecifier);
        const dateFormatParser = d3.timeParse(dateFormatSpecifier);
        const numberFormat = d3.format('.2f');

        data.forEach(function (d) {
            d.dd = dateFormatParser(d.Date);
            d.month = d3.timeMonth(d.dd); // pre-calculate month for better performance
            d.Attendees = +d.Attendees; // coerce to number
        });

        const meetings = crossfilter(data);
        const all = meetings.groupAll();

        const dateDimension = meetings.dimension(function (d) {
            return [d.dd, +d.Attendees];
            //return d.dd;
        });

        const yearDimension = meetings.dimension(function (d) {
            return d.Year;
        });

        //console.log(dateDimension);

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

        const attendeesGroup = dateDimension.group().reduceSum((m) => {
            return +m.Attendees;
        });

        attendanceChart
            .width(900)
            .height(200)
            .x(d3.scaleTime().domain([new Date(2015, 0, 1), new Date(2018, 11, 31)]))
            .y(d3.scaleLinear().domain([-10, 100]))
            .mouseZoomable(true)
            .dimension(dateDimension)
            .group(attendeesGroup);

        console.log(attendeesGroup.all());

        try {
            dc.renderAll();
            attendanceChart.render();
        } catch (e) {
            console.error(e);
        }

        console.log("Updated Table");
    });
}

main();
