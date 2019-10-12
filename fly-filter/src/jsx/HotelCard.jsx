import React, { Component } from 'react'
import HotelIcon from "../resources/icons/hotels.svg";
import "../css/HotelCard.css"; 

export default class HotelCard extends Component {
    constructor() {
        super()
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
                <img className="hotelcard_img" src={HotelIcon} alt = "" />
                <p className="hotelcard_name">asd;flkja;lsdkfj</p>
                <p className="hotelcard_street"> c a;lskdj  </p>
                <p className="hotelcard_stars"> therearwe</p>
                <p className="hotelcard_price">4030.5 €</p>
            </div>
        )
    }
}