import React, { Component } from "react";
import "../css/Filters.css";
import SliderFilter from "./SliderFilter";

export default class Filters extends Component {
    render() {
        return (
            <div className="filters_main">
                <SliderFilter id={0} />
                <SliderFilter id={1} />
                <SliderFilter id={2} />
                <SliderFilter id={3} />
                <SliderFilter id={4} />
                <SliderFilter id={5} />
                <SliderFilter id={6} />
                <SliderFilter id={7} />
                <SliderFilter id={8} />
                <SliderFilter id={9} />
                <SliderFilter id={10} />
                <SliderFilter id={11} />
                <SliderFilter id={12} />
                <SliderFilter id={13} />
                <SliderFilter id={14} />
                <SliderFilter id={15} />
                <SliderFilter id={16} />
                <SliderFilter id={17} />
            </div>
        );
    }
}
