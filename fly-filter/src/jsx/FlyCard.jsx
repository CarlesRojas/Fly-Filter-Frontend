import React, { Component } from "react";
import "../css/FlyCard.css";
import DepartureIcon from "../resources/icons/flight-takeoff.svg";
import ArrivalIcon from "../resources/icons/flight-landing.svg";

export default class FlyCard extends Component {
    render() {
        const { origCity, destCity, price, date } = this.props;

        var normalizedDate = date.split("T")[0],
            year = normalizedDate.split("-")[0],
            month = normalizedDate.split("-")[1],
            day = normalizedDate.split("-")[2];

        return (
            <div className="flycard_main">
                <img className="flycard_depart_icon" src={DepartureIcon} alt="" />
                <p className="flycard_depart_info"> {origCity} </p>
                <img className="flycard_arrive_icon" src={ArrivalIcon} alt="" />
                <p className="flycard_arrive_info"> {destCity} </p>
                <p className="flycard_date"> {day + "-" + month + "-" + year} </p>
                <p className="flycard_price"> {price} </p>
                <div className="flycard_point"></div>
            </div>
        );
    }
}
