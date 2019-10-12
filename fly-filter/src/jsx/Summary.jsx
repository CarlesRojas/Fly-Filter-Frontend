import React, { Component } from "react";
import "../css/Summary.css";

export default class Summary extends Component {
    render() {
        const { city, departureDate, travelLenght } = this.props;

        var date = new Date(departureDate);
        var dateEnd = new Date(departureDate);
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        dateEnd.setDate(dateEnd.getDate() + travelLenght);

        if (date.getFullYear() === dateEnd.getFullYear() && date.getMonth() === dateEnd.getMonth()) {
            var formatted_date = date.getDate() + " - " + dateEnd.getDate() + " " + months[date.getMonth()];
        } else {
            formatted_date = date.getDate() + " " + months[date.getMonth()] + " - " + dateEnd.getDate() + " " + months[dateEnd.getMonth()];
        }

        return (
            <div className="summary_main">
                <p className="summary_city">{city}</p>
                <p className="summary_date">{formatted_date}</p>
            </div>
        );
    }
}
