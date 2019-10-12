import React, { Component } from 'react'
import "../css/SliderFilter.css"


export default class SliderFilter extends Component {
    constructor() {
        super()
        this.svgDOM = React.createRef();
        this.state = {
            sliderActive: false,
            right: 0,
            left: 0,
            pointerEvents: "none"
        }
    }

    handleMouseDouwn = (event) => {
        event.preventDefault();
        console.log("mouseDown");
        this.svgDOM.current.addEventListener("mousemove", event => this.handleMouseMove(event));
        var bounds = event.target.getBoundingClientRect();
        var x = event.clientX - bounds.left;
        var xr = -event.clientX + bounds.right;
        this.setState({
            sliderActive: true,
            left: x,
            right: xr
        })
    }
    
    handleMouseUp = (event) => {
        event.preventDefault();
        console.log("mouseUp");
        this.svgDOM.current.removeEventListener("mousemove", event => this.handleMouseMove(event));
        this.setState({
            pointerEvents: "all"
        })
    }

    handleMouseMove = (event) => {
        event.preventDefault();
        console.log("mouseMove");
        var bounds = event.target.getBoundingClientRect();
        var x = -event.clientX + bounds.right;
        this.setState({
            right: x
        })
    }

    render() {

        const { sliderActive, right, left, pointerEvents } = this.state
        
        if (sliderActive) {
            var sliderDOM = <div className="sliderFilter_handle" style={{right: right, left: left, pointerEvents: pointerEvents }}> 

            </div>
        } else {
            sliderDOM = null
        }
        
        return (       
            <div className="sliderFilter_main">
                <p className="sliderFilter_text">filter1</p>
                <svg className="sliderFilter_svg" ref = {this.svgDOM} onMouseDown = {this.handleMouseDouwn} onMouseUp = {this.handleMouseUp}>
                    <line x1="0%" y1="50%" x2="100%" y2="50%" className="sliderFilter_line"></line>
                </svg>
                {sliderDOM}
            </div>
        )
    }
}
