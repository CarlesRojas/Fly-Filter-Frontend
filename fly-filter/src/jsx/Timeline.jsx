import React, { Component } from "react";
import "../css/Timeline.css";

export default class Timeline extends Component {
    render() {
        return (
            <div className="timeline_main" style={{ height: this.props.height }}>
                <svg className="timeline_svg">
                    <line className="timeline_line" x1={"50%"} x2={"50%"} y1={"2%"} y2={"98%"}></line>
                </svg>
            </div>
        );
    }
}
