import React, { Component } from "react";
import "../css/SliderFilter.css";

export default class SliderFilter extends Component {
    constructor(props) {
        super(props);

        this.svgDOM = React.createRef();
        this.state = {
            sliderActive: false,
            initial_x: 0,
            right: 0,
            left: 0,
            pointerEvents: "none"
        };
    }

    handleMouseDown = event => {
        const { id } = this.props;
        event.preventDefault();
        document.getElementById("sliderFilter_svg_" + id).addEventListener("mousemove", this.handleMouseMove);

        var bounds = event.target.getBoundingClientRect();
        var x1_from_left = event.clientX - bounds.left;
        var x2_from_right = -event.clientX + bounds.right;

        this.setState({
            sliderActive: true,
            initial_x: x1_from_left,
            left: x1_from_left,
            right: x2_from_right
        });
    };

    handleMouseUp = event => {
        const { id } = this.props;
        event.preventDefault();
        document.getElementById("sliderFilter_svg_" + id).removeEventListener("mousemove", this.handleMouseMove);

        /*
        this.setState({
            pointerEvents: "all"
        });
        */
    };

    handleMouseMove = event => {
        event.preventDefault();
        const { initial_x } = this.state;

        var bounds = event.target.getBoundingClientRect();
        var x_from_left = event.clientX - bounds.left;
        var initial_x_from_right = bounds.right - bounds.left - initial_x;
        var x_from_right = -event.clientX + bounds.right;

        if (x_from_left < initial_x) {
            this.setState({
                sliderActive: true,
                right: initial_x_from_right,
                left: x_from_left
            });
        } else {
            this.setState({
                sliderActive: true,
                left: initial_x,
                right: x_from_right
            });
        }
    };

    render() {
        const { sliderActive, right, left, pointerEvents } = this.state;
        const { id } = this.props;

        if (sliderActive) {
            var sliderDOM = <div className="sliderFilter_handle" style={{ right: right, left: left, pointerEvents: pointerEvents }}></div>;
        } else {
            sliderDOM = null;
        }

        return (
            <div className="sliderFilter_main">
                <p className="sliderFilter_text">Filter</p>
                <svg className="sliderFilter_svg" id={"sliderFilter_svg_" + id}>
                    <line x1="0%" y1="50%" x2="100%" y2="50%" className="sliderFilter_line"></line>
                </svg>
                {sliderDOM}
            </div>
        );
    }

    componentDidMount() {
        const { id } = this.props;

        // Sub to events when this component is mounted
        document.getElementById("sliderFilter_svg_" + id).addEventListener("mousedown", this.handleMouseDown);
        document.getElementById("sliderFilter_svg_" + id).addEventListener("mouseup", this.handleMouseUp);
    }

    // Stop listening to events
    componentWillUnmount() {
        const { id } = this.props;
        document.getElementById("sliderFilter_svg_" + id).removeEventListener("mousedown", this.handleMouseDown);
        document.getElementById("sliderFilter_svg_" + id).removeEventListener("mouseup", this.handleMouseUp);
    }
}
