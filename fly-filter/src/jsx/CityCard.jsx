import React, { Component } from "react";
import "../css/CityCard.css";

export default class CityCard extends Component {
    render() {
        const { city, days, image, center } = this.props;
        console.log(center);
        return (
            <div className="citycard_main">
                <p className="citycard_name" style={{ textAlign: center ? "center" : "left" }}>
                    {city}
                </p>
                <p className="citycard_days">{days}</p>
                <div className="citycard_gradient"></div>
                <img className="citycard_image" src={image} alt=""></img>
                <div className="citycard_point"></div>
            </div>
        );
    }
}
