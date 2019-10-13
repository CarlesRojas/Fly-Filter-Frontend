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
        const { price } = this.props;

        var hotels = require("../resources/hotels.json");
        var randomHotelIndex = Math.floor(Math.random() * (hotels.length - 1));
        var numStars = Math.floor(Math.random() * 5) + 1;

        return (
            <div className="hotelcard_main">
                <img className="hotelcard_icon" src={HotelIcon} alt="" />
                <p className="hotelcard_name">{hotels[randomHotelIndex]}</p>

                <img className={"hotelcard_star1" + (numStars < 1 ? " hotelcard_star_hidden" : "")} src={StarIcon} alt="" />
                <img className={"hotelcard_star2" + (numStars < 2 ? " hotelcard_star_hidden" : "")} src={StarIcon} alt="" />
                <img className={"hotelcard_star3" + (numStars < 3 ? " hotelcard_star_hidden" : "")} src={StarIcon} alt="" />
                <img className={"hotelcard_star4" + (numStars < 4 ? " hotelcard_star_hidden" : "")} src={StarIcon} alt="" />
                <img className={"hotelcard_star5" + (numStars < 5 ? " hotelcard_star_hidden" : "")} src={StarIcon} alt="" />

                <p className="hotelcard_price">{price + " €"}</p>
                <div className="hotelcard_point"></div>
            </div>
        );
    }
}
