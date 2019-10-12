import React, { Component } from "react";
import "../css/SliderFilter.css";

export default class SliderFilter extends Component {
    constructor(props) {
        super(props);

        this.svgDOM = React.createRef();
        this.state = {
            sliderActive: false,
            initial_x: 0,
            second_point: 0,
            right: 0,
            left: 0,
            min: 0,
            max: 0,
            pointerEvents: "none"
        };
    }

    handleMouseDown = event => {
        const { id } = this.props;
        event.preventDefault();
        document.getElementById("sliderFilter_svg_" + id).addEventListener("mousemove", this.handleMouseMove);

        var bounds = event.target.getBoundingClientRect();
        var x_from_left = event.clientX - bounds.left;
        var x_from_right = -event.clientX + bounds.right;

        this.setState({
            sliderActive: true,
            initial_x: x_from_left,
            left: x_from_left,
            right: x_from_right
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
        const { initial_x, second_point } = this.state;

        var bounds = event.target.getBoundingClientRect();
        var x_from_left = event.clientX - bounds.left;
        var initial_x_from_right = bounds.right - bounds.left - initial_x;
        var x_from_right = -event.clientX + bounds.right;

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
                second_point: x_from_right
            });
        }
    };

    getFilterValues = () => {
        const { initial_x, second_point, min, max } = this.state;
        var values = [0,0];
        if (initial_x < second_point) {
            values = [initial_x, second_point];
        } else {
            values = [second_point, initial_x];
        }
        let width = this.container.offsetWidth;
        let dist = max - min;
        values = [(values[0]/width) * dist, (values[1]/width) * dist];
        return values;
    }

    render() {
        const { sliderActive, right, left, pointerEvents, second_point } = this.state;
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
