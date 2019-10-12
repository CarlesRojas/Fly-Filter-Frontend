import React, { Component } from "react";
import "../css/Typeform.css";

export default class Typeform extends Component {
    render() {
        return <div id="typeform_widget"></div>;
    }

    componentDidMount() {
        var element = document.getElementById("typeform_widget");

        window.typeformEmbed.makeWidget(element, "https://developerplatform.typeform.com/to/YdmKMY", {
            hideFooter: true,
            hideHeaders: true,
            opacity: 0
        });
    }
}
