import React, { Component } from "react";
import "../css/Buy.css";

export default class Buy extends Component {
    render() {
        return (
            <div className="buy_main">
                <div className="buy_button">
                    <p className="buy_button_text">Book this trip for: </p>
                    <p className="buy_price">596.9 €</p>
                </div>
            </div>
        );
    }
}
