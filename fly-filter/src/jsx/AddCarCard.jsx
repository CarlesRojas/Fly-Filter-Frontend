import React, { Component } from "react";
import "../css/AddCarCard.css";

export default class AddCarCard extends Component {
    handleClick = () => {
        window.PubSub.emit("onAddRentalCarClick", {
            id: this.props.id
        });
    };

    render() {
        return (
            <div className="addCarCard_main">
                <div className="addCarCard_button" onClick={this.handleClick()}>
                    Rent a Car in this city
                </div>
            </div>
        );
    }
}
