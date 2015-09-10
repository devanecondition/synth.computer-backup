import React from 'react';
import Header from '../header/header';
import './temp-knob.less';

export default class TempKnob extends React.Component {

	constructor( params ) {
		super();

		var s = this;

        this.o = null; // array of options
        this.$ = null; // jQuery wrapped element
        this.i = null; // mixed HTMLInputElement or array of HTMLInputElement
        this.g = null; // deprecated 2D graphics context for 'pre-rendering'
        this.v = null; // value ; mixed array or integer
        this.cv = null; // change value ; not commited value
        this.x = 0; // canvas x position
        this.y = 0; // canvas y position
        this.w = 0; // canvas width
        this.h = 0; // canvas height
        this.$c = null; // jQuery canvas element
        this.c = null; // rendered canvas context
        this.t = 0; // touches index
        this.isInit = false;
        this.fgColor = null; // main color
        this.pColor = null; // previous color
        this.dH = null; // draw hook
        this.cH = null; // change hook
        this.eH = null; // cancel hook
        this.rH = null; // release hook
        this.scale = 1; // scale factor
        this.relative = false;
        this.relativeWidth = false;
        this.relativeHeight = false;
        this.$div = null; // component div
	}

	componentDidMount(component) {
		var context = React.findDOMNode(this).getContext('2d');
		this.paint(context);
	}

	componentDidUpdate() {
		var context = React.findDOMNode(this).getContext('2d');
		context.clearRect(0, 0, 200, 200);
		this.paint(context);
	}

	paint(context) {
		context.save();
		context.translate(100, 100);
		context.rotate(this.props.rotation, 100, 100);
		context.fillStyle = '#F00';
		context.fillRect(-50, -50, 100, 100);
		context.restore();
	}

	render() {
		return (
			<canvas height="200" width="200"></canvas>
		);
	}
}