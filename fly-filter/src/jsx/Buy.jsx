import React, { Component } from "react";
import "../css/Buy.css";

export default class Buy extends Component {
    constructor() {
        super();

        this.state = {
            price: 0
        };

        window.PubSub.sub("onPriceUpdate", this.handlePriceUpdate);
    }

    handlePriceUpdate = price => {
        this.setState({
            price: price
        });
    };

    render() {
        const { price } = this.state;
        return (
            <div className="buy_main">
                <div className="buy_button">
                    <p className="buy_button_text">Book this trip for: </p>
                    <p className="buy_price">{parseFloat(price).toFixed(1) + " €"}</p>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        window.PubSub.unsub("onPriceUpdate", this.handlePriceUpdate);
    }
}
