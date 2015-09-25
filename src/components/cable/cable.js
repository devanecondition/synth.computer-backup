import React from 'react';
import './cable.less';
import CableEnd from "./cable-end";

class SVGComponent extends React.Component {
    render() {
console.log(this.props);
        return (
            <svg style={this.props.position} height={this.props.height} width={this.props.width}>{this.props.children}</svg>
        );
    }
};

export default class Cable extends React.Component {

    constructor(props) {
        super();

        var top = parseInt(props.position.top),
            left = parseInt(props.position.left);

        this.voice = props.voice;

        this.position = {
            left: left,
            top: top
        };

        this.state = {
            height: 0,
            width:0,
            left: left - 8,
            top: top - 8,
            x1: 8,
            y1: 8,
            x2: 8,
            y2: 8,
            enabled: true
        };

        this._mouseMove = this.mouseMove.bind(this);
        if (this.state.enabled===true) {
            document.addEventListener('mousemove', this._mouseMove);
            document.addEventListener('mouseup', this._mouseUp.bind(this));
        }
	}

    _mouseUp(event) {
        document.removeEventListener('mousemove', this._mouseMove);
    }

    mouseMove(event) {
        event.preventDefault();

        var relativeMousePosTop = event.pageY - this.position.top,
            relativeMousePosLeft = event.pageX - this.position.left,
            svgHeight = Math.abs(relativeMousePosTop),
            svgWidth = Math.abs(relativeMousePosLeft),
            newState = {
                top: this.position.top - 8,
                left: this.position.left - 8,
                height: svgHeight + 16,
                width: svgWidth + 16,
                x2: relativeMousePosLeft + 8,
                y2: relativeMousePosTop + 8
            };

        if (relativeMousePosTop <= 0) {
            newState.top = this.position.top - svgHeight - 8;
            newState.y1 = svgHeight + 8;
            newState.y2 = 8;
        }

        if (relativeMousePosLeft <= 0) {
            newState.left = this.position.left - svgWidth - 8;
            newState.x1 = svgWidth + 8;
            newState.x2 = 8;
        }

        this.setState( newState );
    }

	render() {
        return (
            <div>
                <CableEnd top={this.position.top} left={this.position.left} />
                <svg height={this.state.height} width={this.state.width} style={{top:this.state.top, left:this.state.left}}>
            		<line x1={this.state.x1} y1={this.state.y1} x2={this.state.x2} y2={this.state.y2} strokeWidth="4" stroke="#444" />
                </svg>
            </div>
		);
	}
}