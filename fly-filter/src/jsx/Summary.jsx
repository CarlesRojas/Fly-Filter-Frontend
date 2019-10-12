import React, { Component } from "react";
import "../css/Summary.css";

export default class Summary extends Component {
    render() {
        const {city, departureDate, travelLenght} = this.props;

        var isoDate = departureDate.substring(6,10) + "-" + departureDate.substring(3,5) + "-" + departureDate.substring(0,2);
        var date = new Date(isoDate);
        var dateEnd = new Date(isoDate);
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        dateEnd.setDate(dateEnd.getDate() + travelLenght);

        return <div className="summary_main">
            <p className="summary_city">{city}</p>
            <p className="summary_date">{ date.getDate() + " " + months[ date.getMonth() ] + " " + date.getFullYear() } - {dateEnd.getDate() + " " + months[ dateEnd.getMonth() ] + " " + dateEnd.getFullYear() }</p>
        </div>;
    }
}
