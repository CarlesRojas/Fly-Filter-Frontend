import React, { Component } from "react";
import "../css/CarCard.css";
import CarIcon from "../resources/icons/cars.svg";

export default class CarCard extends Component {
    render() {
        const { price } = this.props;

        return (
            <div className="carCard_main">
                <img className="carCard_icon" src={CarIcon} alt="" />
                <p className="carCard_info">Cars'a'Plenty</p>
                <p className="carCard_price">{price + " €"}</p>
                <div className="carCard_point"></div>
            </div>
        );
    }
}
