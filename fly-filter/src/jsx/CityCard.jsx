import React, { Component } from "react";
import "../css/CityCard.css";

export default class CityCard extends Component {
    render() {
        return (
            <div className="citycard_main">
                <p className="citycard_name">BARCELONA</p>
                <p className="citycard_days">10 days</p>
                <div className="citycard_gradient"></div>
                <img className="citycard_image" src="https://i.imgur.com/cXv9UiO.jpg" alt=""></img>
                <div className="citycard_point"></div>
            </div>
        );
    }
}
