import React, { Component } from "react";
import "../css/FlyCard.css";
import DepartureIcon from "../resources/icons/flight-takeoff.svg";
import ArrivalIcon from "../resources/icons/flight-landing.svg";

export default class FlyCard extends Component {
    render() {
        return (
            <div className="flycard_main">
                <img className="flycard_depart_icon" src={DepartureIcon} alt="" />
                <p className="flycard_depart_info">BCN - 15:30</p>
                <img className="flycard_arrive_icon" src={ArrivalIcon} alt="" />
                <p className="flycard_arrive_info">CDG - 17:45</p>
                <p className="flycard_date">15 Oct</p>
                <p className="flycard_price">113,7 €</p>
                <div className="flycard_point"></div>
            </div>
        );
    }
}
