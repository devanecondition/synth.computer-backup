import React from 'react';
import './cable.less';

export default class Cable extends React.Component {

    constructor(props) {
        super();

        this.voice = props.voice;
        this.startPosition = props.startPosition || {};
        this.endPosition = props.endPosition || {};

        this.state = this.getCableCoordinates();
        this.state.enabled = (typeof props.enabled !== 'undefined') ? props.enabled : true

        this._mouseMove = this.mouseMove.bind(this);
        this._mouseUp = this.mouseUp.bind(this);

        if (props.enabled===true) {
            document.addEventListener('mousemove', this._mouseMove);
            document.addEventListener('mouseup', this._mouseUp);
        }
	}

    mouseUp(event) {

        let activeInlet = this.voice.getActiveInlet();
        let activeInletPos = this.voice.getJackPosition(activeInlet);

        if (activeInletPos) {
    
            let finalLeft = (activeInletPos.left - this.state.left) + 8;
            let finalTop = (activeInletPos.top - this.state.top) + 8;

            this.setState({
                cirle2X: finalLeft,
                x2: finalLeft,
                cirle2Y: finalTop,
                y2: finalTop
            });
        }

        document.removeEventListener('mousemove', this._mouseMove);
        document.removeEventListener('mouseup', this._mouseUp);
    }

    getCableCoordinates(event) {

        event = event || {};

        let endPointTop = this.endPosition.top + 8 || event.pageY || this.startPosition.top + 8;
        let endPointLeft = this.endPosition.left + 8 || event.pageX || this.startPosition.left + 8;
        let relativeMousePosTop = endPointTop - this.startPosition.top;
        let relativeMousePosLeft = endPointLeft - this.startPosition.left;
        let svgHeight = Math.abs(relativeMousePosTop);
        let svgWidth = Math.abs(relativeMousePosLeft);
        let coordinates = {
            top: this.startPosition.top,
            left: this.startPosition.left,
            height: svgHeight + 300,
            width: svgWidth + 40,
            x1: 8,
            x2: relativeMousePosLeft,
            y1: 8,
            y2: relativeMousePosTop,
            qX: (relativeMousePosLeft - 8)/2,
            cirle2X: relativeMousePosLeft,
            cirle2Y: relativeMousePosTop
        };

        coordinates.qY = (relativeMousePosLeft <= 8) ? coordinates.x1 - coordinates.x2 : coordinates.x2 - coordinates.x1;
        coordinates.qY = coordinates.qY * 0.3;

        if (relativeMousePosTop <= 8) {
            // 40px is the height of a jack, so make sure svg is always tall/wide enough to position connection
            coordinates.top = this.startPosition.top - svgHeight - 40;
            coordinates.height = svgHeight + 356;
            coordinates.cirle2Y = svgHeight + relativeMousePosTop + 40;
            coordinates.y1 = svgHeight + 48;
            coordinates.y2 = svgHeight + relativeMousePosTop + 40;
            coordinates.qY = coordinates.qY + svgHeight + 40;
        }

        if (relativeMousePosTop <= 0) {
            coordinates.cirle2Y = 40;
            coordinates.y2 = 40;
        }

        if (relativeMousePosLeft <= 8) {
            coordinates.left = this.startPosition.left - svgWidth - 40;
            coordinates.width = svgWidth + 56;
            coordinates.cirle2X = svgWidth + relativeMousePosLeft + 40;
            coordinates.x1 = svgWidth + 48;
            coordinates.x2 = svgWidth + relativeMousePosLeft + 40;
            coordinates.qX = ((relativeMousePosLeft - coordinates.x2)*-0.5) + relativeMousePosLeft + 16;
        }

        if (relativeMousePosLeft <= 0) {
            coordinates.cirle2X = 40;
            coordinates.x2 = 40;
            coordinates.qX = Math.abs(coordinates.qX);
        }

        return coordinates;
    }

    mouseMove(event) {
        event.preventDefault();
        this.setState(this.getCableCoordinates(event));
    }

    onLineCLick() {
        alert('clicky clicky!');
    }

	render() {

        let pathDirection = "M" + this.state.x1 + "," + this.state.y1 + " Q" + this.state.qX + "," + this.state.qY + " " +this.state.x2 + "," + this.state.y2;

        return (
            <svg height={this.state.height} width={this.state.width} style={{top:this.state.top, left:this.state.left}}>
                <path ref="cablePath" d={pathDirection} onClick={this.onLineCLick} />
                <circle cx={this.state.x1} cy={this.state.y1}></circle>
                <circle cx={this.state.cirle2X} cy={this.state.cirle2Y}></circle>
            </svg>
		);
	}
}