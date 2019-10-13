import React, { Component } from "react";
import * as d3geo from "d3-geo-projection";
import * as d3 from "d3";
import * as topojson from "topojson";
import * as crossfilter from "crossfilter";
/*import BackIcon from "../resources/icons/long-arrow-left.svg";*/
import BackIcon from "../resources/icons/native-android--back.svg";
import "../css/Map.css";

export default class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            left: "25%",
            width: 0,
            height: 0,
            crossfilterReady: false,
            tripOpen: false,
            numFlightsActive: 0,
            selectedArc: -1
        };

        // World topojson
        this.worldTopojson = require("../resources/world.json");

        // Sub to events when this component is mounted
        window.PubSub.sub("onWindowResize", this.handleWindowResize);
        window.PubSub.sub("onDataLoaded", this.handleDataLoaded);
        window.PubSub.sub("onFilterChange", this.handleFilterChange);
        window.PubSub.sub("onTripOpen", this.handleTripOpen);
        window.PubSub.sub("onTripClose", this.handleTripClose);
    }

    handleTripOpen = () => {
        this.setState({
            tripOpen: true,
            left: "0%"
        });
    };

    handleTripClose = () => {
        this.setState({
            tripOpen: false,
            left: "25%"
        });
    };

    handleBackIconClicked = () => {
        window.PubSub.emit("onTripClose");
    };

    handleFilterChange = ({ filterId, values }) => {
        const { crossfilterReady } = this.state;

        if (!crossfilterReady) return;

        if (filterId === "temperature") {
            this.temperatureDimension.filter(values);
        } else if (filterId === "air_quality") {
            this.airQualityDimension.filter(values);
        } else if (filterId === "rain") {
            this.rainDimension.filter(values);
        } else if (filterId === "price") {
            this.priceDimension.filter(values);

            // Apply default filter
        } else {
            const { max_temperature, min_temperature } = window.filterExtremes;
            this.temperatureDimension.filter([min_temperature, max_temperature]);
        }

        this.filtered_cities = this.priceDimension.top(5000);

        this.points = [];
        this.arcs = [];

        for (var i = 0; i < this.filtered_cities.length; ++i) {
            this.points.push(this.draw_point({ city: this.filtered_cities[i], i: i }));
            this.arcs.push(this.draw_arc({ dest_city: this.filtered_cities[i], i: i }));
        }

        this.setState({
            numFlightsActive: this.arcs.length
        });
    };

    handleFlightClicked = i => {
        if (this.filtered_cities.length > i) {
            window.PubSub.emit("onTripOpen", { origCity: this.origin_city, destCity: this.filtered_cities[i] });

            this.setState({
                selectedArc: i
            });
        }
    };

    handleWindowResize = () => {
        this.setState({
            width: this.mapDOM.offsetWidth,
            height: this.mapDOM.offsetHeight
        });

        this.create_map_projection();
    };

    handleDataLoaded = () => {
        const { city } = this.props;

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

        this.priceDimension = this.filter_dataset.dimension(function(d) {
            return d.flight.price;
        });

        this.setState({ crossfilterReady: true });

        // Find the origin city
        for (var i = 0; i < window.parsData.length; ++i) {
            if (window.parsData[i].name === city) {
                this.origin_city = window.parsData[i];
                break;
            }
        }

        const { max_temperature, min_temperature } = window.filterExtremes;
        this.handleFilterChange("temperature", [min_temperature, max_temperature]);
    };

    draw_arc = ({ dest_city, i }) => {
        const { selectedArc } = this.state;

        var location1 = this.origin_city.location.replace(",", "");
        var lon1 = parseFloat(location1.split(" ")[0]);
        var lat1 = parseFloat(location1.split(" ")[1]);

        var location2 = dest_city.location.replace(",", "");
        var lon2 = parseFloat(location2.split(" ")[0]);
        var lat2 = parseFloat(location2.split(" ")[1]);

        var dist = Math.sqrt(Math.pow(lon1 - lon2, 2) + Math.pow(lat1 - lat2, 2));
        var max_dist = Math.sqrt(Math.pow(360, 2) + Math.pow(180, 2));

        // mid-point of line:
        var mpx = (lon2 + lon1) * 0.5;
        var mpy = (lat2 + lat1) * 0.5;

        // angle of perpendicular to line:
        var theta = Math.atan2(lat2 - lat1, lon2 - lon1) - Math.PI / 2;

        // distance of control point from mid-point of line:
        var offset = 50 * (dist / max_dist);

        // location of control point:
        var c1x = mpx + offset * Math.cos(theta);
        var c1y = mpy + offset * Math.sin(theta);

        // construct the command to draw a quadratic curve
        var pixel_coords_1 = this.projection([lon1, lat1]);
        var pixel_coords_2 = this.projection([lon2, lat2]);
        var pixel_coords_control = this.projection([c1x, c1y]);
        var curve =
            "M" +
            pixel_coords_1[0] +
            " " +
            pixel_coords_1[1] +
            " Q " +
            pixel_coords_control[0] +
            " " +
            pixel_coords_control[1] +
            " " +
            pixel_coords_2[0] +
            " " +
            pixel_coords_2[1];

        if (Math.abs(lon1) <= 180 && Math.abs(lat1) <= 90 && Math.abs(lon2) <= 180 && Math.abs(lat2) <= 90) {
            return (
                <path
                    key={i}
                    className={"map_arc" + (selectedArc === i ? " map_arc_clicked" : "")}
                    d={curve}
                    onClick={() => this.handleFlightClicked(i)}
                ></path>
            );
        } else {
            return;
        }
    };

    draw_point = ({ city, i }) => {
        var location = city.location.replace(",", "");
        var lon = parseFloat(location.split(" ")[0]);
        var lat = parseFloat(location.split(" ")[1]);

        if (Math.abs(lon) <= 180 && Math.abs(lat) <= 90) {
            return <circle key={i} className="map_point" cx={this.projection([lon, lat])[0]} cy={this.projection([lon, lat])[1]} r="1.5px" />;
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

        this.forceUpdate();
    };

    render() {
        const { width, height, left, tripOpen } = this.state;

        return (
            <div className="map_main" ref={elem => (this.mapDOM = elem)} style={{ left: left }}>
                <img
                    className="map_backIcon"
                    src={BackIcon}
                    alt=""
                    onClick={() => this.handleBackIconClicked()}
                    style={{ opacity: tripOpen ? null : "0" }}
                />
                <div className="map_zoomable">
                    <svg width={width} height={height}>
                        <g width={width} height={height} ref={elem => (this.mapSvgDOM = elem)} />
                    </svg>
                    <svg className="map_arcs" ref={elem => (this.arcsDOM = elem)}>
                        {this.arcs}
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
    }

    componentWillUnmount() {
        window.PubSub.unsub("onTripOpen", this.handleTripOpen);
        window.PubSub.unsub("onTripClose", this.handleTripClose);
        window.PubSub.unsub("onWindowResize", this.handleWindowResize);
        window.PubSub.unsub("onDataLoaded", this.handleDataLoaded);
        window.PubSub.unsub("onFilterChange", this.handleFilterChange);
    }
}
