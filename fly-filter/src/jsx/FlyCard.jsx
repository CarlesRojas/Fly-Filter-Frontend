import React, { Component } from "react";
import "../css/FlyCard.css";
import DepartureIcon from "../resources/icons/flight-takeoff.svg";
import ArrivalIcon from "../resources/icons/flight-landing.svg";

export default class FlyCard extends Component {
    render() {
        const { origCity, destCity, price, date } = this.props;


        // old depart info BCN - 15:30
        // old arrive info CDG - 17:45
        // old date 15 Oct
        // old price 113,7 €

        return (
            <div className="flycard_main">
                <img className="flycard_depart_icon" src={DepartureIcon} alt="" />
                <p className="flycard_depart_info"> {origCity} </p>
                <img className="flycard_arrive_icon" src={ArrivalIcon} alt="" />
                <p className="flycard_arrive_info"> {destCity} </p>
                <p className="flycard_date"> {date} </p>
                <p className="flycard_price"> {price} </p>
                <div className="flycard_point"></div>
            </div>
        );
    }
}
