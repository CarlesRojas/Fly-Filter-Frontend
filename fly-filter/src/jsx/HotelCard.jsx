import React, { Component } from "react";
import HotelIcon from "../resources/icons/hotels.svg";
import StarIcon from "../resources/icons/star.svg";
import "../css/HotelCard.css";

export default class HotelCard extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            price: 0,
            street: "",
            numberOfStars: 0
        };
    }

    render() {
        return (
            <div className="hotelcard_main">
                <img className="hotelcard_icon" src={HotelIcon} alt="" />
                <p className="hotelcard_name">Hotel Ars</p>

                <img className="hotelcard_star1" src={StarIcon} alt="" />
                <img className="hotelcard_star2" src={StarIcon} alt="" />
                <img className="hotelcard_star3" src={StarIcon} alt="" />
                <img className="hotelcard_star4" src={StarIcon} alt="" />
                <img className="hotelcard_star5" src={StarIcon} alt="" />

                <p className="hotelcard_price">345.5 €</p>
                <div className="hotelcard_point"></div>
            </div>
        );
    }
}
