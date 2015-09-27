import React from 'react';
import './cable.less';

export default class Cable extends React.Component {

    constructor(props) {
        super();

        var top = parseInt(props.position.top),
            left = parseInt(props.position.left);

        this.voice = props.voice;

        this.position = props.position;
        this.cableLength = 0;

        this.state = {
            height: 0,
            width:0,
            left: left - 8,
            top: top - 8,
            x1: 8,
            y1: 8,
            x2: 8,
            y2: 8,
            qX: 0,
            qY: 0,
            enabled: true,
            mouseX: 0,
            mouseY: 0,
            cirle2X: 0,
            cirle2Y: 0,
        };

        this._mouseMove = this.mouseMove.bind(this);
        this._mouseUp = this.mouseUp.bind(this);

        if (this.state.enabled===true) {
            document.addEventListener('mousemove', this._mouseMove);
            document.addEventListener('mouseup', this._mouseUp);
        }
	}

    mouseUp(event) {

        let activeInletPos = this.voice.getActiveInlet();
        let finalLeft = (activeInletPos.left - this.state.left) + 8;
        let finalTop = (activeInletPos.top - this.state.top) + 8;

        if (activeInletPos) {
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

    updatePosition() {

        let relativeMousePosTop = event.pageY - this.position.top;
        let relativeMousePosLeft = event.pageX - this.position.left;
        let svgHeight = Math.abs(relativeMousePosTop);
        let svgWidth = Math.abs(relativeMousePosLeft);
        let halfLength = this.cableLength/3;
        let newState = {
            top: this.position.top,
            left: this.position.left,
            height: svgHeight + 300,
            width: svgWidth + 40,
            x1: 8,
            x2: relativeMousePosLeft,
            y1: 8,
            y2: relativeMousePosTop,
            qX: halfLength,
            qY: halfLength,
            mouseX: event.pageX,
            mouseY: event.pageY,
            cirle2X: relativeMousePosLeft,
            cirle2Y: relativeMousePosTop
        };

        if (relativeMousePosTop <= 8) {
            // 40px is the height of a jack, so make sure svg is always tall/wide enough to position connection
            newState.top = this.position.top - svgHeight - 40;
            newState.height = svgHeight + 356;
            newState.cirle2Y = svgHeight + relativeMousePosTop + 40;
            newState.y1 = svgHeight + 48;
            newState.y2 = svgHeight + relativeMousePosTop + 40;
            newState.qY = halfLength + svgHeight + 40;
        }

        if (relativeMousePosTop <= 0) {
            newState.cirle2Y = 40;
            newState.y2 = 40;
        }

        newState.qX = newState.x2 - newState.x1;
        if (relativeMousePosLeft <= 8) {
            newState.left = this.position.left - svgWidth - 40;
            newState.width = svgWidth + 56;
            newState.cirle2X = svgWidth + relativeMousePosLeft + 40;
            newState.x1 = svgWidth + 48;
            newState.x2 = svgWidth + relativeMousePosLeft + 40;
            newState.qX = ((relativeMousePosLeft - newState.x2)*-0.5) + relativeMousePosLeft + 16;
        }

        if (relativeMousePosLeft <= 0) {
            newState.cirle2X = 40;
            newState.x2 = 40;
        }

        this.setState( newState );
    }

    mouseMove(event) {
        event.preventDefault();
        this.updatePosition(event);
    }

    onLineCLick() {
        alert('clicky clicky!');
    }

    componentDidUpdate() {
        this.cableLength = React.findDOMNode(this.refs.cablePath).getTotalLength();
    }

	render() {

        let pathDirection = "M" + this.state.x1 + "," + this.state.y1 + " Q" + this.state.qX + "," + this.state.qY + " " +this.state.x2 + "," + this.state.y2;

        return (
            <svg height={this.state.height} width={this.state.width} style={{top:this.state.top, left:this.state.left}}>
                <circle cx={this.state.x1} cy={this.state.y1}></circle>
                <path ref="cablePath" d={pathDirection} />
                <circle cx={this.state.cirle2X} cy={this.state.cirle2Y}></circle>
            </svg>
		);
	}
}