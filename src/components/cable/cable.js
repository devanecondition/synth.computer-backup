import React from 'react';
import './cable.less';

export default class Cable extends React.Component {

    constructor(props) {
        super();

        var top = parseInt(props.position.top),
            left = parseInt(props.position.left);

        this.voice = props.voice;

        this.position = props.position;

        this.state = {
            height: 0,
            width:0,
            left: left - 8,
            top: top - 8,
            x1: 8,
            y1: 8,
            x2: 8,
            y2: 8,
            enabled: true,
            mouseX: 0,
            mouseY: 0,


            cirle2X: 0,
            cirle2Y: 0
        };

        this._mouseMove = this.mouseMove.bind(this);
        if (this.state.enabled===true) {
            document.addEventListener('mousemove', this._mouseMove);
            document.addEventListener('mouseup', this._mouseUp.bind(this));
        }
	}

    _mouseUp(event) {

//         let activeInletPos = this.voice.getActiveInlet();
// console.log(this.state.top, activeInletPos.top, this.state.left, activeInletPos.left);
//         if (activeInletPos) {
//             this.setState({
//                 x2: activeInletPos.left,
//                 y2: activeInletPos.top
//             });
//         }

        document.removeEventListener('mousemove', this._mouseMove);
    }

    mouseMove(event) {

        event.preventDefault();

        let relativeMousePosTop = event.pageY - this.position.top;
        let relativeMousePosLeft = event.pageX - this.position.left;
        let svgHeight = Math.abs(relativeMousePosTop);
        let svgWidth = Math.abs(relativeMousePosLeft);
        let newState = {
            top: this.position.top,
            left: this.position.left,
            height: svgHeight + 16,
            width: svgWidth + 16,
            x1: 8,
            x2: relativeMousePosLeft,
            y1: 8,
            y2: relativeMousePosTop,
            mouseX: event.pageX,
            mouseY: event.pageY,
            cirle2X: relativeMousePosLeft,
            cirle2Y: relativeMousePosTop
        };

        if (relativeMousePosTop <= 8) {
            newState.top = this.position.top - svgHeight - 8;
            newState.height = svgHeight + 24;
            newState.cirle2Y = svgHeight + relativeMousePosTop + 8;
            newState.y1 = svgHeight + 16;
            newState.y2 = svgHeight + relativeMousePosTop + 8;
        }

        if (relativeMousePosTop <= 0) {
            newState.cirle2Y = 8;
            newState.y2 = 8;
        }

        if (relativeMousePosLeft <= 8) {
            newState.left = this.position.left - svgWidth - 8;
            newState.width = svgWidth + 24;
            newState.cirle2X = svgWidth + relativeMousePosLeft + 8;
            newState.x1 = svgWidth + 16;
            newState.x2 = svgWidth + relativeMousePosLeft + 8;
        }

        if (relativeMousePosLeft <= 0) {
            newState.cirle2X = 8;
            newState.x2 = 8;
        }

        this.setState( newState );
    }

	render() {
        return (
            <svg height={this.state.height} width={this.state.width} style={{top:this.state.top, left:this.state.left}}>
                <circle cx={this.state.x1} cy={this.state.y1} r="8" version="1.1" xmlns="http://www.w3.org/1999/xhtml" fill="#456" stroke="none"></circle>
                <line x1={this.state.x1} y1={this.state.y1} x2={this.state.x2} y2={this.state.y2} strokeWidth="4" stroke="#444" />
                <circle cx={this.state.cirle2X} cy={this.state.cirle2Y} r="8" version="1.1" xmlns="http://www.w3.org/1999/xhtml" fill="#456" stroke="none"></circle>
            </svg>
		);
	}
}