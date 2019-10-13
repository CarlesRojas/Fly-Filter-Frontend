import React, { Component } from "react";
import "../css/SliderFilter.css";

export default class SliderFilter extends Component {
    constructor(props) {
        super(props);

        this.svgDOM = React.createRef();
        this.state = {
            sliderActive: false,
            sliderHasFilter: false,
            initial_x: 0,
            second_point: 0,
            right: 0,
            left: 0,
            min: 0,
            max: 0,
            pointerEvents: "none",
            current_target: null,
            clickedClass: "",
            dataLoaded: false
        };

        window.PubSub.sub("onDataLoaded", this.handleDataLoaded);
        window.PubSub.sub("onFilterNameClick", () => {
            this.forceUpdate();
        });
    }

    handleDataLoaded = () => {
        const { id } = this.props;

        if (id === "temperature") {
            this.setState({
                min: window.filterExtremes["min_temperature"],
                max: window.filterExtremes["max_temperature"],
                dataLoaded: true
            });
        } else if (id === "air_quality") {
            this.setState({
                min: window.filterExtremes["min_airQuality"],
                max: window.filterExtremes["max_airQuality"],
                dataLoaded: true
            });
        } else if (id === "rain") {
            this.setState({
                min: window.filterExtremes["min_precipitation"],
                max: window.filterExtremes["max_precipitation"],
                dataLoaded: true
            });
        } else if (id === "price") {
            this.setState({
                min: window.filterExtremes["min_price"],
                max: window.filterExtremes["max_price"],
                dataLoaded: true
            });
        }

        //if (id === "temperature") this.handleFilterNameClick();
    };

    handleMouseDown = event => {
        if (event) event.preventDefault();
        document.addEventListener("mousemove", this.handleMouseMove);

        var bounds = event.target.getBoundingClientRect();
        var x_from_left = event.clientX - bounds.left;
        var x_from_right = -event.clientX + bounds.right;

        this.setState({
            sliderHasFilter: true,
            sliderActive: true,
            current_target: event.target,
            initial_x: x_from_left,
            left: x_from_left,
            right: x_from_right
        });
    };

    handleMouseUp = event => {
        if (event) event.preventDefault();
        document.removeEventListener("mousemove", this.handleMouseMove);

        this.setState({
            current_target: null
        });
    };

    handleMouseMove = event => {
        if (event) event.preventDefault();
        const { initial_x, current_target } = this.state;

        var bounds = current_target.getBoundingClientRect();
        if (event.clientX > bounds.right) var clientX = bounds.right;
        else if (event.clientX < bounds.left) clientX = bounds.left;
        else clientX = event.clientX;

        var x_from_left = clientX - bounds.left;
        var initial_x_from_right = bounds.right - bounds.left - initial_x;
        var x_from_right = -clientX + bounds.right;

        if (x_from_left < initial_x) {
            this.setState({
                sliderActive: true,
                right: initial_x_from_right,
                left: x_from_left,
                second_point: x_from_left
            });
        } else {
            this.setState({
                sliderActive: true,
                left: initial_x,
                right: x_from_right,
                second_point: x_from_left
            });
        }
    };

    getFilterValues = () => {
        const { id } = this.props;
        const { initial_x, second_point, min, max, sliderHasFilter } = this.state;

        if (!sliderHasFilter) return;

        var values = [0, 0];
        if (initial_x < second_point) {
            values = [initial_x, second_point];
        } else {
            values = [second_point, initial_x];
        }

        let width = this.mainDOM.offsetWidth;
        let dist = max - min;

        values = [min + (values[0] / width) * dist, min + (values[1] / width) * dist];

        window.PubSub.emit("onFilterChange", { filterId: id, values: values });
    };

    handleFilterNameClick = () => {
        const { id } = this.props;
        const { dataLoaded } = this.state;

        if (!dataLoaded) return;

        window.selectedID = id;
        window.PubSub.emit("onFilterNameClick", { filterId: id });
    };

