import React, { Component } from "react";
import "../css/Typeform.css";

export default class Typeform extends Component {
    render() {
        return <div id="typeform_widget"></div>;
    }

    componentDidMount() {
        var element = document.getElementById("typeform_widget");

        var uniqid = require("uniqid");
        var id = uniqid();

        window.typeformEmbed.makeWidget(element, "https://developerplatform.typeform.com/to/YdmKMY?user_id=" + id, {
            hideFooter: true,
            hideHeaders: true,
            opacity: 0
        });
    }
}
