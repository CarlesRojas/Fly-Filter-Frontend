import React, { Component } from "react";
import * as d3geo from "d3-geo-projection";
import * as d3 from "d3";
import * as topojson from "topojson";
import * as crossfilter from "crossfilter";
import "../css/Map.css";

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            crossfilterReady: false
        };

        this.arcs = [];

        // World topojson
        this.worldTopojson = require("../resources/world.json");

        // Sub to events when this component is mounted
        window.PubSub.sub("onWindowResize", this.handleWindowResize);
        window.PubSub.sub("onDataLoaded", this.handleDataLoaded);
        window.PubSub.sub("onFilterChange", this.handleFilterChange);
    }

    handleFilterChange = ({ filterId, values }) => {
        const { crossfilterReady } = this.state;
        if (!crossfilterReady) return;

        if (filterId === "temperature") {
            this.temperatureDimension.filter(values);
            //var filter = this.temperatureDimension.top(5000);
        } else if (filterId === "air_quality") {
            this.airQualityDimension.filter(values);
            //this.airQualityDimension.top(5000);
        } else if (filterId === "rain") {
            this.rainDimension.filter(values);
        }

        var filtered_cities = this.rainDimension.top(5000);

        this.points = [];
        for (var i = 0; i < filtered_cities.length; ++i) {
            this.points.push(this.draw_point({ city: filtered_cities[i], i: i }));
        }

        this.forceUpdate();
    };

    handleWindowResize = () => {
        this.setState({
            width: this.mapDOM.offsetWidth,
            height: this.mapDOM.offsetHeight
        });

        this.create_map_projection();
    };

    handleDataLoaded = () => {
        this.filter_dataset = crossfilter(window.cityData);

        this.temperatureDimension = this.filter_dataset.dimension(function(d) {
            return d.temperature;
        });
        this.airQualityDimension = this.filter_dataset.dimension(function(d) {
            return d.airQuality;
        });
        this.rainDimension = this.filter_dataset.dimension(function(d) {
            return d.precipitation;
        });

        this.setState({ crossfilterReady: true });
    };

    draw_arc = () => {
        var p1x = 200;
        var p1y = 400;
        var p2x = 450;
        var p2y = 350;

        // mid-point of line:
        var mpx = (p2x + p1x) * 0.5;
        var mpy = (p2y + p1y) * 0.5;

        // angle of perpendicular to line:
        var theta = Math.atan2(p2y - p1y, p2x - p1x) - Math.PI / 2;

        // distance of control point from mid-point of line:
        var offset = 50;

        // location of control point:
        var c1x = mpx + offset * Math.cos(theta);
        var c1y = mpy + offset * Math.sin(theta);

        // construct the command to draw a quadratic curve
        var curve = "M" + p1x + " " + p1y + " Q " + c1x + " " + c1y + " " + p2x + " " + p2y;

        this.arcs.push(curve);
        this.forceUpdate();
    };

    draw_point = ({ city, i }) => {
        var location = city.location.replace(",", "");
        var lon = parseFloat(location.split(" ")[0]);
        var lat = parseFloat(location.split(" ")[1]);

        if (Math.abs(lon) <= 180 && Math.abs(lat) <= 90) {
            return <circle key={i} className="map_point" cx={this.projection([lon, lat])[0]} cy={this.projection([lon, lat])[1]} r="5px" />;
        } else {
            return;
        }
    };

    create_map_projection = () => {
        const width = this.mapDOM.offsetWidth;
        const height = this.mapDOM.offsetHeight;

        this.projection = d3geo
            .geoEckert3()
            .scale(1)
            .translate([0, 0]);

        this.path = d3.geoPath().projection(this.projection);
        var world = topojson.feature(this.worldTopojson, this.worldTopojson.objects.countries);

        var b = this.path.bounds(world);
        var s = 1 / Math.max(Math.abs(b[1][0] - b[0][0]) / width, Math.abs(b[1][1] - b[0][1]) / height);
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

        this.projection.scale(s).translate(t);

        // CREATE AREAS
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++

        var features = d3
            .select(this.mapSvgDOM)
            .selectAll("path.map_mapArea")
            .data(world.features);

        features.attr("d", this.path);

        features
            .enter()
            .append("path")
            .attr("class", "map_mapArea")
            .attr("d", this.path);

        features.exit().remove();
    };

    render() {
        const { width, height } = this.state;

        var arc_paths = [];
        for (var i = 0; i < this.arcs.length; ++i) {
            arc_paths.push(<path key={"map_arc_" + i} className="map_arc" d={this.arcs[i]}></path>);
        }

        return (
            <div className="map_main" ref={elem => (this.mapDOM = elem)}>
                <div className="map_zoomable">
                    <svg width={width} height={height}>
                        <g width={width} height={height} ref={elem => (this.mapSvgDOM = elem)} />
                    </svg>
                    <svg className="map_arcs" ref={elem => (this.arcsDOM = elem)}>
                        {arc_paths}
                    </svg>
                    <svg className="map_points" ref={elem => (this.pointDOM = elem)}>
                        {this.points}
                    </svg>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.handleWindowResize();
        this.create_map_projection();
        this.draw_arc();
    }

    componentWillUnmount() {
        window.PubSub.unsub("onWindowResize", this.handleWindowResize);
        window.PubSub.unsub("onDataLoaded", this.handleDataLoaded);
        window.PubSub.unsub("onFilterChange", this.handleFilterChange);
    }
}
