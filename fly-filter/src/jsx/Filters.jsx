import React, { Component } from "react";
import "../css/Filters.css";
import SliderFilter from "./SliderFilter";

export default class Filters extends Component {
    render() {
        return (
            <div className="filters_main">
                <SliderFilter id={"temperature"} name={"Temperature"} />
                <SliderFilter id={"air_quality"} name={"Air Polution"} />
                <SliderFilter id={"rain"} name={"Rain"} />
                <SliderFilter id={"price"} name={"Price"} />
            </div>
        );
    }
}