    render() {
        const { sliderActive, right, left, pointerEvents, dataLoaded } = this.state;
        const { id, name } = this.props;

        if (sliderActive) {
            var sliderDOM = <div className="sliderFilter_handle" style={{ right: right, left: left, pointerEvents: pointerEvents }}></div>;
        } else {
            sliderDOM = null;
        }

        if (dataLoaded) {
            const {
                max_temperature,
                min_temperature,
                max_airQuality,
                min_airQuality,
                max_precipitation,
                min_precipitation,
                max_price,
                min_price
            } = window.filterExtremes;

            if (id === "temperature") {
                var labels = (
                    <div className="sliderFilter_references">
                        <p className="sliderFilter_ref_0">{parseInt(min_temperature) + "º"}</p>
                        <p className="sliderFilter_ref_1">{parseInt((min_temperature + max_temperature) / 2) + "º"}</p>
                        <p className="sliderFilter_ref_2">{parseInt(max_temperature) + "º"}</p>
                    </div>
                );
            } else if (id === "air_quality") {
                labels = (
                    <div className="sliderFilter_references">
                        <p className="sliderFilter_ref_0">{parseInt(min_airQuality)}</p>
                        <p className="sliderFilter_ref_1">{parseInt((min_airQuality + max_airQuality) / 2)}</p>
                        <p className="sliderFilter_ref_2">{parseInt(max_airQuality)}</p>
                    </div>
                );
            } else if (id === "rain") {
                labels = (
                    <div className="sliderFilter_references">
                        <p className="sliderFilter_ref_0">{parseInt(min_precipitation) + " l/m2"}</p>
                        <p className="sliderFilter_ref_1">{parseInt((min_precipitation + max_precipitation) / 2) + " l/m2"}</p>
                        <p className="sliderFilter_ref_2">{parseInt(max_precipitation) + " l/m2"}</p>
                    </div>
                );
            } else if (id === "price") {
                labels = (
                    <div className="sliderFilter_references">
                        <p className="sliderFilter_ref_0">{parseInt(min_price) + " €"}</p>
                        <p className="sliderFilter_ref_1">{parseInt((min_price + max_price) / 2) + " €"}</p>
                        <p className="sliderFilter_ref_2">{parseInt(max_price) + " €"}</p>
                    </div>
                );
            }
        } else {
            labels = null;
        }

        return (
            <div className="sliderFilter_main" ref={elem => (this.mainDOM = elem)}>
                <p
                    className={"sliderFilter_text" + (window.selectedID === id ? " sliderFilter_textClicked" : "")}
                    onClick={this.handleFilterNameClick}
                >
                    {name}
                </p>
                <svg className="sliderFilter_svg" id={"sliderFilter_svg_" + id}>
                    <line x1="0%" y1="50%" x2="100%" y2="50%" className="sliderFilter_line"></line>
                </svg>
                {labels}
                {sliderDOM}
            </div>
        );
    }

    componentDidUpdate() {
        this.getFilterValues();
    }

    componentDidMount() {
        const { id } = this.props;

        // Sub to events when this component is mounted
        document.addEventListener("mouseup", this.handleMouseUp);
        document.getElementById("sliderFilter_svg_" + id).addEventListener("mousedown", this.handleMouseDown);
        document.getElementById("sliderFilter_svg_" + id).addEventListener("mouseup", this.handleMouseUp);
    }

    // Stop listening to events
    componentWillUnmount() {
        const { id } = this.props;

        document.removeEventListener("mouseup", this.handleMouseUp);
        document.getElementById("sliderFilter_svg_" + id).removeEventListener("mousedown", this.handleMouseDown);
        document.getElementById("sliderFilter_svg_" + id).removeEventListener("mouseup", this.handleMouseUp);

        window.PubSub.unsub("onDataLoaded", this.handleDataLoaded);
        window.PubSub.unsub("onFilterNameClick", () => {
            this.forceUpdate();
        });
    }
}
