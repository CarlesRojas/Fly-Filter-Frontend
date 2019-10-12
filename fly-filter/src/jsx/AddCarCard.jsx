import React, { Component } from "react";
import "../css/AddCarCard.css";
import CarIcon from "../resources/icons/cars.svg";

export default class AddCarCard extends Component {
    render() {
        return (
            <div className="addCarCard_main">
                <img className="addCarCard_icon" src={DepartureIcon} alt="" />
            </div>
        );
    }
}
